<?php

// Gzip encode the contents of the output buffer.
function compress_output_option($output)
{
    if(strlen($output) >= 2048)
    {
        $compressed_out = gzencode($output, 3);
        header("Content-Encoding: gzip");
        return $compressed_out;
    }
    else
    {
        return $output;
    }
}

if (strstr($HTTP_SERVER_VARS['HTTP_ACCEPT_ENCODING'], 'gzip'))
{
    ob_start("compress_output_option");
}
?>