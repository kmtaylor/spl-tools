# SPL Tools

SPL tools is a collection of tools to assist in building the Streets People Love website.

## csv-normaliser

A PHP script for converting the raw .csv files received from volunteers into a .csv file that can be used by the php-template tool. Ensures that ward names are capitalised correctly, and identifies which picture to use for each candidate.

## map-generator

A webpage built using Mapbox for showing the boundaries of the wards in a particular council. Also contains some JS scripts for generating a .jpg image of each council's map.

## php-template

A PHP script for generating the HTML to use in each council page on the Streets People Love website. Handles reading each of the relevant configuration files and exposing them in a format that can easily be consumed in a regular PHP template. This is used by the make-council-page.sh script.

## VEC Data

This folder contains the raw data downloaded from the VEC Map website.

## bulk-upload-media.sh

A script for uploading all images in the spl-data folder to WordPress. Uses the `upload-media.sh` script to handle uploading each image.

## copy-config.sh

A script for splitting up `council_names.json` into separate `config.json` files for each council. Shouldn't need to be used again.

## council_names.json

Contains the name of each council, a "short" name, and the names of each ward in the council.

The "short" named is created by taking the electorate name and removing the words "Rural", "City", "Shire", or "Council".

The file can be generated using the `jq` tool and the VEC data:

```
jq '[.[] | {name: .electorateName, electorateId: .electorateId, shortName: .parentElectorateName | match("(.*?)(?:(?: Rural)?(?: City| Shire) Council)").captures[0].string, parentElectorateId: .parentElectorateId, councilName: .parentElectorateName }] | group_by(.parentElectorateId) | map({shortName: .[0].shortName, slug: .[0].shortName | ascii_downcase | split(" ") | join("-"), councilName: .[0].councilName, wardNames: . | map(.name) }) | sort_by(.shortName)' "VEC Data\wards.json" > council_names.json
```

## lga-links-filter

This is a jq filter that will output a HTML anchor tag for each council. Can be used like this:

```
jq -f -r .\lga-links-filter .\council_names.json
```

## make-council-pages.sh

This is a bash script for creating a page in WordPress for each council. 

If a page for a council already exists, the page will be updated instead. The source of councils for this script is the "council_names.json" file. 

The script needs the [`jq`](https://jqlang.github.io/jq/), [`php`](https://www.php.net/) and [`wp`](https://wp-cli.org/) tools.

## upload-media.sh

Tries to upload a file to WordPress and stores the media ID and URL in a .json file next to the file. If the .json file is already present, the upload will be skipped.

