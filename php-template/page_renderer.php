<?php

class SPLPageRenderer {
    public function renderCouncilPage($config, $candidates) {
        ob_start();

        set_error_handler(function($errno, $errstr, $errfile, $errline) {
            // Clear any output if an error occurred
            ob_clean();
            error_log("Error: $errstr in $errfile on line $errline");
            return true; // Prevent default error handling
        });

        require "template.php";

        restore_error_handler();

        $content = ob_get_clean();

        // Explictly return null if we didn't generate any content
        if (!empty($content)) {
            return $content;
        } else {
            return null;
        }
    }
}
