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
        error_log("Error opening config.json.");
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
            $candidate['Path'] = dirname($file);
            $candidateData[] = $candidate;
        }
        fclose($handle);
    } else {
        error_log('Error opening candidates file');
        exit(1);
    }
}

/* Select people who have taken the pledge */
$pledgeCandidates = array_filter($candidateData, function ($candidate) {
    return $candidate['Pledge'] === 'y';
});

/* Select 9 random candidates */
$pledgeKeys = array_rand($pledgeCandidates, 9);
shuffle($pledgeKeys);

$i = 0;
foreach ($pledgeKeys as $key) {
    $media_desc = $pledgeCandidates[$key]['Path']."/".
                    $pledgeCandidates[$key]['Picture'].".json";
    $media_string = file_get_contents($media_desc);

    if ($media_string !== FALSE) {
        $media = json_decode($media_string, true);
    } else {
        error_log("Error opening image descriptor.");
        exit(1);
    }

    $image_url = $media['url'];

    echo "s|pledge_img_".$i."|".$image_url."|\n";

    echo "s|pledge_string_".$i."|";
    echo $pledgeCandidates[$key]['Candidate Name'].
        " (".
        $pledgeCandidates[$key]['Council'].
        ") has taken the pledge!|\n";

    $i++;
}

exit(0);
