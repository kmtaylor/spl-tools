const path = require('path');
const puppeteer = require('puppeteer-core');

const councilName = process.argv.at(2);
if (!councilName) {
    console.log("No council name provided");
    exit(1);
}

var widthArgument = process.argv.at(3);
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

var heightArgument = process.argv.at(4);
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

var outputPathArgument = process.argv.at(5);
if (!outputPathArgument) {
    outputPath = councilName + '.jpg'
    console.log("Defaulting to path of '" + path + "'")
} else {
    outputPath = outputPathArgument;
}

(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({channel: 'chrome'});
    const page = await browser.newPage();

    // Set screen size.
    await page.setViewport({width: width, height: height});

    // Navigate the page to a URL. Wait until network activity is finished to ensure map is loaded before taking screenshot.
    await page.goto('http://localhost:8000/?council=' + encodeURIComponent(councilName), {
        waitUntil: 'networkidle2',
    });

    // Capture screenshot
    await page.screenshot({
        path: outputPath
    });

    await browser.close();
})();