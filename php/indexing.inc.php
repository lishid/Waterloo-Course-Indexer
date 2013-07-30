<?php

require_once("api.inc.php");
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
	$filename = getcwd() . "/index/subject-index/" . $subject;
	$data = getCacheGet($filename);
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

function getCourseData($subject, $number) {
	$filename = getcwd() . "/index/course/" . $subject . "/" . $number;
	$data = getCacheGet($filename);
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
	$data = apiGetCourse($subject, $number);
	$course = array();
	$course["subject"] = $data -> DeptAcronym;
	$course["number"] = $data -> Number;
	$course["title"] = $data -> Title;
	$offered = array();
	$description = $data -> Description;
	preg_match("/\[([^\]]*)Offered: ([FWS,]*)\]/", $description, $matches);
	if(count($matches) > 0) {
		$terms = preg_split("/,/", $matches[count($matches) - 1]);
		foreach($terms as $term) {
			array_push($offered, $term);
		}
		for($i = count($matches) - 2; $i > 0; $i--) {
			array_push($offered, $matches[$i]);
		}
	}
	$course["description"] = $description;
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
	$course["components"] = trim($components, " ,");
	$course["credits"] = $data -> Credits;

	// [hasDistEd] => 0
	// [onlyDistEd] => 1
	// [hasStj] => 0
	// [onlyStj] => 0
	// [hasRen] => 0
	// [onlyRen] => 0
	// [hasCgr] => 0
	// [onlyCgr] => 0

	$course["type"] = $data -> Type;
	$course["consentDepartment"] = ($data -> needsDeptConsent == "1");
	$course["consentInstructor"] = ($data -> needsInstrConsent == "1");
	//TODO: Download prereqs
	$course["prereqDesc"] = $data -> prereqDesc;
	$course["antireqDesc"] = $data -> antireqDesc;
	$course["crosslistDesc"] = $data -> crosslistDesc;
	$course["coreqDesc"] = $data -> coreqDesc;
	$notes = $data -> noteDesc;
	$course["notes"] = $notes;
	preg_match("/Offered: ([FWS,]*)/", $notes, $matches);
	if(count($matches) > 0) {
		$terms = preg_split("/,/", $matches[1]);
		foreach($terms as $term) {
			array_push($offered, $term);
		}
	}

	if(count($offered) == 0) {
		$offered = array("F", "W", "S");
	}

	$course["offered"] = array_filter(array_unique($offered));
	$course["url"] = $data -> URL;
	return $course;
}


?>