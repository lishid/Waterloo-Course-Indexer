<?php

require_once("util.inc.php");

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
				if($i > 0) {
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

function requisiteParseItem($input) {
	$input = trim($input);
	$inputLower = strtolower($input);
	if(startsWith($inputLower, "one of ")) {
		$result = preg_split("/(,|\\/)/", substr($input, 7));
		$prevSubject = "";
		foreach($result as $key => $item) {
			$item = trim($item);
			$subject = parseCourseSubject($item);
			$number = parseCourseNumberWithoutSubject($item);
			if(!$subject && $number) {
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
		}
	}
	else if(startsWith($input, "Not open to")) {
		$result[] = array("programexclude", parseRequisiteOr(substr($input, 12), ""));
	}
	else {
		$split = preg_split("/(,|and(?! Information Science))/", $input);
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
		$subject = parseCourseSubject($value);
		$number = parseCourseNumberWithoutSubject($value);
		if(!$subject && $number) {
			$value = $prevSubject . " " . $value;
		}
		return array($value);
	}
	foreach($parts as $key => $part) {
		$value = trim($part);
		$subject = parseCourseSubject($value);
		$number = parseCourseNumberWithoutSubject($value);
		if(!$subject && $number) {
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

function parseCourseNumberWithoutSubject($course) {
	preg_match("/^[0-9]+/", $course, $matches);
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
					return reset($result);
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


?>