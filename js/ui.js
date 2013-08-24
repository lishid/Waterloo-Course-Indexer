var spinner = new Spinner(mainSpinnerOption).spin(document.getElementById("loading-screen"));

$(document).ready(function() {

	// Cached selectors
	var $searchBar = $("#search input");
	var $searchResults = $("#subject-results, #course-results, #results-count");
	var $resultCount = $("#results-count");
	var $subjectResults = $("#subject-results");
	var $courseResults = $("#course-results");
	var $toTop = $("#back-to-top");

	// State trackers
	var loadedCourses = 0;
	var prevSearch = "";
	var currentState = pageState.MAIN_SEARCH;
	var showFullCourse = false;


	// UI Rendering methods

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

	// Load search results that are provided by the backend
	function loadSearchResult (results) {
		var numSubjects = Object.size(results);
		var numCourses = 0;

		$searchResults.empty();

		// Load subjects
		if (numSubjects > 1) {
			sortedEach(results, function(subject){
				$subjectResults.append(generateSubjectHTML(subject));
			});
		}
		// Load courses (within limit)
		sortedEach(results, function(subject){
			sortedEach(results[subject], function(number){
				numCourses++;
				if (numCourses <= COURSE_LIMIT) {
					$courseResults.append(generateCourseHTML(subject, number));
				}
			});
		});

		loadedCourses = Math.min(numCourses, COURSE_LIMIT);
		showSearchResult(numCourses, numSubjects);
	}

	// Load some more courses, amount depending on COURSE_BATCH_SIZE
	function loadMoreCourses (results) {
		var count = 0;
		var end = false;
		var loaded = 0;
		var startIdx = loadedCourses + 1;
		var endIdx = loadedCourses + COURSE_BATCH_SIZE - 1;

		sortedEach(results, function(subject){
			sortedEach(results[subject], function(number){
				count++;
				if (count >= startIdx && count <= endIdx) {
					$courseResults.append(generateCourseHTML(subject, number));
					loaded++;
				} else if (count > endIdx) {
					return true;
				}
			});
		});
		loadedCourses += loaded;
	}

	// Expand the course without changing the hash
	function expandCourse (courseDiv) {
		var result = courseDiv.attr("id").match(/([A-Za-z]+)\s*(.*)/);
		var subject = result[1];
		var number = result[2];
		spinner = new Spinner(expandedSpinnerOption).spin(document.getElementById(courseDiv.attr("id")));
		showFullCourse = false;
		BACKEND.getCourse(subject, number, showCourse);
	}

	// Close an already expanded course
	function closeCourse (courseDiv) {
		courseDiv.removeClass("opened");
		courseDiv.find(".details").slideUp(200);
	}

	// Setup course header before more data is fetched
	function setupCourse (subject, number) {
		$courseResults.append(generateCourseHTML(subject, number));
		var container = $("#" + subject + number);
		container.addClass("opened");

		spinner = new Spinner(courseSpinnerOption).spin(document.getElementById("loading-screen"));
	}

	// Load course details
	function showCourse (course) {
		showPrereq(course.prereq, "and");
		function getHTML (section, limit) {
			if (course[section] && limit) {
				return "<h2>" + section.toTitleCase() + "</h2><p>" + course[section].trunc(limit) + "</p>";
			} else if (course[section]) {
				return "<h2>" + section.toTitleCase() + "</h2><p>" + course[section] + "</p>";		
			} else {
				return "";
			}
		}

		var courseDiv = $("#" + course.subject + course.number);
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

		if (!showFullCourse) {
			html += getHTML("description", 200);
			html += "<p class='course-link'><a href=#" + course.subject + course.number + ">Course details</a></p>";
		} else {
			html += getHTML("description");
			html += getHTML("notes");
			html += getHTML("components");
			html += getHTML("credits");
			if (course.url) {
				html += "<p class='official-link'><a href=" + course.url + ">View official course description</a></p>";
			}	
		}

		spinner.stop();
		if (!showFullCourse) {
			courseDiv.addClass("opened");
		}
		courseDiv.find(".details").empty().append(html).slideDown(300);
	}

	function showPrereq (prereq, rel) {
		var size = Object.size(prereq);
		if (typeof prereq === "string") {
			// render the course
			console.log(rel + " " + prereq);
		} else if (typeof prereq === "object" && size > 0) {
			if (prereq[0] !== "program" && prereq[0] !== "programexclude" && prereq[0] !== "level") {
				if (prereq[0] === "or") {
					if (size > 1) {
						for (var i = 1; i < size; i++) {
							showPrereq(prereq[i], "or");
						}
					}
				} else {
					for (var i = 0; i < size; i++) {
						showPrereq(prereq[i], "and");
					}
				}
			}
		}
	}

	function generateSubjectHTML (subject) {
		var icon = generateSubjectIconHTML(subject);
		var subjectObject = BACKEND.getSubjectIndex(subject);
		var department = subjectObject.department;
		var title = subjectObject.title;
		return "<a href='#" + subject + "'>" + 
			"<div class='subject " + department + "' id='" + subject + "'>" + 
			"<div class='header'><div class='title'>" + 
			"<h2><span class='code'>" + subject + "</span></h2>" + 
			"<h3><span class='name'>" + title + "</span></h3>" + 
			"</div>" + icon + "</div></div></a>";
	}

	function generateCourseHTML (subject, number) {
		var id = subject + number;
		var icon = generateSubjectIconHTML(subject);
		var department = BACKEND.getSubjectIndex(subject).department;
		var courseTitle = BACKEND.getCourseIndex(subject, number).trunc(50);
		return "<div class='course " + department + "' id='" + id + "'>" + 
			"<div class='header'>" + icon + "<div class='title'>" + 
			"<h2><span class='code'>" + subject + " " + number + "</span></h2>" + 
			"<h3><span class='name'>" + courseTitle + "</span></h3>" + 
			"</div></div><div class='details' style='display: none'></div></div>";
	}

	function generateSmallCourseHTML (subject, number) {
		var id = subject + number || "";
		var icon = generateSubjectIconHTML(subject);
		return "<a href='" + id + "'>" + 
			"<div class='course small " + BACKEND.getSubjectIndex(subject).department + "' id='" + id + "'>" + 
			"<div class='header'>" + icon + "<div class='title'>" + 
			"<h2><span class='code'>" + subject + " " + number + "</span></h2>" + 
			"</div></div></div></a>";
	}

	function generateSubjectIconHTML(subject) {
		return "<div class='icon-wrapper'><div class='icon icon-" + getIcon(subject) + "'></div></div>";
	}


	// Handlers

	// Enable search by listening to "input" on search bar
	function enableSearch () {
		function checkChange () {
			var newSearch = $searchBar.val();
			if (newSearch !== prevSearch) {
				if (newSearch) {
					BACKEND.getCoursesByQuery(newSearch, loadSearchResult);
				} else {
					$searchResults.empty();
				}
				prevSearch = newSearch;
			}
		}

		if (!isIE) {
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
		// Use interval for IE since deletion doesn't trigger "input"
		else {
			setInterval(checkChange, 50);
		}
	}

	// Load more courses when scrolled to the bottom
	function attachScrollHandler () {
		$(window).scroll(function() {  
			if (withinDistanceFromPageBottom(LOAD_MORE_THRESHOLD) && currentState === pageState.MAIN_SEARCH) {
				BACKEND.getCoursesByQuery($searchBar.val(), loadMoreCourses);
			}
			if ($(document).scrollTop() > BACK_TO_TOP_THRESHOLD) {
				$toTop.fadeIn();
			} else {
				$toTop.fadeOut();
			}
		});
		$toTop.click(function (evt) {
			evt.preventDefault();
			$("body").animate({ scrollTop: 0 }, 300);
		});
	}

	// Expand or close course when clicking on the course header
	function attachCourseHandler () {
		$courseResults.on("click", ".course .header", function (evt) {
			if (!$(this).parent().hasClass("opened")) {
				expandCourse($(this).parent());
			} else {
				closeCourse($(this).parent());
			}
			evt.preventDefault();
		});
	}

	function attachBackToHomeHandler () {
		$("#page-header").click(function () {
			window.location.hash = "";
			clearSearch();
		});
	}

	// Helper methods

	// Stop spinner and show components
	function stopLoadingScreen () {
		spinner.stop();
		$searchBar.show();
		$searchResults.show();
		init();
	}

	function clearSearch () {
		document.title = "Home - UWaterloo Course Indexer";
		$searchBar.val("");
		$searchResults.empty();
		currentState = pageState.MAIN_SEARCH;
	}

	// Get the svg filename of a subject from mapping
	function getIcon (subject) {
		return subjectToIconMap[subject] || "generic";
	}


	function init () {
		function work () {
			$searchResults.empty();
			loadedCourses = 0;
			if (window.location.hash) {
				var result = window.location.hash.match(/#([A-Za-z]+)\s*(.*)/);
				var subject = result[1];
				var number = result[2];
				// Valid subject
				if (result && subject && BACKEND.getCourseIndexList(subject)) {
					// Valid course
					if (number && BACKEND.getCourseIndex(subject, number)) {
						currentState = pageState.COURSE_DETAILS;
						document.title = subject + " " + number + " - UWaterloo Course Indexer";
						setupCourse(subject, number);
						showFullCourse = true;
						BACKEND.getCourse(subject, number, showCourse);
					}
					// Invalid number
					else if (number) {
						clearSearch();
					}
					// Valid subject
					else {
						document.title = subject + " courses - UWaterloo Course Indexer";	
						$searchBar.val(subject + " ").focus();
						BACKEND.getCoursesByQuery($searchBar.val(), loadSearchResult);
					}
				}
				// Invalid subject
				else {
					clearSearch();
				}
			} else {
				document.title = "Home - UWaterloo Course Indexer";
				$searchBar.focus();
				currentState = pageState.MAIN_SEARCH;
				if ($searchBar.val()) {
					BACKEND.getCoursesByQuery($searchBar.val(), loadSearchResult);		
				}
			}
		}

		work();
		window.addEventListener("hashchange", work);
		enableSearch();
		attachScrollHandler();
		attachCourseHandler();
		attachBackToHomeHandler();
	}

	BACKEND.registerUICallback(stopLoadingScreen);
});