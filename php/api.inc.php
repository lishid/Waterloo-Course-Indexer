<?php

require_once("util.inc.php");
require_once("common.inc.php");
require_once("conf.inc.php");

function apiBaseUrl() {
	return API_URL . "?key=" . API_KEY . "&";
}

function apiGetPage($filename, $urlSuffix) {
	$filename = getcwd() . "/cache/api/" . $filename;
	$data = utilCacheGet($filename);
	if(!$data) {
		$data = file_get_contents(apiBaseUrl() . $urlSuffix);
		utilCacheWrite($filename, $data);
	}
	return json_decode($data);
}

//["response"]["data"]["result"]
function apiGetCourseList($code) {
	return apiGetPage("course-list/" . $code, "service=CourseSearch&q=" . $code)->response->data->result;
}

function apiGetCourse($subject, $number) {
	$data = apiGetPage("course/" . $subject. "/" . $number, "service=CourseInfo&q=" . $subject . $number)->response->data->result;
	return $data[0];
}

function apiGetCourseScheduleList($code) {
	return apiGetPage("schedule/" . $code, "service=Schedule&q=" . $code)->response->data->result;
}

function apiGetSubjectIndex($subject) {
	$filename = getcwd() . "/cache/api/index/" . $subject;
	$data = utilCacheGet($filename);
	if(!$data) {
		$data = apiGenerateSubjectIndex($subject);
		utilCacheWrite($filename, json_encode($data));
	}
	else {
		$data = json_decode($data, true);
	}
	return $data;
}

function apiGenerateSubjectIndex($subject) {
	$courses = apiGetCourseList($subject);
	$courseIndex = array();
	if($courses) {
		foreach ($courses as $course) {
			if($course->DeptAcronym == $subject) {
				$number = preg_replace('/\D/', '', $course->Number);
				$courseIndex[$number] = $course->Title;
			}
		}
	}
	return $courseIndex;
}

function apiGenerateCourseData($subject, $number) {
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

	$data = apiGetCourse($subject, $number);
	$course = array();

	$offered = array();
	$description = $data -> Description;
	$notes = $data -> noteDesc;
	$offered = commonParseOfferedFromDescription($description, $offered);
	$offered = commonParseOfferedFromNote($notes, $offered);

	$course["subject"] = $data -> DeptAcronym;
	$course["number"] = $data -> Number;
	$course["title"] = $data -> Title;
	$course["description"] = $description;
	$course["components"] = apiParseComponents($data);
	$course["credits"] = $data -> Credits;

	// [hasDistEd] => 0
	// [onlyDistEd] => 0
	// [hasStj] => 0
	// [onlyStj] => 0
	// [hasRen] => 0
	// [onlyRen] => 0
	// [hasCgr] => 0
	// [onlyCgr] => 0

	$course["type"] = $data -> Type;
	$course["consentDepartment"] = ($data -> needsDeptConsent == "1");
	$course["consentInstructor"] = ($data -> needsInstrConsent == "1");
	//TODO: prereqs
	$course["prereqDesc"] = $data -> prereqDesc;
	$course["antireqDesc"] = $data -> antireqDesc;
	$course["crosslistDesc"] = $data -> crosslistDesc;
	$course["coreqDesc"] = $data -> coreqDesc;
	$course["notes"] = $notes;
	$course["offered"] = commonFinalizeOffered($offered);
	$course["url"] = $data -> URL;
	return $course;
}

function apiParseComponents($data) {
	$components = "";
	if($data -> hasLec == "1") {
		$components = $components . "LEC, ";
	}
	if($data -> hasLab == "1") {
		$components = $components . "LAB, ";
	}
	if($data -> hasTst == "1") {
		$components = $components . "TST, ";
	}
	if($data -> hasTut == "1") {
		$components = $components . "TUT, ";
	}
	if($data -> hasPrj == "1") {
		$components = $components . "PRJ, ";
	}
	return trim($components, " ,");
}


?>