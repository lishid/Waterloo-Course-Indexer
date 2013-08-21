<?php

require_once("api.inc.php");
require_once("ucalendar.inc.php");
require_once("util.inc.php");
require_once("requisites.inc.php");

function clearCache() {
	rrmdir(getcwd() . "/cache/index/");
}

function getAllSubjectIndex() {
	$filename = getcwd() . "/cache/index/subjects-index";
	$data = utilCacheGet($filename);
	if(!$data) {
		$data = generateAllSubjectIndex($subject);
		knatsort($data);
		utilCacheWrite($filename, utilEncodeJson($data));
	}
	else {
		$data = utilDecodeJson($data, true);
	}
	return $data;
}

function generateAllSubjectIndex() {
	$subjects = getSubjectsIndex();
	$subjects = $subjects["subjects"];
	$courseIndex = array();
	foreach($subjects as $subject => $courses) {
		$courseIndex[$subject] = getSubjectIndex($subject);
	}
	knatsort($courseIndex);
	return $courseIndex;
}

function getSubjectIndex($subject) {
	$filename = getcwd() . "/cache/index/subject-index/" . $subject;
	$data = utilCacheGet($filename);
	if(!$data) {
		$data = generateSubjectIndex($subject);
		knatsort($data);
		utilCacheWrite($filename, utilEncodeJson($data));
	}
	else {
		$data = utilDecodeJson($data, true);
	}
	return $data;
}

function generateSubjectIndex($subject) {
	$apiData = apiGetSubjectIndex($subject);
	$ucalendarData = ucalendarGetSubjectIndex($subject);
	$data = array_merge_assoc($apiData, $ucalendarData);
	return $data;
}

function getCourseData($subject, $number) {
	$filename = getcwd() . "/cache/index/course/" . $subject . "/" . $number;
	$data = utilCacheGet($filename);
	if(!$data) {
		$data = generateCourseData($subject, $number);
		utilCacheWrite($filename, utilEncodeJson($data));
	}
	else {
		$data = utilDecodeJson($data, true);
	}
	return $data;
}

function generateCourseData($subject, $number) {
	$apiData = apiGetCourseData($subject, $number);
	$ucalendarData = ucalendarGetCourseData($subject, $number);
	$data = array_merge_assoc($apiData, $ucalendarData);

	$data["offered"] = parseOfferedFromDescription($data["description"], $data["offered"]);
	$data["offered"] = parseOfferedFromNote($data["notes"], $data["offered"]);
	$data["offered"] = array_filter(array_unique($data["offered"]));;

	if(startsWith($data["prereqDesc"], "Prerequisite")) {
		$data["prereqDesc"] = substr($data["prereqDesc"], 14);
	}
	else {
		$data["prereqDesc"] = substr($data["prereqDesc"], 8);
	}
	$data["antireqDesc"] = substr($data["antireqDesc"], 9);
	$data["crosslistDesc"] = substr($data["crosslistDesc"], 1, strlen($data["crosslistDesc"]) - 2);
	$data["coreqDesc"] = substr($data["coreqDesc"], 7);
	$data["notes"] = substr($data["notes"], 7, strlen($data["notes"]) - 8);

	$data["prereq"] = recursiveSplit(trim($data["prereqDesc"], "."));

	// if(count($data["prereq"]) > 0) {
	// 	utilAppendFile(getcwd() . "/cache/prereq", $subject . $number . "\n" . 
	// 		$data["prereqDesc"] . "\n" . print_r($data["prereq"], true) . "\n\n");
	// }

	foreach($data as $key => $value) {
		if(!$value) {
			$data[$key] = "";
		}
	}

	return $data;
}

function getSubjectsIndex() {
	$filename = getcwd() . "/cache/index/subjects";
	$data = utilCacheGet($filename);
	if(!$data) {
		$data = ucalendarGetSubjectsIndex();
		knatsort($data);
		utilCacheWrite($filename, utilEncodeJson($data));
	}
	else {
		$data = utilDecodeJson($data, true);
	}
	return $data;
}

function generateSubjectCoursesData($subject) {
	$index = getSubjectIndex($subject);
	foreach($index as $key => $value) {
		$index[$key] = getCourseData($subject, $key);
	}
	return $index;
}


function parseOfferedFromDescription($description, $offered) {
	preg_match("/\[([^\]]*)Offered: ([FWSJAM, ]*)\]/", $description, $matches);
	if(count($matches) > 0) {
		$terms = preg_split("/,/", $matches[count($matches) - 1]);
		foreach($terms as $term) {
			array_push($offered, trim($term));
		}
		for($i = count($matches) - 2; $i > 0; $i--) {
			array_push($offered, $matches[$i]);
		}
	}
	return $offered;
}

function parseOfferedFromNote($notes, $offered) {
	preg_match("/Offered: ([FWSJAM, ]*)/", $notes, $matches);
	if(count($matches) > 0) {
		$terms = preg_split("/,/", $matches[1]);
		foreach($terms as $term) {
			array_push($offered, trim($term));
		}
	}
	return $offered;
}

?>