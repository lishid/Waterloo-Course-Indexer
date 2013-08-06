$(document).ready(function() {

	//Tweakable params
	var COURSE_LIMIT = 5;

	//Cached selectors
	var searchBar = $('#search input');
	var searchResults = $("#subject-results, #course-results, #results-count");
	var resultCount = $("#results-count");
	var subjectResults = $("#subject-results");
	var courseResults = $("#course-results");

	function loadSearchResult (results) {
		var numSubjects = objectKeyLength(results);
		var numCourses = 0;

		searchResults.empty();

		//Load subjects
		if (numSubjects > 1) {
			for (var subject in results) {
				subjectResults.append(generateHTML("subject", subject));
			}
		}

		//Load courses (within limit)
		for (var subject in results) {
			for (var number in results[subject]) {
				numCourses++;
				if (numCourses <= COURSE_LIMIT) {
					courseResults.append(generateHTML("course", subject, number));
				}
			}
		}
		showSearchResult(numCourses, numSubjects);
	}

	// load course details; hide search list
	function showCourse (course) {
		courseResults.append(generateHTML("opened-course", course.subject, course.number));
		
		var container = $("#" + course.subject + course.number);
		container.addClass("opened");

		var description = "<h2>Description</h2><p>" + course.description + "</p>";

		var terms = ["Fall", "Winter", "Spring"];
		var abbrs = ["F", "W", "S"];

		if (course.offered.length === 0) course.offered = abbrs;

		var availability = "<h2>Availability</h2><p class='offered'>";
		for (var i in abbrs) {
			availability += (jQuery.inArray(abbrs[i], course.offered) !== -1) ? "<span class='offered'>" + terms[i] + "</span>" : "";
		}
		availability += "</p>";
		container.find(".details").empty().append(description + availability).show();

		// transformation
		var width = container.find(".header").width();
		container.find(".header").width(width + 22);
	}; 

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

			resultCount.text(text);
		}
	}

	function enableSearch () {
		searchBar.on("input", function (e) {
			if (window.location.hash) {
				window.location.hash = "";
			}
			var query = $(this).val();
			if (query) {
				BACKEND.getCoursesByQuery(query, loadSearchResult);
			} else {
				searchResults.empty();
			}
		});
	}

	function generateHTML (component, subject, number) {
		var id = subject + number || "";
		var icon = "<div class='icon-wrapper'><div class='icon' style='background-image: url(\"img/course-icons/" + subject + ".svg\");'></div></div>";

		if (component === "subject") {
			return "<a href='#" + subject + "'><div class='subject " + BACKEND.subjects[subject].department + "' id='" + subject + "'><div class='header'><div class='title'><h2><span class='code'>" + subject + "</span></h2><h3><span class='name'>" + BACKEND.subjects[subject].title + "</span></h3></div>" + icon + "</div></div></a>";
		}

		var courseHTML = "<div class='course " + BACKEND.subjects[subject].department + "' id='" + id + "'><div class='header'>" + icon + "<div class='title'><h2><span class='code'>" + subject + " " + number + "</span></h2><h3><span class='name'>" + BACKEND.courseIndex[subject][number].trunc(50) + "</span></h3></div></div><div class='details' style='display: none'></div></div>";

		if (component === "course") {
			return "<a href='#" + id + "'>" + courseHTML + "</a>";
		} else if (component === "opened-course") {
			return courseHTML;
		}
	}

	function init () {
		if (history && history.pushState) {
			history.pushState(null, document.title, this.href);
		}
		$("body").addClass("historyPushed");
		window.addEventListener("popstate", function(event) {
			if($("body").hasClass("historyPushed")) {
				var href = window.location.href;
				searchResults.empty(); 
				if (window.location.hash) {
					var re = /#([A-Za-z]+)\s*(.*)/;
					var result = href.match(re);
					var subject = result[1];
					var number = result[2];
					if (result && subject && number) {
						BACKEND.getCourse(subject, number, showCourse);
					} else if (result && subject) {
						searchBar.val(subject + " ").focus();
						BACKEND.getCoursesByQuery(searchBar.val(), loadSearchResult);
					}
				} else if (searchBar.val()) {
					BACKEND.getCoursesByQuery(searchBar.val(), loadSearchResult);
				}
				enableSearch();
			}
		});	
	}

	init();

});