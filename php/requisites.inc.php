<?php

require_once("util.inc.php");


// Type A:
// Example: B; B. B; B
// 1. Split by ";" and "." outside brackets

// Type B:
// Example: C, C, (A), C or C
// 1. Split by ",", "and" and "or" outside brackets. "and" and "or" all pass their properties leftwards
// 2. Open brackets, each yielding type A
// 3. The rest yields type C. Iterate on C passing all previous types

// Type C:
// Examples, csv: CS 116, 137, 145 taken fall 2010 or earlier, ECE 123, CS 138, enrolled in Software Engineering, Level at least XX
// 1. Check for "Level at least", split by "or"
// 2. Check for "students only", split by "or"
// 3. Check for "Not open to", split by "or"
// 4. Check for "enroled in", split by "or"
// 5. Check if starts with course number. If so, look for previous course number and add it in front
// 6. Take it as a course.

//TOOD: comma, "and", "or" separation method

function parseRequisiteList($reqList) {
	$requisites = array();
	$parts = array_filter(preg_split("/[;\\.](?![^()]*+\\))/", $reqList));
	foreach($parts as $key => $part) {
		$result = array();
		$prev = 0;
		$length = strlen($part);
		$inBrackets = false;
		for ($i = 0; $i < $length; $i++) { 
			$char = $part{$i};
			if($inBrackets) {
				if($char == ")") {
					$inBrackets = false;
			 		parseRequisiteList(substr($part, $prev, $i - $prev));
			 		$prev = $i + 1;
				}
			}
			if($char == ",") {
		 		parseRequisite(substr($part, $prev, $i - $prev));
		 		$prev = $i + 1;
			}
		}

		$parts[$key] = array_merge_assoc_recursive_array($result);
	}
	return array_merge_assoc_recursive_array($parts);
}

function parseRequisite($req) {
	$req = trim($req);
	$requisite = array();
	//students only
	if(endsWith($req, "students only")) {
		$program = substr($req, 0, -14);
		$requisite["program"] = parseRequisiteOr($program);
	}
	else if(startsWith($req, "Level at least")) {
		$requisite["level"] = substr($req, 15, 2);
		$program = substr($req, 18);
		if($program != "") {
			$requisite["program"] = parseRequisiteOr($program);
		}
	}
	else if(startsWith($req, "Not open to")) {
		$requisite["programexclude"] = parseRequisiteOr(substr($req, 12));
	}
	else {
		$requisite["course"] = parseRequisiteOr($req);
	}
	return $requisite;
}

function parseRequisiteOr($requisite) {
	$parts = preg_split("/\\s+or(?! (later|earlier|higher))\\s+/i", $requisite);
	foreach($parts as $key => $part) {
		$parts[$key] = trim($part);
	}
	return $parts;
}


?>