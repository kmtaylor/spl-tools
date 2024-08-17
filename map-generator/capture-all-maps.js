const fs = require('fs');
const { exec } = require('child_process');

var widthArgument = process.argv.at(2);
if (!widthArgument) {
    console.log("Defaulting to width of 1080")
    width = 1080;
} else {
    width = parseInt(widthArgument);
    if (isNaN(width)) {
        console.log("Invalid width provided");
        exit(1);
    }
}

var heightArgument = process.argv.at(3);
if (!heightArgument) {
    console.log("Defaulting to height of 720")
    height = 720;
} else {
    height = parseInt(heightArgument);
    if (isNaN(height)) {
        console.log("Invalid height provided");
        exit(1);
    }
}

var dataPathArgument = process.argv.at(4);
if (!dataPathArgument) {
    console.log("Invalid data path provided");
    exit(1);
} else {
    dataPath = dataPathArgument;
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

(async () => {
    var councils = JSON.parse(fs.readFileSync('../council_names.json', 'utf8'));

    for (const council of councils) {
        console.log("Generating map for " + council.slug + "...");
        exec("node ./capture-map.js " + council.slug + " " + width + " " + height + " " + dataPath + "/" + council.slug + "/map.jpg");

        // Need to slow down requests to avoid overloading the system...
        await sleep(1000);
    }
})();