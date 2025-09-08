import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { useTable } from "./SortTable";

const AgLcbXCsvTable = () => {
	const [lowRows, setLowRows] = useState([]);
	const [veryLowRows, setVeryLowRows] = useState([]);
	const [activeTab, setActiveTab] = useState('low'); // 'low' | 'veryLow'
	const [showSmallComparableOnly, setShowSmallComparableOnly] = useState(false);

	// These are in a Memo to silence warnings about missing dependencies.
	// (See the places they're used as a dependency to e.g. useMemo.)
	const baseColumns = useMemo(() => ['model'], []);
	const lowResourceColumns = useMemo(() => ['lua', 'julia', 'r', 'avg'], []);
	const veryLowResourceColumns = useMemo(() => ['fortran', 'ocaml', 'avg'], []);

	useEffect(() => {
		fetch(process.env.PUBLIC_URL + '/aglcbx-main-pls.csv')
			.then(response => response.text())
			.then(text => {
				Papa.parse(text, {
					header: true,
					dynamicTyping: true,
					skipEmptyLines: true,
					complete: (result) => {
						setLowRows(result.data);
					}
				});
			});

		fetch(process.env.PUBLIC_URL + '/aglcbx-secondary-pls.csv')
			.then(response => response.text())
			.then(text => {
				Papa.parse(text, {
					header: true,
					dynamicTyping: true,
					skipEmptyLines: true,
					complete: (result) => {
						setVeryLowRows(result.data);
					}
				});
			});
	}, []);

    const columns = useMemo(() => (
        activeTab === 'low'
            ? [...baseColumns, ...lowResourceColumns]
            : [...baseColumns, ...veryLowResourceColumns]
    ), [activeTab, baseColumns, lowResourceColumns, veryLowResourceColumns]);

	const displayRows = useMemo(() => {
		const baseRows = activeTab === 'low' ? lowRows : veryLowRows;
		if (showSmallComparableOnly) {
			return baseRows.filter(row => row['is-small-comparable'] === true);
		}
		return baseRows;
	}, [activeTab, lowRows, veryLowRows, showSmallComparableOnly]);

	// Count missing cells in each dataset
	const missingCellCounts = useMemo(() => {
		const countMissingInRows = (rows, languageColumns) => {
			return rows.reduce((total, row) => {
				return total + languageColumns.reduce((rowTotal, col) => {
					return rowTotal + (row[col] === '?' ? 1 : 0);
				}, 0);
			}, 0);
		};

		const lowMissing = countMissingInRows(lowRows, lowResourceColumns);
		const veryLowMissing = countMissingInRows(veryLowRows, veryLowResourceColumns);

		return {
			low: lowMissing,
			veryLow: veryLowMissing,
			total: lowMissing + veryLowMissing,
			current: activeTab === 'low' ? lowMissing : veryLowMissing
		};
	}, [lowRows, veryLowRows, activeTab, lowResourceColumns, veryLowResourceColumns]);

    const getColumnLabel = (key) => {
        if (key === 'org') return 'Organization';
        if (key === 'avg') return 'Average';
        return key.charAt(0).toUpperCase() + key.slice(1);
    };

    const getSpecialClass = (key) => {
        if (key === 'model') return 'model-col';
        if (key === 'org') return 'organization-col';
        if (key === 'avg') return 'avg-col';
        return undefined;
    };

	const columnsDef = useMemo(() => {
		return columns.map((key) => ({
			label: getColumnLabel(key),
			accessor: key,
			sortable: true,
			className: getSpecialClass(key),
			...(key === lowResourceColumns[0] && { sortbyOrder: 'desc' })
		}));
	}, [columns, lowResourceColumns]);

	const [sortedData, handleSorting, , , sortField, sortOrder] = useTable(displayRows, columnsDef, {}, {}, 'model', {});

	const handleSortingChange = (accessor) => {
		const order = accessor === sortField && sortOrder === 'desc' ? 'asc' : 'desc';
		handleSorting(accessor, order);
	};

	const getSortClass = (accessor) => {
		return sortField === accessor ? (sortOrder === 'asc' ? 'up' : 'down') : 'default';
	};

    return (
        <div className="table-container">
			<div className="agnostics-tabs">
				<button
					onClick={() => { setActiveTab('low'); handleSorting(lowResourceColumns[0], 'desc')}}
					className={activeTab === 'low' ? 'active' : ''}
				>
					Low resource
				</button>
				<button
					onClick={() => { setActiveTab('veryLow'); handleSorting(veryLowResourceColumns[0], 'desc')}}
					className={activeTab === 'veryLow' ? 'active' : ''}
				>
					Very low resource
				</button>
			</div>
			<div className="filter-controls">
				<label className="checkbox-label">
					<input
						type="checkbox"
						checked={showSmallComparableOnly}
						onChange={(e) => setShowSmallComparableOnly(e.target.checked)}
					/>
					&nbsp;Only keep models comparable to small (≤16B) ones
				</label>
			</div>
			{missingCellCounts.total > 0 && (
				<div className="missing-cells-info">
					<div className="missing-cells-current">
						Current tab: {missingCellCounts.current} missing cells
					</div>
					<div className="missing-cells-summary">
						Total missing cells - Low resource: {missingCellCounts.low}, Very low resource: {missingCellCounts.veryLow}, Overall: {missingCellCounts.total}
					</div>
				</div>
			)}
            <div className="scrollable-table">
                <div className="table-wrap">
                    <table className="main-table table">
                        <thead>
                            <tr>
							{columnsDef.map((col) => (
								<th
									key={col.accessor}
									onClick={() => handleSortingChange(col.accessor)}
									className={[getSortClass(col.accessor), col.className].filter(Boolean).join(' ')}
								>
									{col.label}
							    </th>
							))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((row, idx) => (<tr key={idx}>
                                {columnsDef.map((col, i) => {
                                    const languageColumns = activeTab === 'low' ? lowResourceColumns : veryLowResourceColumns;
                                    const isMissingData = languageColumns.includes(col.accessor) && row[col.accessor] === '?';
                                    const cellClass = [col.className, isMissingData ? 'missing-data-cell' : ''].filter(Boolean).join(' ');

                                    // Add star after a small model's name
                                    let cellContent = row[col.accessor];
                                    if (col.accessor === 'model' && row['org'] === 'ours') {
                                        cellContent = cellContent + ' ★';
                                    }

                                    return (
                                        <td key={i} className={cellClass}>{cellContent}</td>
                                    );
                                })}
                            </tr>))}
                        </tbody>
                    </table>
					<p>★ - a model trained using the Agnostics framework.</p>
                </div>
            </div>
        </div>
    );
};

export default AgLcbXCsvTable;
