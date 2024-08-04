#!/bin/bash

# This script uses the jq, wp, and php commands, make sure they are installed before running this script.

# The council_names.json file must contain a list of objects (one for each council).
# Each object must have the following fields: "shortName", "slug", "councilName", and "wardNames"
# The "shortName" field must be a string.
# The "slug" field must be a string.
# The "councilName" field must be a string.
# The "wardNames" field must be a list of strings.
JSON_FILE="council_names.json"

# Controls the flags that are passed to every usage of the wp command.
WP_FLAGS="--allow-root --path=/var/www/html"

function create_or_update_page() {
  local council_block="$1"
  local page_id="$2"

  short_name=$(echo "$council_block" | jq -r '.shortName')

  slug=$(echo "$council_block" | jq -r '.slug')

  content=$(echo "$council_block" | jq -c | php php-template/main.php --council-file "php://stdin" --candidates-file "candidates/$slug.csv")

  if [ $? -eq 0 ]; then

    if [[ -n "$page_id" ]]; then
      echo "Update page $short_name (post $page_id)"
      echo "$content" | wp post update "$page_id" --post_content="$content" $WP_FLAGS -
    else
      echo "Create page $short_name"
      echo "$content" | wp post create --post_type=page --post_title="$short_name" --post_status=publish $WP_FLAGS -
    fi

  else
    echo "Failed to generate page content for $short_name"
  fi
}

# Read JSON data
data=$(cat "$JSON_FILE")

# Get all page IDs in one go because the wp command is pretty slow
wp_posts=$(wp post list --post_type=page --format=json $WP_FLAGS)

# Iterate over JSON objects
jq -c '.[] | .' <<< "$data" | while IFS=' ' read -r council_block; do
  short_name=$(echo "$council_block" | jq -r '.shortName')
  page_id=$(echo $wp_posts | jq '.[] | select(.post_title == "'"$short_name"'") | .ID' | head -n 1)
  create_or_update_page "$council_block" "$page_id"
done