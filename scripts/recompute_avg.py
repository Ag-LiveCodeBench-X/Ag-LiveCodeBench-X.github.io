#!/usr/bin/env python3
import argparse
import csv
import math
from pathlib import Path
from typing import List


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Recompute the 'avg' column in CSV files as the arithmetic mean of all "
            "columns that appear after the 'avg' column in the header."
        )
    )
    parser.add_argument(
        "paths",
        nargs="+",
        help="One or more CSV file paths to process (updated in place).",
    )
    return parser.parse_args()


def try_parse_float(value: str):
    try:
        number = float(value)
        if math.isfinite(number):
            return number
        return None
    except (TypeError, ValueError):
        return None


def recompute_avg_for_csv(csv_path: Path) -> None:
    with csv_path.open("r", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames: List[str] = reader.fieldnames or []
        if not fieldnames:
            return

        if "avg" not in fieldnames:
            raise ValueError(f"File '{csv_path}' does not contain an 'avg' column.")

        avg_index = fieldnames.index("avg")
        value_columns = fieldnames[avg_index + 1 :]

        rows = list(reader)

    for row in rows:
        numeric_values: List[float] = []
        for col in value_columns:
            val = row.get(col, "")
            number = try_parse_float(val)
            if number is not None:
                numeric_values.append(number)

        if numeric_values:
            avg_value = sum(numeric_values) / len(numeric_values)
            row["avg"] = str(round(avg_value))
        else:
            row["avg"] = "0"

    with csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    args = parse_args()
    for p in args.paths:
        recompute_avg_for_csv(Path(p))


if __name__ == "__main__":
    main()


