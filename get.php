<?php

require_once("php/indexing.inc.php");

require_once("php/gz.inc.php");

set_time_limit(0);

if(isset($_GET["subjects"])) {
	echo utilEncodeJson(getSubjectsIndex(true));
}
else if(isset($_GET["index"])) {
	echo utilEncodeJson(getAllSubjectIndex(true));
}
else if(isset($_GET["clearcache"])) {
	clearCache();
}
else if(isset($_GET["course"])) {
	if(isset($_GET["subject"]) && isset($_GET["number"])) {
		$subject = strtoupper($_GET["subject"]);
		$number = $_GET["number"];
		echo utilEncodeJson(getCourseData($subject, $number, true));
	}
}
else if(isset($_GET["courses"])) {
	if(isset($_GET["subject"])) {
		$subject = strtoupper($_GET["subject"]);
		echo utilEncodeJson(getSubjectCoursesData($subject, true));
	}
}
else {
	echo utilEncodeJson(ucalendarGetCourseData("CHE", "101"));
	//utilEncodeJson
}

?>