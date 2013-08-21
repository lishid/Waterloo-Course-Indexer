<?php

require_once("util.inc.php");
require_once("conf.inc.php");

function apiBaseUrl() {
	return API_URL . "?key=" . API_KEY . "&";
}

function apiDownloadPage($filename, $urlSuffix) {
	$data = utilDownloadPage("/cache/raw/api/" . $filename, apiBaseUrl() . $urlSuffix);
	return json_decode($data, true);
}

function apiDownloadSubject($subject) {
	$page = apiDownloadPage("subject/" . $subject, "service=CourseSearch&q=" . $subject);
	if($page) {
		return $page["response"]["data"]["result"];
	}
	return array();
}

function apiDownloadCourse($subject, $number) {
	$page = apiDownloadPage("course/" . $subject. "/" . $number, "service=CourseInfo&q=" . $subject . $number);
	if($page) {
		$data = $page["response"]["data"]["result"];
		return $data[0];
	}
	return array();
}

function apiDownloadCourseScheduleList($subject) {
	$page = apiDownloadPage("schedule/" . $subject, "service=Schedule&q=" . $subject);
	if($page) {
		return $page["response"]["data"]["result"];
	}
	return array();
}

function apiGetSubjectIndex($subject) {
	$courses = apiDownloadSubject($subject);
	$courseIndex = array();
	if($courses) {
		foreach ($courses as $course) {
			if($course["DeptAcronym"] == $subject) {
				$number = $course["Number"];
				$courseIndex[$number] = $course["Title"];
			}
		}
	}
	return $courseIndex;
}

function apiGetCourseData($subject, $number) {
	$data = apiDownloadCourse($subject, $number);
	$course = array();

	// [hasDistEd] => 0
	// [onlyDistEd] => 0
	// [hasStj] => 0
	// [onlyStj] => 0
	// [hasRen] => 0
	// [onlyRen] => 0
	// [hasCgr] => 0
	// [onlyCgr] => 0

	$course["subject"] = $data["DeptAcronym"];
	$course["number"] = $data["Number"];
	$course["title"] = $data["Title"];
	$course["description"] = $data["Description"];
	$course["components"] = apiParseComponents($data);
	$course["credits"] = $data["Credits"];
	$course["type"] = $data["Type"];
	$course["consentDepartment"] = ($data["needsDeptConsent"] == "1");
	$course["consentInstructor"] = ($data["needsInstrConsent"] == "1");
	$course["prereqDesc"] = $data["prereqDesc"];
	$course["antireqDesc"] = $data["antireqDesc"];
	$course["crosslistDesc"] = $data["crosslistDesc"];
	$course["coreqDesc"] = $data["coreqDesc"];
	$course["notes"] = $data["noteDesc"];
	$course["offered"] = array();
	$course["url"] = $data["URL"];

	return $course;
}

function apiParseComponents($data) {
	$components = "";
	if($data["hasLec"] == "1") {
		$components = $components . "LEC, ";
	}
	if($data["hasLab"] == "1") {
		$components = $components . "LAB, ";
	}
	if($data["hasTst"] == "1") {
		$components = $components . "TST, ";
	}
	if($data["hasTut"] == "1") {
		$components = $components . "TUT, ";
	}
	if($data["hasPrj"] == "1") {
		$components = $components . "PRJ, ";
	}
	return trim($components, " ,");
}

?>