function attachCourseHandlers () {
	$('.course').each(function () {
		var id = $(this).attr('id');
		var subject = $(this).data('subject');
		var number = $(this).data('number');
		$('#' + id + ' .icon').css('background-image', getIconUrl(subject));
		$(this).click(function () {
			window.location.href = window.location.href.split('#')[0] + '#' + subject + number;
		});
	});
}

// get a results list from backend and load it
function loadCourses (results, limit) {
    $('.course').remove();
	var count = 0;
	for (var subject in results) {
		for (var number in results[subject]) {
			loadCourse (subject, number);
			count++;
			if (count >= limit) {
				attachCourseHandlers();
				return;
			}
		}
	}
	attachCourseHandlers();
}

// add a course result to the DOM
function loadCourse (subject, number) {
	var title = courses[subject][number] || '';
	HTML = '<div class="course ' + subjectToFacultyMap[subject] + '" id="' + subject + number + '" data-subject="'+ subject +'" data-number="' + number + '">';
	HTML += '<div class="header"><div class="icon-wrapper"><div class="icon"></div></div>';
	HTML += '<div class="title"><h2><span class="code">' + subject + " " + number + '</span></h2>';
	HTML += '<h3><span class="name">' + title.trunc(50) + '</span></h3></div></div>';
	HTML += '<div class="details" style="display: none"></div></div>';
	$('.course-results').append(HTML);
}

// get the path to an icon; it DOES NOT check for whether file exists
function getIconUrl (filename) {
	return 'url("img/course-icons/' + filename + '.svg")';
}

// load course details; hide search list
function showCourse (subject, number) {
	var code = subject + number;
	var container = $('#' + code);
	var href = window.location.href;
	if (!container.hasClass('opened')) {
		var subject, number;
		$('.course').remove();
		if (!container.length > 0) {
			loadCourse(subject, number);
			container = $('#' + subject + number);
		}

		var course = courses[subject][number];
		container.off('click');

		var HTML = '<h2>Description</h2>';
		// HTML += '<p>' + course.description + '</p>';
		HTML += '<p>SampleDescription</p>';

		var note = '';
		for (var i in course.offered) {
			var term = course.offered[i];
			if (term !== 'F' && term !== 'W' && term !== 'S') note = term; 
		}

		var terms = ['Fall', 'Winter', 'Spring'];
		var abbrs = ['F', 'W', 'S'];
		HTML += '<h2>Availability</h2><p class="offered">';
		for (var i in abbrs) {
			HTML += (jQuery.inArray(abbrs[i], course.offered) !== -1) ? '<span class="offered">' + terms[i] + '</span>' : '';
		}
		HTML += '</p>';
		container.find('.details').empty().append(HTML).show();
		container.addClass('opened');

		// transformation
		var width = container.find('.header').width();
		container.find('.header').width(width + 22);
	}
}; 

function showSearchResult (courseCount, subjectCount) {
    if (courseCount > 1) {
    	if (subjectCount > 1) {
    		var text = 'Found ' + courseCount + ' results in ' + subjectCount + ' subjects:';
    	} else {
    		var text = 'Found ' + courseCount + ' results:';
    	}
        $('.results-count').text(text);
    } else {
        $('.results-count').empty();
    }
}

function enableSearch () {
	$('.search input').on('input', function (e) {
		var href = window.location.href;
		if (href.indexOf('#') !== -1) {
			window.location.href = href.split('#')[0];
		} else if ($(this).val()) {
			getCoursesByQuery($(this).val());
		} else {
			$('.course-results, .results-count').empty();
		}
	});
	$('.search input').on('focus', function() {
		$('.course.selected').removeClass('selected');
	});
}

// listen for keyboard commands: up, down, and enter (return)
function addArrowKeyListener () {
	$(document).keydown(function(e) {
		if (e.keyCode === 38) {     // up key
			if ($('.selected').length > 0) {
				if ($('.selected').is(':first-child')) {
					$('.selected').removeClass('selected');
					$('.search input').focus();
				} else {
					$('.selected').removeClass('selected').prev().addClass('selected');
				}
			} else {
				$(':visible').last().addClass('selected');
				$('.search input').blur();
			} 
		} else if (e.keyCode === 40) {     // down key
			if ($('.selected').length > 0) {
				if ($('.selected').is(':visible'))
					$('.selected').removeClass('selected').next().addClass('selected');
				else
					$('.selected').removeClass('selected');
			} else {
				$('.course:visible').first().addClass('selected');
				$('.search input').blur();
			} 
		} else if (e.keyCode === 13 && $('.selected').length > 0) {
			var subject = $('.selected').data('subject');
			var number = $('.selected').data('number');
			window.location.href += '#' + subject + '-' + number;
		}
	 });
}

$(document).ready(function() {
	if (history && history.pushState) {
	   history.pushState(null, document.title, this.href);
	}
	$('body').addClass('historyPushed');
	window.addEventListener('popstate', function(event) {
		if($('body').hasClass('historyPushed')) {
			var href = window.location.href;
			$('.course-results, .results-count').empty(); 
			if (href.indexOf('#') !== -1) {
				var re = /#([A-Za-z]+)\s*(.*)/;
				var result = href.match(re);
				if (result && result[1] && result[2]) {
					var subject = result[1];
					var number = result[2];
					showCourse(subject, number);
					$('#' + subject + number + ' .icon').css('background-image', getIconUrl(subject));
				}
			} else if ($('.search input')) {
				getCoursesByQuery($('.search input').val());
			} else {
				if($('.course:visible').length > COURSES_SHOWN) {
					$('.course:visible:gt(' + (COURSES_SHOWN - 1) + ')').hide();
				}
				$('.subject').each(function () {
					$(this).click(function () {
						var id = $(this).attr('id');
						$('.search input').val(id + ' ').focus();
						$('.subject').hide();
					});
				});
			}
			enableSearch();
			addArrowKeyListener();
		}
	});
});