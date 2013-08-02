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

function ucalendarDownloadSubjectPage($subject) {
	$filename = getcwd() . "/cache/ucalendar/raw/" . $subject;
	$data = utilCacheGet($filename);
	if(!$data) {
		$data = file_get_contents(ucalendarSubjectUrl($subject));
		utilCacheWrite($filename, $data);
	}
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

	$subject = $courseCodeTokens[0];
	$number = $courseCodeTokens[1];
	$title = $fields[2];
	$components = $courseCodeTokens[2];
	$credits = $courseCodeTokens[3];
	$type = "UGRAD";
	$consentDepartment = findInArray($fields, 3, count($fields) - 1, "Department Consent");
	$consentInstructor = findInArray($fields, 3, count($fields) - 1, "Instructor Consent");
	$prereqDesc = findInArray($fields, 3, count($fields) - 1, "Prereq:");
	$antireqDesc = findInArray($fields, 3, count($fields) - 1, "Antireq:");
	$crosslistDesc = findInArray($fields, 3, count($fields) - 1, "(Cross-listed");
	$coreqDesc = findInArray($fields, 3, count($fields) - 1, "Coreq:");
	$notes = findInArray($fields, 3, count($fields) - 1, "[Note: ");
	$offered = array();
	$url = ucalendarSubjectUrl($course["subject"]) . "#" . $course["subject"] . $course["number"];

	$description = $fields[3];

	$offered = commonParseOfferedFromDescription($description, $offered);
	$offered = commonParseOfferedFromNote($notes, $offered);
	$offered = commonFinalizeOffered($offered);


	$course["subject"] = $subject;
	$course["number"] = $number;
	$course["title"] = $title;
	$course["description"] = $description;
	$course["components"] = $components;
	$course["credits"] = $credits;
	$course["type"] = $type;
	$course["consentDepartment"] = $consentDepartment;
	$course["consentInstructor"] = $consentInstructor;
	$course["prereqDesc"] = $prereqDesc;
	$course["antireqDesc"] = $antireqDesc;
	$course["crosslistDesc"] = $crosslistDesc;
	$course["coreqDesc"] = $coreqDesc;
	$course["notes"] = $notes;
	$course["offered"] = $offered;
	$course["url"] = $url;

	return $course;
}

?>