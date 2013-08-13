<?php

require_once("util.inc.php");


// Type A:
// Example: B; B. B; B
// 1. Split by ";" and "." outside brackets

// Type B:
// Example: C, C, (A), C or C
// 1. Split by ",", "and" and "or" outside brackets. "One of", "and" and "or" all pass their properties leftwards
// 2. Open brackets, each yielding type A
// 3. The rest yields type C. Iterate on C passing all previous types

// Type C:
// Examples, csv: CS 116, 137, 145 taken fall 2010 or earlier, ECE 123, CS 138, enrolled in Software Engineering, Level at least XX
// 1. Check for "Level at least", split by "or"
// 2. Check for "students only", split by "or"
// 3. Check for "Not open to", split by "or"
// 4. Check for "enrolled in", split by "or"
// 5. Check if starts with course number. If so, look for previous course number and add it in front
// 6. Take it as a course.

function recursiveSplit($input) {
	$split = requisiteParseBrackets($input);

	$result = array(array());
	$index = 0;

	foreach($split as $value) {
		if(is_array($value)) {
			$result[$index][] = $value;
		}
		else {
			$parts = preg_split("/[;\\.]/", $value);
			for ($i = 0; $i < count($parts); $i++) {
				if($i > 1) {
					$result[] = array();
					$index++;
				}
				$parsedItems = requisiteParseItem($parts[$i]);
				foreach($parsedItems as $item) {
					$result[$index][] = $item; 
				}
			}
		}
	}

	return flattenUselessArray($result);
}

function requisiteParseItem($input) {
	$input = trim($input);
	$inputLower = strtolower($input);
	if(startsWith($inputLower, "one of ")) {
		$result = preg_split("/(,|\\/)/", substr($input, 7));
		$prevSubject = "";
		foreach($result as $key => $item) {
			$item = trim($item);
			$subject = parseCourseSubject($item);
			if(!$subject) {
				$item = $prevSubject . " " . $item;
			}
			else {
				$prevSubject = $subject;
			}
			$result[$key] = $item;
		}
		array_unshift($result, "or");
		return $result;
	}

	$result = array();
	//Special cases
	if(endsWith($input, "students only")) {
		$program = substr($input, 0, -14);
		$result[] = array("program", parseRequisiteOr($program, ""));
	}
	else if(startsWith($input, "Level at least")) {
		$result[] = array("level", substr($input, 15, 2));
		$program = substr($input, 18);
		if($program != "") {
			$result[] = array("program", parseRequisiteOr($program, ""));
			$result["program"] = parseRequisiteOr($program, "");
		}
	}
	else if(startsWith($input, "Not open to")) {
		$result[] = array("programexclude", parseRequisiteOr(substr($input, 12), ""));
	}
	else {
		$split = preg_split("/(,|and)/", $input);
		if(count($split) == 1) {
			$result[] = parseRequisiteOr($input, "");
		}
		else {
			$prevSubject = "";
			foreach($split as $item) {
				$item = parseRequisiteOr($item, $prevSubject);
				$result[] = $item;
				$last = $item;
				if(is_array($item)) {
					$last = end($item);
				}
				$prevSubject = parseCourseSubject($last);
			}
		}
	}
	return $result;
}

function parseRequisiteOr($requisite, $prevSubject) {
	$parts = preg_split("/(\\/|\\s+or(?! (later|earlier|higher))\\s+)/i", $requisite);
	if(count($parts) == 1) {
		$value = trim($requisite);
		if(!parseCourseSubject($value)) {
			$value = $prevSubject . " " . $value;
		}
		return array($value);
	}
	foreach($parts as $key => $part) {
		$value = trim($part);
		$subject = parseCourseSubject($value);
		if(!$subject) {
			$value = $prevSubject . " " . $value;
		}
		else {
			$prevSubject = $subject;
		}
		$parts[$key] = $value;
	}
	array_unshift($parts, "or");
	return $parts;
}

function parseCourseSubject($course) {
	preg_match("/^[A-Z]+/", $course, $matches);
	if($matches[0]) {
		return $matches[0];
	}
	else {
		return false;
	}
}

function flattenUselessArray($input) {
	if(is_array($input)) {
		if(count($input) == 1) {
			return flattenUselessArray(reset($input));
		}
		else {
			$result = array();
			foreach($input as $key => $value) {
				$value = flattenUselessArray($value);
				if($value) {
					if(is_array($value) && count($value) > 0) {
						$result[$key] = $value;
					}
					else if(!is_array($value)){
						$value = trim($value);
						if($value != "") {
							$result[$key] = $value;
						}
					}
				}
			}
			$count = count($result);
			if($count > 0) {
				if($count == 1) {
					return reset($count);
				}
				return $result;
			}
		}
	}
	else {
		$input = trim($input);
		if(
		$input && $input != "") {
			return $input;
		}
	}
}

function requisiteParseBrackets($input) {
	$split = array();
	$prev = 0;
	$inBrackets = 0;
	$length = strlen($input);
	for ($i = 0; $i <= $length; $i++) { 
		$char = $input{$i};
		if($char == ")") {
			$inBrackets--;
			if($inBrackets == 0) {
				$split[] = recursiveSplit(substr($input, $prev, $i - $prev));
				$prev = $i + 1;
			}
		}
		else if($char == "(") {
			if($inBrackets == 0) {
				$split[] = substr($input, $prev, $i - $prev);
				$prev = $i + 1;
			}
			$inBrackets++;
		}

		if($i == $length - 1) {
			$split[] = substr($input, $prev, $i - $prev + 1);
			break;
		}
	}

	return $split;
}






function parseRequisiteList($reqList) {
	$requisites = array();
	$parts = array_filter(preg_split("/[;\\.](?![^()]*+\\))/", $reqList));
	foreach($parts as $key => $part) {
		$result = array();
		$prev = 0;
		$length = strlen($part);
		$inBrackets = 0;
		for ($i = 0; $i < $length; $i++) { 
			$char = $part{$i};
			if($char == ")") {
				$inBrackets--;
				if($inBrackets == 0) {
					$result[] = parseRequisiteList(substr($part, $prev, $i - $prev));
					$prev = $i + 1;
				}
			}
			else if($char == "," && $inBrackets == 0) {
				$result[] = parseRequisite(substr($part, $prev, $i - $prev));
				$prev = $i + 1;
			}
			else if($char == "(") {
				if($inBrackets == 0) {
					$result[] = parseRequisite(substr($part, $prev, $i - $prev));
					$prev = $i + 1;
				}
				$inBrackets++;
			}
		}
		$result[] = parseRequisite(substr($part, $prev, $length - $prev));
		$prev = $i + 1;

		$parts[$key] = array_merge_assoc_recursive_array($result);
	}
	return array_merge_assoc_recursive_array($parts);
}

function parseRequisite($req) {
	$req = trim($req);
	$reqLower = strtolower($req);
	if(startsWith($reqLower, "one of ")) {
		$result = split(",", substr($line, 7));
		$result = trimArray($result);
		return array( "or" => $result );
	}

	$requisite = array();
	$requisite["query"] = array($req => $req);
	// Students only
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

//Split by: comma, "One of", "and", "or" separation method
function parseSplitting($line) {
	$line = trim($line);
	$lineLower = strtolower($line);
	if(startsWith($lineLower, "one of ")) {
		$result = split(",", substr($line, 7));
		$result = trimArray($result);
		return array( "or" => $result );
	}

	$orParts = preg_split("/\\s+or(?! (later|earlier|higher))\\s+/i", $line);
	$result = array();
	foreach($orParts as $key => $orPart) {
		$subresult = array();
		$subparts = array_filter(preg_split("/[,\/](?![^()]*+\\))/", $orPart));
		foreach($subparts as $k => $part) {
			array_push($subresult, trim($part));
		}
		array_push($result, $subresult);
	}

	return array( "or" => $result );
}

?>