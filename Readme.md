# SPL Tools

SPL tools is a collection of tools to assist in building the Streets People Love website.

## council_names.json

Contains the name of each council, a "short" name, and the names of each ward in the council.

The "short" named is created by taking the electorate name and removing the words "Rural", "City", "Shire", or "Council".

The file can be generated using the `jq` tool and the VEC data:

```
jq '[.[] | {name: .electorateName, electorateId: .electorateId, shortName: .parentElectorateName | match("(.*?)(?:(?: Rural)?(?: City| Shire) Council)").captures[0].string, parentElectorateId: .parentElectorateId, councilName: .parentElectorateName }] | group_by(.parentElectorateId) | map({shortName: .[0].shortName, slug: .[0].shortName | ascii_downcase | split(" ") | join("-"), councilName: .[0].councilName, wardNames: . | map(.name) }) | sort_by(.shortName)' "VEC Data\wards.json" > council_names.json
```

## make-council-pages.sh

This is a bash script for creating a page in WordPress for each council. 

If a page for a council already exists, the page will be updated instead. The source of councils for this script is the "council_names.json" file. 

The script needs the [`jq`](https://jqlang.github.io/jq/), [`php`](https://www.php.net/) and [`wp`](https://wp-cli.org/) tools.