# Map Generator

This project displays a map showing the boundaries of wards within a single local government area. Each ward is labelled.

The data for this comes from the VEC Map API: https://maps.vec.vic.gov.au/api/electorates/4/withboundaries

To allow the page to download the `wards_withboundaries.json` file, the page needs to be accessed via a `http://` URL (and not a `file:///` URL). One easy way to do this is with the web server built into Python, it can be started by running `python3 -m http.server` in this folder.

To tell the page which council to load, add a query parameter to the URL eg. `?council=brimbank` or `?council=Melbourne%20City%20Council`

To automatically compile the `src.js` file after every edit, run `webpack-cli --mode development --watch` in this folder.

Changes to `dist/main.js` should be committed so that other users don't need to install node.

The `capture-map.js` script can be used to capture an image of the map. It accepts 4 arguments, the council name, width, height, and output path. For example `node .\capture-map.js brimbank 900 500 ../../spl-data/brimbank/map.jpg` would capture a map of Brimbank City Council and place a file named `map.jpg` in the `../../spl-data/brimbank/` folder.