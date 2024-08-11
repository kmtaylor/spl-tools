<?php

class SPLPageRenderer {
    public function renderCouncilPage($config, $candidates, $media) {
        ob_start();

        $didError = false;

        set_error_handler(function($errno, $errstr, $errfile, $errline) use(&$didError) {
            $didError = true;
            error_log("Error: $errstr in $errfile on line $errline");
            return true; // Prevent default error handling
        });

        require "template.php";

        restore_error_handler();

        $content = ob_get_clean();

        // Explictly return null if we didn't generate any content or if there was an error
        if (!empty($content) && !$didError) {
            return $content;
        } else {
            return null;
        }
    }
}
