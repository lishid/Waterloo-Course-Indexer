<?php


function utilDownloadPage($filename, $url) {
	$filename = getcwd() . $filename;
	$data = utilCacheGet($filename);
	if(!$data) {
		$data = @file_get_contents($url);
		utilCacheWrite($filename, $data);
	}
	return $data;
}

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

function utilAppendFile($filename, $data) {
	if(!$data) return;
	utilCreateDir($filename);
	file_put_contents($filename, $data, FILE_APPEND);
}

function utilCacheWrite($filename, $data) {
	if(!$data) return;
	utilCreateDir($filename);
	file_put_contents($filename, $data);
}

function findInArray($array, $start, $end, $prefix) {
	for ($i = $end; $i >= $start; $i--) {
		if(startsWith($array[$i], $prefix)) {
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
		if(!is_array($param)) {
			continue;
		}
		foreach($param as $key => $value) {
			$array[$key] = $value;
		}
	}
	return $array;
}

function array_merge_assoc_recursive_array($array) {
	$result = array();
	foreach ($array as $param) {
		$result = array_merge_assoc_recursive($result, $param);
	}
	return $result;
}

function array_merge_assoc_recursive() {
	$array = array();
	foreach (func_get_args() as $param) {
		if(!is_array($param)) {
			continue;
		}
		foreach($param as $key => $value) {
			if($array[$key] && $value) {
				$array[$key] = array_merge_assoc_recursive($array[$key], $value);
			}
			else{
				$array[$key] = $value;
			}
		}
	}
	return $array;
}

function startsWith($haystack, $needle)
{
    return !strncmp($haystack, $needle, strlen($needle));
}

function endsWith($haystack, $needle)
{
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}

?>