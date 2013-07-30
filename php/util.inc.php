<?php

function utilCreateDir($filename) {
	$dir = dirname($filename);
	if (!file_exists($dir)) {
	    mkdir($dir, 0777, true);
	}
}

function getCacheGet($filename) {
	if(file_exists($filename)) {
		return file_get_contents($filename);
	}
	return false;
}

function utilCacheWrite($filename, $data) {
	utilCreateDir($filename);
	file_put_contents($filename, $data);
}

?>