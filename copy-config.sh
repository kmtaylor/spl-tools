#!/bin/bash

# Splits council_names.json into separate config.json files for the spl-data repo.

# This script uses the jq command, make sure it is installed before running this script.

data_path="$1"

if test -d "$data_path"; then
  jq -c '.[] | .' ./council_names.json | while IFS=' ' read -r council_block; do
    slug=$(echo "$council_block" | jq -r '.slug')
    if ! test -d "$data_path"/"$slug"; then
      mkdir "$data_path"/"$slug"
    fi
    echo "$council_block" | jq > "$data_path"/"$slug"/config.json
  done
else
  echo "Could not find $data_path"
fi
