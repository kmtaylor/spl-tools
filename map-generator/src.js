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
    center: [145.00724,-37.79011]
});

map.addControl(new mapboxgl.NavigationControl());

fetch("wards_withboundaries.json")
    .then(response => {
        response.json()
            .then((wardData) => {
                const filteredWardData = wardData.filter((ward) => normaliseCouncilName(ward.parentElectorateName) == councilName);

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

                    const centrePoint = polylabel(featureCollection.features[0].geometry.coordinates, 0.000001);

                    map.addSource('center_'+wardData.electorateId, {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': [
                                {
                                    'type': 'Feature',
                                    'properties': {
                                        'description': wardData.electorateName
                                    },
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': centrePoint
                                    }
                                }
                            ]
                        }
                    });

                    map.addLayer({
                        'id': 'label_'+wardData.electorateId,
                        'type': 'symbol',
                        'source': 'center_'+wardData.electorateId,
                        'layout': {
                            'text-field': ['get', 'description'],
                            'text-variable-anchor': ['center', 'top', 'bottom'],
                            'text-justify': 'auto',
                            'text-allow-overlap': true
                        }
                    });

                });

            }).catch(err => {
                console.log(err);
            });
    })
    


map.on('style.load', () => {
    map.setConfigProperty('basemap', 'showPlaceLabels', false);
    map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
    map.setConfigProperty('basemap', 'showRoadLabels', false);
    map.setConfigProperty('basemap', 'showTransitLabels', false);
    map.setConfigProperty('basemap', 'show3dObjects', false);
});