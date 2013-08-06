<?php

require_once("php/indexing.inc.php");

set_time_limit(0);

if(isset($_GET["subjects"])) {
	echo json_encode(getSubjectsIndex());
}
else if(isset($_GET["index"])) {
	echo json_encode(getAllSubjectIndex());
}
else if(isset($_GET["course"])) {
	if(isset($_GET["subject"]) && isset($_GET["number"])) {
		$subject = strtoupper($_GET["subject"]);
		$number = $_GET["number"];
		echo json_encode(getCourseData($subject, $number));
	}
}
else {
	generateSubjectCoursesData("CS");
	generateSubjectCoursesData("ECE");
	print_r("");
}

?>