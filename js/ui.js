var mainSpinnerOption = {
	lines: 11, length: 14, width: 5, radius: 21, corners: 1, rotate: 0, direction: 1, color: "#222", speed: 1, trail: 42, shadow: false, hwaccel: false, className: "spinner", zIndex: 2e9, top: "100", left: "auto"
};
var courseSpinnerOption = $.extend({}, mainSpinnerOption);
courseSpinnerOption.top = "250";

var spinner = new Spinner(mainSpinnerOption).spin(document.getElementById("loading-screen"));


$(document).ready(function() {

	//Tweakable params
	var COURSE_LIMIT = 5;

	//Cached selectors
	var $searchBar = $("#search input");
	var $searchResults = $("#subject-results, #course-results, #results-count");
	var $resultCount = $("#results-count");
	var $subjectResults = $("#subject-results");
	var $courseResults = $("#course-results");

	var subjectToIconMap = {
		"AFM": "money", "ACTSC": "bar-chart", "ANTH": "man-woman", "AHS": "dropper", "APPLS": "japanese", "AMATH": "calculator", "ARCH": "tower", "ARTS": "pen", "ARBUS": "business-person", "AVIA": "airplane", "BIOL": "microscope", "BUS": "business-person", "BET": "idea", "CHE": "fire", "CHEM": "beaker", "CHINA": "chinese", "CMW": "church", "CIVE": "road", "CLAS": "ankh", "CO": "puzzle", "COMM": "money", "CS": "console", "COOP": "work", "CROAT": "translation", "DAC": "film", "DRAMA": "mask", "DUTCH": "translation", "EARTH": "earth", "EASIA": "china-map", "ECON": "line-chart", "ECE": "chip", "ENGL": "pen", "ESL": "translation", "ENBUS": "recycle", "ERS": "recycle", "ENVE": "recycle", "ENVS": "recycle", "FINE": "palette", "FR": "translation", "GENE": "hard-hat", "GEOG": "globe", "GEOE": "mountain", "GER": "translation", "GERON": "aging", "GBDA": "film", "GRK": "translation", "HLTH": "first-aid", "HRM": "people", "HUMSC": "man-woman", "INDEV": "earth", "INTST": "earth", "INTTS": "earth", "ITAL": "translation", "JAPAN": "japanese", "JS": "jewish", "KIN": "run", "KOREA": "translation", "LAT": "translation", "LS": "gavel", "MATBUS": "business-person", "MSCI": "organize", "MNS": "atom", "MATH": "calculator", "MTHEL": "calculator", "ME": "gear", "MTE": "gear", "MEDVL": "ankh", "MUSIC": "music", "NE": "atom", "NATST": "native", "OPTOM": "eye", "PACS": "peace", "PHARM": "pill", "PHIL": "thinking", "PHYS": "atom", "PLAN": "plan", "POLSH": "translation", "PSCI": "congress", "PORT": "translation", "PD": "wtf", "PDPHRM": "wtf", "PSYCH": "brain", "PMATH": "infinity", "REC": "island", "RS": "church", "RUSS": "translation", "SCI": "magnet", "SCBUS": "magnet", "SMF": "man-woman", "SDS": "network", "SOCWK": "network", "SWREN": "network", "STV": "network",  "SOC": "network", "SE": "console", "SPAN": "translation", "SPCOM": "speech", "STAT": "bar-chart", "SI": "islam", "SYDE": "rocket", "UNIV": "goose", "VCULT": "film", "WS": "female", "WKRPT": "wtf"
	};

	// Get the svg filename of a subject from mapping
	function getIcon (subject) {
		return subjectToIconMap[subject] || "generic";
	}

	// Load search results that are provided by the backend
	function loadSearchResult (results) {
		var numSubjects = Object.size(results);
		var numCourses = 0;

		$searchResults.empty();

		// Load subjects
		if (numSubjects > 1) {
			for (var subject in results) {
				$subjectResults.append(generateHTML("subject", subject));
			}
		}

		// Load courses (within limit)
		for (var subject in results) {
			for (var number in results[subject]) {
				numCourses++;
				if (numCourses <= COURSE_LIMIT) {
					$courseResults.append(generateHTML("course", subject, number));
				}
			}
		}
		showSearchResult(numCourses, numSubjects);
	}

	// Expand the course without changing the hash
	function expandCourse (courseDiv) {
		var result = courseDiv.attr("id").match(/([A-Za-z]+)\s*(.*)/);
		var subject = result[1];
		var number = result[2];
		courseDiv.addClass("opened");
		BACKEND.getCourse(subject, number, false, showCourse);
	}

	// Close an already expanded course
	function closeCourse (courseDiv) {
		courseDiv.removeClass("opened");
		courseDiv.find(".details").slideUp(200);
	}

	// Setup course header before more data is fetched
	function setupCourse (subject, number) {
		$courseResults.append(generateHTML("opened-course", subject, number));
		var container = $("#" + subject + number);
		container.addClass("opened");

		spinner = new Spinner(courseSpinnerOption).spin(document.getElementById("loading-screen"));
	}

	// Load course details
	function showCourse (course, fullDetails) {
		function getHTML (section, limit) {
			if (course[section] && limit) {
				return "<h2>" + section.toTitleCase() + "</h2><p>" + course[section].trunc(limit) + "</p>";
			} else if (course[section]) {
				return "<h2>" + section.toTitleCase() + "</h2><p>" + course[section] + "</p>";		
			} else {
				return "";
			}
		}

		var container = $("#" + course.subject + course.number);
		var html = "";

		var terms = ["Fall", "Winter", "Spring"];
		var abbrs = ["F", "W", "S"];

		if (course.offered.length === 0) course.offered = abbrs;

		var availability = "<h2>Availability</h2><p class='offered'>";
		for (var i in abbrs) {
			availability += (jQuery.inArray(abbrs[i], course.offered) !== -1) ? "<span class='offered'>" + terms[i] + "</span>" : "";
		}
		availability += "</p>";
		html += availability;

		if (!fullDetails) {
			html += getHTML("description", 200);
		} else {
			html += getHTML("description");
			html += getHTML("notes");
			html += getHTML("components");
			html += getHTML("credits");
			if (course.url) {
				html += "<p class='course-link'><a href=" + course.url + ">View official course description</a></p>";
			}	
		}

		spinner.stop();
		container.find(".details").empty().append(html).slideDown(300);
	}; 

	// Display number of results found
	function showSearchResult (courseCount, subjectCount) {
		if (courseCount > 0) {
			var text = "";

			if (subjectCount > 1) {
				text = "Found " + courseCount + " results in " + subjectCount + " subjects:";
			} else if (courseCount > 1) {
				text = "Found " + courseCount + " results:";
			} else {
				text = "Found 1 result:";
			}

			$resultCount.text(text);
		}
	}

	// Enable search by listening to input on search bar
	function enableSearch () {
		$searchBar.on("input", function (e) {
			if (window.location.hash) {
				window.location.hash = "";
			}
			var query = $(this).val();
			if (query) {
				BACKEND.getCoursesByQuery(query, loadSearchResult);
			} else {
				$searchResults.empty();
			}
		});
	}

	// Generate HTML for a component
	function generateHTML (component, subject, number) {
		var id = subject + number || "";
		var icon = "<div class='icon-wrapper'><div class='icon icon-" + getIcon(subject) + "'></div></div>";

		if (component === "subject") {
			return "<a href='#" + subject + "'><div class='subject " + BACKEND.subjects[subject].department + "' id='" + subject + "'><div class='header'><div class='title'><h2><span class='code'>" + subject + "</span></h2><h3><span class='name'>" + BACKEND.subjects[subject].title + "</span></h3></div>" + icon + "</div></div></a>";
		}

		var courseHTML = "<div class='course " + BACKEND.subjects[subject].department + "' id='" + id + "'><div class='header'>" + icon + "<div class='title'><h2><span class='code'>" + subject + " " + number + "</span></h2><h3><span class='name'>" + BACKEND.courseIndex[subject][number].trunc(50) + "</span></h3></div></div><div class='details' style='display: none'></div></div>";

		if (component === "course") {
			return "<a href='#" + id + "'>" + courseHTML + "</a>";
		} else if (component === "opened-course") {
			return courseHTML;
		} else if (component === "small-course") {
			return "<a href='" + id + "'><div class='course small " + BACKEND.subjects[subject].department + "' id='" + id + "'><div class='header'>" + icon + "<div class='title'><h2><span class='code'>" + subject + " " + number + "</span></h2></div></div></div></a>";
		}
	}			

	function stopLoadingScreen () {
		spinner.stop();
		$searchBar.show();
		$searchResults.show();
		init();
	}

	function init () {
		function work () {
			$searchResults.empty();
			if (window.location.hash) {
				var result = window.location.hash.match(/#([A-Za-z]+)\s*(.*)/);
				var subject = result[1];
				var number = result[2];
				if (result && subject && number) {
					if (BACKEND.courseIndex[subject] && BACKEND.courseIndex[subject][number]) {
						document.title = subject + " " + number + " - UWaterloo Course Indexer";
						setupCourse(subject, number);
						BACKEND.getCourse(subject, number, true, showCourse);	
					} else {
						document.title = "Home - UWaterloo Course Indexer";
						$searchBar.val("");
						window.location.hash = "";
					}
				} else if (result && subject) {
					document.title = subject + " course - UWaterloo Course Indexer";			
					$searchBar.val(subject + " ").focus();
					BACKEND.getCoursesByQuery($searchBar.val(), loadSearchResult);
				}
			} else {
				document.title = "Home - UWaterloo Course Indexer";
				$searchBar.focus();
				if ($searchBar.val()) {
					BACKEND.getCoursesByQuery($searchBar.val(), loadSearchResult);		
				}
			}
			enableSearch();
		}

		work();
		window.addEventListener("hashchange", work);
		$courseResults.on("click", ".course", function (evt) {
			if (!$(this).hasClass("opened")) {
				expandCourse($(this));
			} else {
				closeCourse($(this));
			}
			evt.preventDefault();
		});
	}

	BACKEND.registerUICallback(stopLoadingScreen);
});