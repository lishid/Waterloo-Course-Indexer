<?php

function utilCreateDir($filename) {
	$dir = dirname($filename);
	if (!file_exists($dir)) {
	    mkdir($dir, 0777, true);
	}
}

function utilCacheGet($filename) {
	if(file_exists($filename)) {
		return file_get_contents($filename);
	}
	return false;
}

function utilCacheWrite($filename, $data) {
	utilCreateDir($filename);
	file_put_contents($filename, $data);
}

function findInArray($array, $start, $end, $prefix) {
    for ($i = $end; $i >= $start; $i--) {
        if(strpos($array[$i], $prefix) === 0) {
            $value = $array[$i];
            $array[$i] = "";
            return $value;
        }
    }
    return "";
}

function array_merge_assoc() {
	$array = array();
    foreach (func_get_args() as $param) {
    	foreach($param as $key => $value) {
    		$array[$key] = $value;
    	}
    }
    return $array;
}
?>