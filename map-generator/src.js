import polylabel from 'polylabel';

function normaliseCouncilName(str) {
    const regex = /(.*?)(?:(?: Rural)?(?: City| Shire) Council)/g;
    const matches = str.matchAll(regex);

    // If we get a match, convert to slug format
    for (const match of matches) {
        return match[1].toLowerCase().replace(" ", "-");
    }

    // If we didn't find any matches, try convert input to slug format
    return str.toLowerCase().replace(" ", "-");
};

const searchParams = new URLSearchParams(window.location.search);
const councilName = normaliseCouncilName(searchParams.get("council"));
console.log(councilName);

mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dHl3YXkiLCJhIjoiY2x6eG9vMzZyMHY2cDJqb3M1ODZnNjF4cyJ9.IX8CfYQZUaQhSjWgMXmsEA';
const map = new mapboxgl.Map({
    container: 'map',
    zoom: 10,
    style: 'mapbox://styles/mattyway/clzy2ozzf004k01pn840h9xdb',
    center: [145.00724,-37.79011]
});

fetch("wards_withboundaries.json")
    .then(response => {
        response.json()
            .then((wardData) => {
                const filteredWardData = wardData.filter((ward) => normaliseCouncilName(ward.parentElectorateName) == councilName);

                var bounds = {
                    "west": undefined,
                    "south": undefined,
                    "east": undefined,
                    "north": undefined
                }

                function addToBounds(coordinate) {
                    if (bounds.west == undefined || coordinate[0] < bounds.west) {
                        bounds.west = coordinate[0];
                    }

                    if (bounds.south == undefined || coordinate[1] < bounds.south) {
                        bounds.south = coordinate[1];
                    }

                    if (bounds.east == undefined || coordinate[0] > bounds.east) {
                        bounds.east = coordinate[0];
                    }

                    if (bounds.north == undefined || coordinate[1] > bounds.north) {
                        bounds.north = coordinate[1];
                    }
                }

                var labelFeatures = [];

                filteredWardData.forEach(wardData => {
                    const featureCollection = {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'geometry': JSON.parse(wardData.boundaryJson)
                            }
                        ]
                    };

                    if (featureCollection.features[0].geometry.type == "Polygon") {
                        featureCollection.features[0].geometry.coordinates[0].forEach(coordinate => {
                            addToBounds(coordinate);
                        });
                    }
                    if (featureCollection.features[0].geometry.type == "MultiPolygon") {
                        featureCollection.features[0].geometry.coordinates.forEach(polygon => {
                            polygon[0].forEach(coordinate => {
                                addToBounds(coordinate);
                            });
                        });
                    }

                    // Add data
                    map.addSource("data_"+wardData.electorateId, {
                        'type': 'geojson',
                        'data': featureCollection
                    });

                    // Add a line along the data
                    map.addLayer({
                        'id': "outline_"+wardData.electorateId,
                        'type': 'line',
                        'source': "data_"+wardData.electorateId,
                        'layout': {},
                        'paint': {
                            'line-color': '#0899fe',
                            'line-width': 3
                        }
                    });

                    var centrePoint;
                    if (featureCollection.features[0].geometry.type == "Polygon") {
                        centrePoint = polylabel(featureCollection.features[0].geometry.coordinates, 0.000001);
                    }
                    if (featureCollection.features[0].geometry.type == "MultiPolygon") {
                        // TODO: Find the biggest polygon in the multipolygon and use that to find the centre point 
                        // instead of just picking the second polygon.
                        //
                        // The 2024 set of boundaries only uses 2 MultiPolygon objects (Cathedral in Murrindindi Shire Council and Island in Bass Coast Shire Council)
                        // Luckily, the second polygon for both objects results in a good label placement.
                        centrePoint = polylabel(featureCollection.features[0].geometry.coordinates[1], 0.000001);
                    }
                    

                    if (wardData.electorateName.includes(' ')) {
                        // Breaking long names into newlines looks better
                        const parts = wardData.electorateName.split(' ');
                        // Special case if a ward starts with "St" (like "St Albans East")
                        // Join the first two parts
                        if (parts[0] == "St") {
                            parts[0] = parts[0] + ' ' + parts[1];
                            parts.splice(1, 1);
                        }
                        const wardNameNewLines = parts.join('\n');
                        labelFeatures.push({
                            'type': 'Feature',
                            'properties': {
                                'description': wardNameNewLines
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': centrePoint
                            }
                        });
                    } else {
                        labelFeatures.push({
                            'type': 'Feature',
                            'properties': {
                                'description': wardData.electorateName
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': centrePoint
                            }
                        });
                    }
                });

                map.addSource('labels', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': labelFeatures
                    }
                });

                map.addLayer({
                    'id': 'labels',
                    'type': 'symbol',
                    'source': 'labels',
                    'layout': {
                        'text-field': ['get', 'description'],
                        'text-variable-anchor': ['center', 'top', 'bottom'],
                        'text-radial-offset': 0.5,
                        'text-padding': 0,
                        'text-justify': 'auto',
                        'text-allow-overlap': false,
                        'text-ignore-placement': false,
                    }
                });

                map.fitBounds([
                    [bounds.west, bounds.south],
                    [bounds.east, bounds.north]
                ], {
                    padding: 25,
                    animate: false
                });

            }).catch(err => {
                console.log(err);
            });
    });
    