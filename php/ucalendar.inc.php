<?php

require_once("util.inc.php");
require_once("common.inc.php");
require_once("conf.inc.php");

function ucalendarBaseUrl() {
	return UGRAD_CALENDAR_URL . UGRAD_CALENDAR_TERM . "/COURSE/";
}

function ucalendarSubjectUrl($subject) {
	return ucalendarBaseUrl() . "course-" . $subject . ".html";
}

function ucalendarGetSubjectPage($subject) {
	$filename = getcwd() . "/cache/ucalendar/" . $subject;
	$data = utilCacheGet($filename);
	if(!$data) {
		$data = file_get_contents(ucalendarSubjectUrl($subject));
		utilCacheWrite($filename, $data);
	}
	return $data;
}

function ucalendarGetSubjectList($subject) {
	
}

function ucalendarGetSubjectIndex($subject) {
	$filename = getcwd() . "/cache/ucalendar/index/" . $subject;
	$data = utilCacheGet($filename);
	if(!$data) {
		$data = ucalendarGenerateSubjectIndex($subject);
		utilCacheWrite($filename, json_encode($data));
	}
	else {
		$data = json_decode($data, true);
	}
	return $data;
}

function ucalendarGenerateSubjectIndex($subject) {
	$courses = ucalendarGenerateSubjectListData($subject);
	$subjectIndex = array();
	foreach($courses as $course) {
		$course = ucalendarGenerateCourseIndex($course);
		$subjectIndex[$course["number"]] = $course["title"];
	}
	return $subjectIndex;
}

function ucalendarGenerateSubjectListData($subject) {
	$data = ucalendarGetSubjectPage($subject);
	$lines = explode("\n", $data);
	$values = preg_grep("/<center><table.+table><\\/center>/", $lines);
	
	$courses = array();
	foreach ($values as $value) {
		preg_match_all("/<td[^\\>]*>(.*?)<\\/td>/", $value, $fields);
		$fields = $fields[1];
		foreach($fields as $key => $field) {
			$fields[$key] = trim(preg_replace("/<[^\\>]*>/", "", $field));
		}
		array_push($courses, ucalendarGenerateCourseData($fields));
	}
	return $courses;
}

function ucalendarGenerateCourseIndex($course) {
	$courseIndex = array();
	$courseIndex["subject"] = $course["subject"];
	$courseIndex["number"] = $course["number"];
	$courseIndex["title"] = $course["title"];
	return $courseIndex;
}

function ucalendarGenerateCourseData($fields) {
	$course = array();
	// Course object data:
	// subject
	// number
	// title
	// description
	// components
	// credits
	// type
	// consentDepartment
	// consentInstructor
	// prereqDesc
	// antireqDesc
	// crosslistDesc
	// coreqDesc
	// notes
	// offered
	// url

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
	$course["subject"] = $courseCodeTokens[0];
	$course["number"] = $courseCodeTokens[1];
	$course["components"] = $courseCodeTokens[2];
	$course["credits"] = $courseCodeTokens[3];
	$course["title"] = $fields[2];
	$course["type"] = "UGRAD";

	$notes = findInArray($fields, 3, count($fields) - 1, "[Note: ");
	$course["consentDepartment"] = findInArray($fields, 3, count($fields) - 1, "Department Consent");
	$course["consentInstructor"] = findInArray($fields, 3, count($fields) - 1, "Instructor Consent");
	$course["prereqDesc"] = findInArray($fields, 3, count($fields) - 1, "Prereq:");
	$course["coreqDesc"] = findInArray($fields, 3, count($fields) - 1, "Coreq:");
	$course["antireqDesc"] = findInArray($fields, 3, count($fields) - 1, "Antireq:");
	$course["crosslistDesc"] = findInArray($fields, 3, count($fields) - 1, "(Cross-listed");
	$description = $fields[3];

	//Find offered from Note and Description

	$offered = array();
	$offered = commonParseOfferedFromDescription($description, $offered);
	$offered = commonParseOfferedFromNote($notes, $offered);
	$course["note"] = $notes;
	$course["description"] = $description;
	$course["offered"] = commonFinalizeOffered($offered);
	$course["url"] = ucalendarSubjectUrl($course["subject"]) . "#" . $course["subject"] . $course["number"];

	return $course;
}

?>