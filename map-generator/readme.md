# Map Generator

This project is displays a map showing the boundaries of wards within a single local government area. Each ward is labelled.

The data for this comes from the VEC Map API: https://maps.vec.vic.gov.au/api/electorates/4/withboundaries

To compile the `src.js` file after every edit, run `webpack-cli --mode development --watch` in this folder.

Changes to `dist/main.js` should be committed so that other users don't need to install node.