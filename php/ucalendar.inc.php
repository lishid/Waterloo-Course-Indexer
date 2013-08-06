<?php

require_once("util.inc.php");
require_once("common.inc.php");
require_once("conf.inc.php");

function ucalendarBaseUrl() {
	return UGRAD_CALENDAR_URL . UGRAD_CALENDAR_TERM . "/COURSE/";
}
function ucalendarIndexUrl() {
	return UGRAD_INDEX_URL;
}

function ucalendarSubjectUrl($subject) {
	return ucalendarBaseUrl() . "course-" . $subject . ".html";
}

function ucalendarDownloadIndexPage() {
	$data = utilDownloadPage("/cache/ucalendar/raw/index/index", ucalendarIndexUrl());
	return $data;
}

function ucalendarDownloadSubjectPage($subject) {
	$data = utilDownloadPage("/cache/ucalendar/raw/subject/" . $subject, ucalendarSubjectUrl($subject));
	return $data;
}

function ucalendarGetSubjectIndex($subject) {
	$courses = ucalendarGetSubjectData($subject);
	$subjectIndex = array();
	foreach($courses as $number => $course) {
		$subjectIndex[$number] = $course["title"];
	}
	return $subjectIndex;
}

function ucalendarGetCourseData($subject, $number) {
	$courses = ucalendarGetSubjectData($subject);
	return $courses[$number];
}

function ucalendarGetSubjectData($subject) {
	$filename = getcwd() . "/cache/ucalendar/subject/" . $subject;
	$data = utilCacheGet($filename);
	if(!$data) {
		$data = ucalendarGenerateSubjectData($subject);
		utilCacheWrite($filename, json_encode($data));
	}
	else {
		$data = json_decode($data, true);
	}
	return $data;
}

function ucalendarGenerateSubjectData($subject) {
	$data = ucalendarDownloadSubjectPage($subject);
	$lines = explode("\n", $data);
	$values = preg_grep("/<center><table.+table><\\/center>/", $lines);

	$courses = array();
	foreach ($values as $value) {
		preg_match_all("/<td[^\\>]*>(.*?)<\\/td>/", $value, $fields);
		$fields = $fields[1];
		foreach($fields as $key => $field) {
			$fields[$key] = trim(preg_replace("/<[^\\>]*>/", "", $field));
		}
		$course = ucalendarGenerateCourseData($fields);
		$courses[$course["number"]] = $course;
	}
	return $courses;
}

function ucalendarGenerateCourseData($fields) {
	// fields data type
	// (*)CS 499T LAB,LEF,TST,TUT,PRJ 0.50
	// (*)Course ID: 000000
	// (*)Title
	// Description
	// (+)[Note: note]
	// (+)Department Consent Required
	// (+)Prereq: 
	// (+)Coreq: 
	// (+)Antireq: 
	// (+)(Cross-listed with )
	// (-)offered

	$courseCodeTokens = explode(" ", $fields[0]);
	$course = array();

	$course["subject"] = $courseCodeTokens[0];
	$course["number"] = $courseCodeTokens[1];
	$course["title"] = $fields[2];
	$course["components"] = $courseCodeTokens[2];
	$course["credits"] = $courseCodeTokens[3];
	$course["type"] = "UGRAD";
	$course["consentDepartment"] = (findInArray($fields, 3, count($fields) - 1, "Department Consent") != "");
	$course["consentInstructor"] = (findInArray($fields, 3, count($fields) - 1, "Instructor Consent") != "");
	$course["prereqDesc"] = findInArray($fields, 3, count($fields) - 1, "Prereq:");
	$course["antireqDesc"] = findInArray($fields, 3, count($fields) - 1, "Antireq:");
	$course["crosslistDesc"] = findInArray($fields, 3, count($fields) - 1, "(Cross-listed");
	$course["coreqDesc"] = findInArray($fields, 3, count($fields) - 1, "Coreq:");
	$course["notes"] = findInArray($fields, 3, count($fields) - 1, "[Note: ");
	$course["offered"] = array();
	$course["url"] = ucalendarSubjectUrl($course["subject"]) . "#" . $course["subject"] . $course["number"];

	$course["description"] = $fields[3];

	return $course;
}

function ucalendarGetSubjectsIndex() {
	$page = ucalendarDownloadIndexPage();
	$page = str_replace(array("\n","\r"), "", $page);
	$result = array();

	$departments = array();
	$subjects = array();

	//Get departments
	preg_match("/<h4>Owner&nbsp;Key <\\/h4><table[^\\>]*>(.*?)<\\/table>/", $page, $departmentData);
	$departmentData = str_replace("&nbsp;", "", $departmentData);
	preg_match_all("/<tr> *<td>(.*?)<\\/td> *<td>(.*?)<\\/td> *<\\/tr>/", $departmentData[1], $departmentList);

	foreach($departmentList[1] as $key => $value) {
		$departmentCode = trim($value);
		$departmentDescription = trim(preg_replace("/<(.*?)>/", "", $departmentList[2][$key]));
		$departments[$departmentCode] = $departmentDescription;
	}

	//Get subjects
	preg_match("/<h3>Course Table<\\/h3><table[^\\>]*>(.*?)<\\/table>/", $page, $subjectData);
	$subjectData = str_replace("&nbsp;", "", $subjectData);
	preg_match_all("/<tr> *<td>(.*?)<\\/td> *<td>(.*?)<\\/td> *<td>(.*?)<\\/td> *(<td.*?td> *)*<\\/tr>/", $subjectData[1], $subjectList);

	foreach($subjectList[2] as $key => $value) {
		if(trim($value) == "") {
			continue;
		}
		$subjectCode = trim($value);
		$subject = array();
		$subject["title"] = trim($subjectList[1][$key]);
		$subject["department"] = trim($subjectList[3][$key]);
		$subjects[$subjectCode] = $subject;
	}

	//Adjustments
	$subjects["SE"]["department"] = "ENG";

	$result["departments"] = $departments;
	$result["subjects"] = $subjects;
	return $result;
}

?>