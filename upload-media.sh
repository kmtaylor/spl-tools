#!/bin/bash

# Tries to upload media to wordpress and stores a json file with the ID and url of the media.

# This script uses the jq, and wp commands, make sure they are installed before running this script.

# Additionally, make sure the wp-cli/restful package is installed in the wp command (via "wp package install wp-cli/restful")

# Controls the flags that are passed to every usage of the wp command.
WP_FLAGS="--allow-root --path=/var/www/html"

media_path="$1"

if test -f "$media_path"; then
  if test -f "$media_path.json"; then
    echo "Found $media_path.json, skipping uploading media."
  else
    echo "Could not find $media_path.json, uploading media!"
    id=$(wp media import "$media_path" --porcelain $WP_FLAGS)
    raw_url=$(wp rest attachment get "$id" --field=source_url $WP_FLAGS)
    if [ $? -eq 0 ]; then
      url=$(echo "$raw_url" | sed 's/127.0.0.1/streetspeoplelove.org/')
      jq -n --arg id $id --arg url "$url" '{"id": $id, "url": $url}' > "$media_path.json"
      cat "$media_path.json"
    else 
      echo "Failed to upload $media_path"
    fi
  fi
else
  echo "Could not find $media_path"
fi
