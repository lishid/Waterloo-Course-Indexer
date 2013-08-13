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
		utilCacheWrite($filename, json_encode($data));
	}
	else {
		$data = json_decode($data, true);
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
		utilCacheWrite($filename, json_encode($data));
	}
	else {
		$data = json_decode($data, true);
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
		utilCacheWrite($filename, json_encode($data));
	}
	else {
		$data = json_decode($data, true);
	}
	return $data;
}

function generateCourseData($subject, $number) {
	$apiData = apiGetCourseData($subject, $number);
	$ucalendarData = ucalendarGetCourseData($subject, $number);
	$data = array_merge_assoc($apiData, $ucalendarData);

	$data["offered"] = commonParseOfferedFromDescription($data["description"], $data["offered"]);
	$data["offered"] = commonParseOfferedFromNote($data["notes"], $data["offered"]);
	$data["offered"] = commonFinalizeOffered($data["offered"]);

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

	$prereq = recursiveSplit(trim($data["prereqDesc"], "."));

	if(count($prereq) > 0) {
		utilAppendFile(getcwd() . "/cache/prereq", $data["prereqDesc"] . "\n" . print_r($prereq, true) . "\n\n");
	}

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
		utilCacheWrite($filename, json_encode($data));
	}
	else {
		$data = json_decode($data, true);
	}
	return $data;
}

function generateSubjectCoursesData($subject) {
	$index = getSubjectIndex($subject);
	foreach($index as $key => $value) {
		$index[$key] = generateCourseData($subject, $key);
	}
	return $index;
}

?>