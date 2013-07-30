<?php

require_once("util.inc.php");
require_once("conf.inc.php");

function apiBaseUrl() {
	return API_URL . "?key=" . API_KEY . "&";
}

function apiGetPage($filename, $urlSuffix) {
	$filename = getcwd() . "/cache/" . $filename;
	$data = getCacheGet($filename);
	if(!$data) {
		$data = file_get_contents(apiBaseUrl() . $urlSuffix);
		utilCacheWrite($filename, $data);
	}
	return json_decode($data)->response->data->result;
}

function apiGetCourseList($code) {
	return apiGetPage("course-list/" . $code, "service=CourseSearch&q=" . $code);
}

function apiGetCourseScheduleList($code) {
	return apiGetPage("schedule/" . $code, "service=Schedule&q=" . $code);
}

function apiGetCourse($subject, $number) {
	$data = apiGetPage("course/" . $subject. "/" . $number, "service=CourseInfo&q=" . $subject . $number);
	return $data[0];
}

?>