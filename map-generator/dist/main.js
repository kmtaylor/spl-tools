/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src.js":
/*!****************!*\
  !*** ./src.js ***!
  \****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var polylabel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! polylabel */ \"./node_modules/polylabel/polylabel.js\");\n\r\n\r\nfunction normaliseCouncilName(str) {\r\n    const regex = /(.*?)(?:(?: Rural)?(?: City| Shire) Council)/g;\r\n    const matches = str.matchAll(regex);\r\n\r\n    // If we get a match, convert to slug format\r\n    for (const match of matches) {\r\n        return match[1].toLowerCase().replace(\" \", \"-\");\r\n    }\r\n\r\n    // If we didn't find any matches, try convert input to slug format\r\n    return str.toLowerCase().replace(\" \", \"-\");\r\n};\r\n\r\nconst searchParams = new URLSearchParams(window.location.search);\r\nconst councilName = normaliseCouncilName(searchParams.get(\"council\"));\r\nconsole.log(councilName);\r\n\r\nmapboxgl.accessToken = 'pk.eyJ1IjoibWF0dHl3YXkiLCJhIjoiY2x6eG9vMzZyMHY2cDJqb3M1ODZnNjF4cyJ9.IX8CfYQZUaQhSjWgMXmsEA';\r\nconst map = new mapboxgl.Map({\r\n    container: 'map',\r\n    zoom: 10,\r\n    style: 'mapbox://styles/mattyway/clzy2ozzf004k01pn840h9xdb',\r\n    center: [145.00724,-37.79011]\r\n});\r\n\r\nmap.addControl(new mapboxgl.NavigationControl());\r\n\r\nfetch(\"wards_withboundaries.json\")\r\n    .then(response => {\r\n        response.json()\r\n            .then((wardData) => {\r\n                const filteredWardData = wardData.filter((ward) => normaliseCouncilName(ward.parentElectorateName) == councilName);\r\n\r\n                var bounds = {\r\n                    \"west\": undefined,\r\n                    \"south\": undefined,\r\n                    \"east\": undefined,\r\n                    \"north\": undefined\r\n                }\r\n\r\n                var labelFeatures = [];\r\n\r\n                filteredWardData.forEach(wardData => {\r\n                    const featureCollection = {\r\n                        'type': 'FeatureCollection',\r\n                        'features': [\r\n                            {\r\n                                'type': 'Feature',\r\n                                'geometry': JSON.parse(wardData.boundaryJson)\r\n                            }\r\n                        ]\r\n                    };\r\n\r\n                    featureCollection.features[0].geometry.coordinates[0].forEach(coordinate => {\r\n                        if (bounds.west == undefined || coordinate[0] < bounds.west) {\r\n                            bounds.west = coordinate[0];\r\n                        }\r\n\r\n                        if (bounds.south == undefined || coordinate[1] < bounds.south) {\r\n                            bounds.south = coordinate[1];\r\n                        }\r\n\r\n                        if (bounds.east == undefined || coordinate[0] > bounds.east) {\r\n                            bounds.east = coordinate[0];\r\n                        }\r\n\r\n                        if (bounds.north == undefined || coordinate[1] > bounds.north) {\r\n                            bounds.north = coordinate[1];\r\n                        }\r\n                    });\r\n\r\n                    // Add data\r\n                    map.addSource(\"data_\"+wardData.electorateId, {\r\n                        'type': 'geojson',\r\n                        'data': featureCollection\r\n                    });\r\n\r\n                    // Add a line along the data\r\n                    map.addLayer({\r\n                        'id': \"outline_\"+wardData.electorateId,\r\n                        'type': 'line',\r\n                        'source': \"data_\"+wardData.electorateId,\r\n                        'layout': {},\r\n                        'paint': {\r\n                            'line-color': '#0899fe',\r\n                            'line-width': 3\r\n                        }\r\n                    });\r\n\r\n                    const centrePoint = (0,polylabel__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(featureCollection.features[0].geometry.coordinates, 0.000001);\r\n\r\n                    if (wardData.electorateName.includes(' ')) {\r\n                        // Breaking long names into newlines looks better\r\n                        const parts = wardData.electorateName.split(' ');\r\n                        // Special case if a ward starts with \"St\" (like \"St Albans East\")\r\n                        // Join the first two parts\r\n                        if (parts[0] == \"St\") {\r\n                            parts[0] = parts[0] + ' ' + parts[1];\r\n                            parts.splice(1, 1);\r\n                        }\r\n                        const wardNameNewLines = parts.join('\\n');\r\n                        labelFeatures.push({\r\n                            'type': 'Feature',\r\n                            'properties': {\r\n                                'description': wardNameNewLines\r\n                            },\r\n                            'geometry': {\r\n                                'type': 'Point',\r\n                                'coordinates': centrePoint\r\n                            }\r\n                        });\r\n                    } else {\r\n                        labelFeatures.push({\r\n                            'type': 'Feature',\r\n                            'properties': {\r\n                                'description': wardData.electorateName\r\n                            },\r\n                            'geometry': {\r\n                                'type': 'Point',\r\n                                'coordinates': centrePoint\r\n                            }\r\n                        });\r\n                    }\r\n                });\r\n\r\n                map.addSource('labels', {\r\n                    'type': 'geojson',\r\n                    'data': {\r\n                        'type': 'FeatureCollection',\r\n                        'features': labelFeatures\r\n                    }\r\n                });\r\n\r\n                map.addLayer({\r\n                    'id': 'labels',\r\n                    'type': 'symbol',\r\n                    'source': 'labels',\r\n                    'layout': {\r\n                        'text-field': ['get', 'description'],\r\n                        'text-variable-anchor': ['center', 'top', 'bottom'],\r\n                        'text-radial-offset': 0.5,\r\n                        'text-padding': 0,\r\n                        'text-justify': 'auto',\r\n                        'text-allow-overlap': false,\r\n                        'text-ignore-placement': false,\r\n                    }\r\n                });\r\n\r\n                map.fitBounds([\r\n                    [bounds.west, bounds.south],\r\n                    [bounds.east, bounds.north]\r\n                ], {\r\n                    padding: 25,\r\n                    animate: false\r\n                });\r\n\r\n            }).catch(err => {\r\n                console.log(err);\r\n            });\r\n    });\r\n    \n\n//# sourceURL=webpack:///./src.js?");

/***/ }),

/***/ "./node_modules/polylabel/polylabel.js":
/*!*********************************************!*\
  !*** ./node_modules/polylabel/polylabel.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ polylabel)\n/* harmony export */ });\n/* harmony import */ var tinyqueue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tinyqueue */ \"./node_modules/tinyqueue/index.js\");\n\n\n\nfunction polylabel(polygon, precision = 1.0, debug = false) {\n    // find the bounding box of the outer ring\n    let minX = Infinity;\n    let minY = Infinity;\n    let maxX = -Infinity;\n    let maxY = -Infinity;\n\n    for (const [x, y] of polygon[0]) {\n        if (x < minX) minX = x;\n        if (y < minY) minY = y;\n        if (x > maxX) maxX = x;\n        if (y > maxY) maxY = y;\n    }\n\n    const width = maxX - minX;\n    const height = maxY - minY;\n    const cellSize = Math.max(precision, Math.min(width, height));\n\n    if (cellSize === precision) {\n        const result = [minX, minY];\n        result.distance = 0;\n        return result;\n    }\n\n    // a priority queue of cells in order of their \"potential\" (max distance to polygon)\n    const cellQueue = new tinyqueue__WEBPACK_IMPORTED_MODULE_0__[\"default\"]([], (a, b) => b.max - a.max);\n\n    // take centroid as the first best guess\n    let bestCell = getCentroidCell(polygon);\n\n    // second guess: bounding box centroid\n    const bboxCell = new Cell(minX + width / 2, minY + height / 2, 0, polygon);\n    if (bboxCell.d > bestCell.d) bestCell = bboxCell;\n\n    let numProbes = 2;\n\n    function potentiallyQueue(x, y, h) {\n        const cell = new Cell(x, y, h, polygon);\n        numProbes++;\n        if (cell.max > bestCell.d + precision) cellQueue.push(cell);\n\n        // update the best cell if we found a better one\n        if (cell.d > bestCell.d) {\n            bestCell = cell;\n            if (debug) console.log(`found best ${Math.round(1e4 * cell.d) / 1e4} after ${numProbes} probes`);\n        }\n    }\n\n    // cover polygon with initial cells\n    let h = cellSize / 2;\n    for (let x = minX; x < maxX; x += cellSize) {\n        for (let y = minY; y < maxY; y += cellSize) {\n            potentiallyQueue(x + h, y + h, h);\n        }\n    }\n\n    while (cellQueue.length) {\n        // pick the most promising cell from the queue\n        const {max, x, y, h: ch} = cellQueue.pop();\n\n        // do not drill down further if there's no chance of a better solution\n        if (max - bestCell.d <= precision) break;\n\n        // split the cell into four cells\n        h = ch / 2;\n        potentiallyQueue(x - h, y - h, h);\n        potentiallyQueue(x + h, y - h, h);\n        potentiallyQueue(x - h, y + h, h);\n        potentiallyQueue(x + h, y + h, h);\n    }\n\n    if (debug) {\n        console.log(`num probes: ${numProbes}\\nbest distance: ${bestCell.d}`);\n    }\n\n    const result = [bestCell.x, bestCell.y];\n    result.distance = bestCell.d;\n    return result;\n}\n\nfunction Cell(x, y, h, polygon) {\n    this.x = x; // cell center x\n    this.y = y; // cell center y\n    this.h = h; // half the cell size\n    this.d = pointToPolygonDist(x, y, polygon); // distance from cell center to polygon\n    this.max = this.d + this.h * Math.SQRT2; // max distance to polygon within a cell\n}\n\n// signed distance from point to polygon outline (negative if point is outside)\nfunction pointToPolygonDist(x, y, polygon) {\n    let inside = false;\n    let minDistSq = Infinity;\n\n    for (const ring of polygon) {\n        for (let i = 0, len = ring.length, j = len - 1; i < len; j = i++) {\n            const a = ring[i];\n            const b = ring[j];\n\n            if ((a[1] > y !== b[1] > y) &&\n                (x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0])) inside = !inside;\n\n            minDistSq = Math.min(minDistSq, getSegDistSq(x, y, a, b));\n        }\n    }\n\n    return minDistSq === 0 ? 0 : (inside ? 1 : -1) * Math.sqrt(minDistSq);\n}\n\n// get polygon centroid\nfunction getCentroidCell(polygon) {\n    let area = 0;\n    let x = 0;\n    let y = 0;\n    const points = polygon[0];\n\n    for (let i = 0, len = points.length, j = len - 1; i < len; j = i++) {\n        const a = points[i];\n        const b = points[j];\n        const f = a[0] * b[1] - b[0] * a[1];\n        x += (a[0] + b[0]) * f;\n        y += (a[1] + b[1]) * f;\n        area += f * 3;\n    }\n    const centroid = new Cell(x / area, y / area, 0, polygon);\n    if (area === 0 || centroid.d < 0) return new Cell(points[0][0], points[0][1], 0, polygon);\n    return centroid;\n}\n\n// get squared distance from a point to a segment\nfunction getSegDistSq(px, py, a, b) {\n    let x = a[0];\n    let y = a[1];\n    let dx = b[0] - x;\n    let dy = b[1] - y;\n\n    if (dx !== 0 || dy !== 0) {\n        const t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);\n\n        if (t > 1) {\n            x = b[0];\n            y = b[1];\n\n        } else if (t > 0) {\n            x += dx * t;\n            y += dy * t;\n        }\n    }\n\n    dx = px - x;\n    dy = py - y;\n\n    return dx * dx + dy * dy;\n}\n\n\n//# sourceURL=webpack:///./node_modules/polylabel/polylabel.js?");

/***/ }),

/***/ "./node_modules/tinyqueue/index.js":
/*!*****************************************!*\
  !*** ./node_modules/tinyqueue/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ TinyQueue)\n/* harmony export */ });\n\nclass TinyQueue {\n    constructor(data = [], compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0)) {\n        this.data = data;\n        this.length = this.data.length;\n        this.compare = compare;\n\n        if (this.length > 0) {\n            for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);\n        }\n    }\n\n    push(item) {\n        this.data.push(item);\n        this._up(this.length++);\n    }\n\n    pop() {\n        if (this.length === 0) return undefined;\n\n        const top = this.data[0];\n        const bottom = this.data.pop();\n\n        if (--this.length > 0) {\n            this.data[0] = bottom;\n            this._down(0);\n        }\n\n        return top;\n    }\n\n    peek() {\n        return this.data[0];\n    }\n\n    _up(pos) {\n        const {data, compare} = this;\n        const item = data[pos];\n\n        while (pos > 0) {\n            const parent = (pos - 1) >> 1;\n            const current = data[parent];\n            if (compare(item, current) >= 0) break;\n            data[pos] = current;\n            pos = parent;\n        }\n\n        data[pos] = item;\n    }\n\n    _down(pos) {\n        const {data, compare} = this;\n        const halfLength = this.length >> 1;\n        const item = data[pos];\n\n        while (pos < halfLength) {\n            let bestChild = (pos << 1) + 1; // initially it is the left child\n            const right = bestChild + 1;\n\n            if (right < this.length && compare(data[right], data[bestChild]) < 0) {\n                bestChild = right;\n            }\n            if (compare(data[bestChild], item) >= 0) break;\n\n            data[pos] = data[bestChild];\n            pos = bestChild;\n        }\n\n        data[pos] = item;\n    }\n}\n\n\n//# sourceURL=webpack:///./node_modules/tinyqueue/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src.js");
/******/ 	
/******/ })()
;