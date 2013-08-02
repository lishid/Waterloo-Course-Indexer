<?php

require_once("util.inc.php");
require_once("common.inc.php");
require_once("conf.inc.php");

function apiBaseUrl() {
	return API_URL . "?key=" . API_KEY . "&";
}

function apiDownloadPage($filename, $urlSuffix) {
	$filename = getcwd() . "/cache/api/raw/" . $filename;
	$data = utilCacheGet($filename);
	if(!$data) {
		$data = file_get_contents(apiBaseUrl() . $urlSuffix);
		utilCacheWrite($filename, $data);
	}
	return json_decode($data, true);
}

function apiDownloadCourseList($code) {
	$page = apiDownloadPage("course-list/" . $code, "service=CourseSearch&q=" . $code);
	return $page["response"]["data"]["result"];
}

function apiDownloadCourse($subject, $number) {
	$page = apiDownloadPage("course/" . $subject. "/" . $number, "service=CourseInfo&q=" . $subject . $number);
	$data = $page["response"]["data"]["result"];
	return $data[0];
}

function apiDownloadCourseScheduleList($code) {
	$page = apiDownloadPage("schedule/" . $code, "service=Schedule&q=" . $code);
	return $page["response"]["data"]["result"];
}

function apiGetSubjectIndex($subject) {
	$courses = apiDownloadCourseList($subject);
	$courseIndex = array();
	if($courses) {
		foreach ($courses as $course) {
			if($course["DeptAcronym"] == $subject) {
				$number = preg_replace('/\D/', '', $course["Number"]);
				$courseIndex[$number] = $course["Title"];
			}
		}
	}
	return $courseIndex;
}

function apiGetCourseData($subject, $number) {
	$data = apiDownloadCourse($subject, $number);
	$course = array();

	$subject = $data["DeptAcronym"];
	$number = $data["Number"];
	$title = $data["Title"];
	$description = $data["Description"];
	$components = apiParseComponents($data);
	$credits = $data["Credits"];
	$type = $data["Type"];
	$consentDepartment = ($data["needsDeptConsent"] == "1");
	$consentInstructor = ($data["needsInstrConsent"] == "1");
	$prereqDesc = $data["prereqDesc"];
	$antireqDesc = $data["antireqDesc"];
	$crosslistDesc = $data["crosslistDesc"];
	$coreqDesc = $data["coreqDesc"];
	$notes = $data["noteDesc"];
	$offered = array();
	$url = $data["URL"];

	$offered = commonParseOfferedFromDescription($description, $offered);
	$offered = commonParseOfferedFromNote($notes, $offered);
	$offered = commonFinalizeOffered($offered);

	// [hasDistEd] => 0
	// [onlyDistEd] => 0
	// [hasStj] => 0
	// [onlyStj] => 0
	// [hasRen] => 0
	// [onlyRen] => 0
	// [hasCgr] => 0
	// [onlyCgr] => 0

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