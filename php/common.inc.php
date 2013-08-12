<?php

require_once("util.inc.php");
require_once("conf.inc.php");

function commonParseOfferedFromDescription($description, $offered) {
	preg_match("/\[([^\]]*)Offered: ([FWSJAM, ]*)\]/", $description, $matches);
	if(count($matches) > 0) {
		$terms = preg_split("/,/", $matches[count($matches) - 1]);
		foreach($terms as $term) {
			array_push($offered, trim($term));
		}
		for($i = count($matches) - 2; $i > 0; $i--) {
			array_push($offered, $matches[$i]);
		}
	}
	return $offered;
}

function commonParseOfferedFromNote($notes, $offered) {
	preg_match("/Offered: ([FWSJAM, ]*)/", $notes, $matches);
	if(count($matches) > 0) {
		$terms = preg_split("/,/", $matches[1]);
		foreach($terms as $term) {
			array_push($offered, trim($term));
		}
	}
	return $offered;
}

function commonFinalizeOffered($offered) {
	if(count($offered) == 0) {
		// $offered = array("F", "W", "S");
	}

	return array_filter(array_unique($offered));
}

?>