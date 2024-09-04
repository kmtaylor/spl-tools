<?php
$options = getopt("", ["folder:", "input:", "output:", "media:"]);

if (isset($options['folder'])) {
    $folder = $options['folder'];
    if (is_dir($folder)) {
        $expectedInputFileNames = [];
        $expectedInputFileNames[] = str_replace("-", " ", strtoupper(basename($folder))) . ".csv";
        $expectedInputFileNames[] = strtoupper(basename($folder)) . ".csv";
        if (!isset($options['input'])) {
            foreach ($expectedInputFileNames as $expectedInputFileName) {
                $expectedInputFile = $folder . DIRECTORY_SEPARATOR  . $expectedInputFileName;
                if (is_file($expectedInputFile)) {
                    $options['input'] = $expectedInputFile;
                }
            }
        }
        if (!isset($options['output'])) {
            $options['output'] = $folder . DIRECTORY_SEPARATOR . "candidates.csv";
        }
        if (!isset($options['media'])) {
            $options['media'] = $folder;
        }
    } else {
        error_log("Error: Specified folder is not valid.");
        exit(1);
    }
}

if (isset($options['input'])) {
    $inputFile = $options['input'];
} else {
    error_log("Error: Missing required option '--input'.");
    exit(1);
}

if (isset($options['output'])) {
    $outputFile = $options['output'];
} else {
    error_log("Error: Missing required option '--output'.");
    exit(1);
}

if (isset($options['media'])) {
    $mediaFolder = $options['media'];
} else {
    error_log("Error: Missing required option '--media'.");
    exit(1);
}

$mediaFiles = scandir($mediaFolder);
if ($mediaFiles === FALSE) {
    error_log("Failed to list files in media folder");
    exit(1);
}

$candidates = [];
if (($handle = fopen($inputFile, "r")) !== FALSE) {
    $currentWard = null;
    $currentLine = 0;
    while (($data = fgetcsv($handle)) !== FALSE) {
        $currentLine++;
        //echo var_dump($data);
        if ($data[0] == "Ward") {
            // CSV contains ward names in uppercase, convert them to a more readable form
            $currentWard = ucwords(strtolower($data[1]));

            // Handle some special cases where the above logic doesn't match the expected names
            // Note that we cannot just convert every letter after a '-' character to uppercase
            // because there are some ward names like "Bulleke-bek"
            if ($currentWard == "Warrk-warrk") {
                $currentWard = "Warrk-Warrk";
            }
            if ($currentWard == "Djirri-djirri") {
                $currentWard = "Djirri-Djirri";
            }
            if ($currentWard == "Coastal-promontory") {
                $currentWard = "Coastal-Promontory";
            }
        }
        if ($data[0] == "Candidate" || $data[0] == "") {
            if ($currentWard == null) {
                error_log("No ward found, skipping data on line " . $currentLine);
                continue;
            }

            $candidateName = trim($data[1]);

            if ($candidateName == "example name") {
                error_log("Skipping line ". $currentLine);
                continue;
            }

            //print("Adding candidate " . $candidateName . " to ". $currentWard . "\n");

            $name_split = explode(" ", $data[1]);

            $name_patterns = [
                implode(".*", $name_split),
                implode(".*", array_reverse($name_split)),
            ];

            $regex_groups = array_map(function($x) { return "(?:.*" . $x . ".*)"; }, $name_patterns);

            $regex_pattern = "/" . implode("|", $regex_groups) . "/i";

            $picture = "";
            foreach ($mediaFiles as $mediaFile) {
                if (preg_match($regex_pattern, $mediaFile)) {
                    $picture = $mediaFile;
                    break;
                }
            }
            if ($picture === "") {
                print("\033[31mFailed to identify picture for " . $candidateName . "\033[0m\n");
            }

            $rating = $data[2];
            if ($rating == "score" || $rating == "") {
                $rating = 0;
            }
            $rating = (int)$rating;

            array_push(
                $candidates, 
                [
                    "Ward" => $currentWard,
                    "Candidate Name" => $candidateName,
                    "Rating" => $rating,
                    "Picture" => $picture
                ]
            );
        }
    }
    fclose($handle);
} else {
    error_log('Error opening input file');
    exit(1);
}

if (empty($candidates)) {
    error_log("Failed to find any candidates");
    exit(2);
}

if (($handle = fopen($outputFile, "w")) !== FALSE) {
    $headers = array(
        "Ward",
        "Candidate Name",
        "Rating",
        "Picture"
    );
    if (fputcsv($handle, $headers) === FALSE) {
        error_log('Error writing headers to output file');
        exit(3);
    }
    foreach ($candidates as $candidate) {
        $fields = array(
            $candidate["Ward"],
            $candidate["Candidate Name"],
            $candidate["Rating"],
            $candidate["Picture"]
        );
        if (fputcsv($handle, $fields) === FALSE) {
            error_log('Error writing candidate to output file');
            exit(3);
        }
    }
} else {
    error_log('Error opening output file');
    exit(1);
}

print("Data written to " . $outputFile . "\n");

exit(0);
