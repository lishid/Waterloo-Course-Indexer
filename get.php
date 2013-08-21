<?php

require_once("php/indexing.inc.php");

require_once("php/gz.inc.php");

set_time_limit(0);

if(isset($_GET["subjects"])) {
	echo utilEncodeJson(getSubjectsIndex());
}
else if(isset($_GET["index"])) {
	echo utilEncodeJson(getAllSubjectIndex());
}
else if(isset($_GET["clearcache"])) {
	clearCache();
}
else if(isset($_GET["course"])) {
	if(isset($_GET["subject"]) && isset($_GET["number"])) {
		$subject = strtoupper($_GET["subject"]);
		$number = $_GET["number"];
		echo utilEncodeJson(getCourseData($subject, $number));
	}
}
else if(isset($_GET["courses"])) {
	if(isset($_GET["subject"])) {
		$subject = strtoupper($_GET["subject"]);
		echo utilEncodeJson(generateSubjectCoursesData($subject));
	}
}
else {
	echo utilEncodeJson(ucalendarGetCourseData("CHE", "101"));
	//utilEncodeJson
}

?>