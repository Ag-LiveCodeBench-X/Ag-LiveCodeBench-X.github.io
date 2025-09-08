#!/usr/bin/env bash

cp public/aglcbx-main-pls.csv public/.aglcbx-main-pls.csv.bak
cp public/aglcbx-secondary-pls.csv public/.aglcbx-secondary-pls.csv.bak

python3 scripts/recompute_avg.py public/aglcbx-main-pls.csv
python3 scripts/recompute_avg.py public/aglcbx-secondary-pls.csv