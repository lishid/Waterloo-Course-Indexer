<?php

require_once("php/util.inc.php");
require_once("php/gz.inc.php");


function getSVGs($filename, $folder) {
	$filename = getcwd() . "/cache/svg/" . $filename;
	$data = utilCacheGet($filename);
	if(!$data) {
		$data = generateSVGs($folder);
		$data = json_encode($data);
		utilCacheWrite($filename, $data);
	}
	return $data;
}

function generateSVGs($folder) {
	$files = scandir($folder);
	array_push($files, "..");
	array_push($files, ".");
	$files = array_unique($files);
	$files = array_diff($files, array("..", "."));

	$svg = array();
	foreach($files as $file) {
		$data = file_get_contents($folder . $file);
		$svg[$file] = $data;
	}
	return $svg;
}

print_r(getSVGs("course-icons", getcwd() . "/img/course-icons/"));

?>