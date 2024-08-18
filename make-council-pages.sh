#!/bin/bash

# This script uses the jq, wp, and php commands, make sure they are installed before running this script.

# The folder containing data for each council.
# Includes the list of candidates and any media.
DATA_PATH="../spl-data"

# Controls the flags that are passed to every usage of the wp command.
WP_FLAGS="--allow-root --path=/var/www/html"

function create_or_update_page() {
  local council_block="$1"
  local page_id="$2"

  short_name=$(echo "$council_block" | jq -r '.shortName')

  slug=$(echo "$council_block" | jq -r '.slug')

  media_inputs=()
  for file in "$DATA_PATH"/$slug/*.{jpeg,jpg,png,gif}.json; do
    if test -f "$file"; then
      media_inputs+=("$file")
    fi
  done
  for file in "$DATA_PATH"/*.{jpeg,jpg,png,gif}.json; do
    if test -f "$file"; then
      media_inputs+=("$file")
    fi
  done

  jq -n '[inputs | { (input_filename | sub("\\.json$"; "") | sub("^.+/"; "")): . }] | reduce .[] as $item ({}; . + $item)' "${media_inputs[@]}" > "$DATA_PATH"/$slug/media.json

  content=$(echo "$council_block" | jq -c | php php-template/main.php --council-file "php://stdin" --candidates-file "$DATA_PATH"/$slug/candidates.csv --media-file "$DATA_PATH"/$slug/media.json )

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

  rm "$DATA_PATH"/$slug/media.json
}

# Get all page IDs in one go because the wp command is pretty slow
wp_posts=$(wp post list --post_type=page --format=json $WP_FLAGS)

selected_council="$1"

# Iterate over folders in data path
for folder in "$DATA_PATH"/*; do
  if test -f "$folder"/config.json; then
    council_block=$(cat "$folder"/config.json | jq -c)
    short_name=$(echo "$council_block" | jq -r '.shortName')
    page_id=$(echo $wp_posts | jq '.[] | select(.post_title == "'"$short_name"'") | .ID' | head -n 1)
    if [ ! "$selected_council" ] || [ "$short_name" = "$selected_council" ]; then
      create_or_update_page "$council_block" "$page_id"
    fi
  fi
done