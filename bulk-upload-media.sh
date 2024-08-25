#!/bin/bash

# Tries to upload media to wordpress and stores a json file with the ID and url of the media.

# This script uses the jq, and wp commands, make sure they are installed before running this script.

# Additionally, make sure the wp-cli/restful package is installed in the wp command (via "wp package install wp-cli/restful")

# Controls the flags that are passed to every usage of the wp command.
WP_FLAGS="--allow-root --path=/var/www/html"

path="$1"

wp package install wp-cli/restful $WP_FLAGS

if test -d "$path"; then
  echo "Found $path, starting upload."
  for file in "$path"/*/*.jpg; do
    ./upload-media.sh "$file"
  done
  for file in "$path"/*/*.jpeg; do
    ./upload-media.sh "$file"
  done
  for file in "$path"/*/*.png; do
    ./upload-media.sh "$file"
  done
  for file in "$path"/*/*.gif; do
    ./upload-media.sh "$file"
  done
else
  echo "Could not find $path"
fi
