<?php

$options = getopt("", ["candidates-files:"]);

if (isset($options['candidates-files'])) {
    $candidatesFiles = $options['candidates-files'];
} else {
    error_log("Error: Missing required option '--candidates-files'.");
    exit(1);
}

$files = explode(" ", $candidatesFiles);

$candidateData = [];
foreach ($files as $key => $file) {
    $config_file = dirname($file)."/config.json";
    $config_string = file_get_contents($config_file);

    if ($config_string !== FALSE) {
        $config = json_decode($config_string, true);
    } else {
        error_log('Error opening config.json');
        exit(1);
    }

    if (($handle = fopen($file, "r")) !== FALSE) {
        $headers = fgetcsv($handle);
        while (($data = fgetcsv($handle)) !== FALSE) {
            $candidate = [];
            $candidate['Pledge'] = 'n';
            foreach ($headers as $key => $value) {
                $candidate[$value] = $data[$key];
            }
            $candidate['Council'] = $config['councilName'];
            $candidateData[] = $candidate;
        }
        fclose($handle);
    } else {
        error_log('Error opening candidates file');
        exit(1);
    }
}

$pledgeCandidates = array_filter($candidateData, function ($candidate) {
    return $candidate['Pledge'] === 'y';
});

print_r($pledgeCandidates);

exit(0);
