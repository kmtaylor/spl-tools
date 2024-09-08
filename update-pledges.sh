#!/bin/bash

#wp post list --post_type=page
#wp post get 426 --field=content > current-homepage
#wp post get 1409 --field=content > movie-homepage
#wp post create --post_type=page --post_title="test_pledge" movie-homepage

wp post update 1803 ../spl-data/movie-homepage
