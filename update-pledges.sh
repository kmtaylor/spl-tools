#!/bin/bash

# If this runs as a cron job - might want to limit the number of revisions wordpress stores:
#   wp-config.php:
#     define( 'WP_POST_REVISIONS', 3 );

#wp post list --post_type=page
#wp post get 426 --field=content > current-homepage
#wp post get 1409 --field=content > movie-homepage
#wp post create --post_type=page --post_title="test_pledge" movie-homepage
#wp post update 1803 ../spl-data/movie-homepage

DATA_PATH="../spl-data"

candidates_files=()
for folder in "$DATA_PATH"/*; do
    if test -f "$folder"/candidates.csv; then
        candidates_files+=("$folder"/candidates.csv)
    fi
done

php pledge-update/main.php --candidates-files "${candidates_files[*]}"
