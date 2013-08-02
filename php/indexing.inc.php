<?php

require_once("api.inc.php");
require_once("ucalendar.inc.php");
require_once("util.inc.php");

function getAllSubjectIndex() {
	$subjects = getSubjectList();
	$courseIndex = array();
	foreach($subjects as $subject) {
		$courseIndex[$subject] = getSubjectIndex($subject);
	}
	return $courseIndex;
}

function getSubjectIndex($subject) {
	$filename = getcwd() . "/cache/index/subject-index/" . $subject;
	$data = utilCacheGet($filename);
	if(!$data) {
		$data = generateSubjectIndex($subject);
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
	return $data;
}

?>