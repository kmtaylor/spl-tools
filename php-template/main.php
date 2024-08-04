<?php
require_once "page_renderer.php";

$options = getopt("", ["council-file:", "candidates-file:"]);

if (isset($options['council-file'])) {
    $councilFileContents = file_get_contents($options['council-file']);
} else {
    error_log("Error: Missing required option '--council-file'.");
    exit(1);
}

$councilData = json_decode($councilFileContents, true);

// Check for decoding errors
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log('Error decoding council file: ' . json_last_error_msg());
    exit(1);
}

if (isset($options['candidates-file'])) {
    $candidatesFile = $options['candidates-file'];
} else {
    error_log("Error: Missing required option '--candidates-file'.");
    exit(1);
}

// Convert CSV into an array of dictionaries. Use the header as the key in the dictionary.
$candidateData = [];
if (($handle = fopen($candidatesFile, "r")) !== FALSE) {
    $headers = fgetcsv($handle);
    while (($data = fgetcsv($handle)) !== FALSE) {
        $candidate = [];
        foreach ($headers as $key => $value) {
            $candidate[$value] = $data[$key];
        }
        $candidateData[] = $candidate;
    }
    fclose($handle);
} else {
    error_log('Error opening candidates file');
    exit(1);
}

$renderer = new SPLPageRenderer();
$pageContent = $renderer->renderCouncilPage($councilData, $candidateData);
if ($pageContent === null) {
    exit(2);
}

echo $pageContent;
exit(0);
