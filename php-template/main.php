<?php
require_once "page_renderer.php";

// TODO: Need to handle arguments better
// Assume that the first argument is a path to a file contain the config.
// If the argument isn't present, load the json from standard input
if (isset($argv[1])) {
    $jsonData = file_get_contents($argv[1]);
} else {
    $jsonData = file_get_contents("php://stdin");
}

$config = json_decode($jsonData, true);

// Check for decoding errors
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log('Error decoding JSON: ' . json_last_error_msg());
    exit(1);
}

$renderer = new SPLPageRenderer();
$pageContent = $renderer->renderCouncilPage($config);
if ($pageContent === null) {
    exit(2);
}

echo $pageContent;
exit(0);
