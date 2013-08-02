var DESC_LENGTH = 200;
var COURSES_SHOWN = 5;


var facultyToSubjectMap = {
	'AHS': [ 'AHS', 'GERON', 'HLTH', 'KIN', 'REC' ],
	'ART': [ 'AFM', 'ANTH', 'APPLS', 'ARTS', 'ARBUS', 'BUS', 'CHINA', 'CMW', 'CLAS', 'CROAT', 'DAC', 'DRAMA', 'DUTCH', 'EASIA', 'ECON', 'ENGL', 'ESL', 'EFAS', 'FINE', 'FR', 'GER', 'GBDA', 'GRK', 'HIST', 'HRM', 'HUMSC', 'IS', 'INTST', 'INTTS', 'ITAL', 'ITALST', 'JAPAN', 'JS', 'KOREA', 'LAT', 'MEDVL', 'MUSIC', 'NATST', 'PACS', 'PHIL', 'POLSH', 'PSCI', 'PORT', 'PSYCH', 'RS', 'RUSS', 'REES', 'SMF', 'SOCWK', 'SOC', 'SPAN', 'SPCOM', 'SI', 'STV', 'VCULT', 'WS' ],
	'ENG': [ 'ARCH', 'BET', 'CHE', 'CIVE', 'ECE', 'ENVE', 'GENE', 'GEOE', 'MSCI', 'ME', 'MTE', 'NE', 'SE', 'SYDE' ],
	'ENV': [ 'ENBUS', 'ERS', 'ENVS', 'GEOG', 'INDEV', 'INTEG', 'PLAN' ],
	'MAT': [ 'ACTSC', 'AMATH', 'CO', 'COMM', 'CS', 'MATBUS', 'MATH', 'MTHEL', 'PMATH', 'STAT' ],
	'SCI': [ 'BIOL', 'CHEM', 'EARTH', 'MNS', 'OPTOM', 'PHARM', 'PHYS', 'PDPHRM', 'SCI', 'SCBUS' ],
	'OTHER': [ 'AVIA', 'COOP', 'PD', 'WKRPT', 'UNIV' ]
};

var subjectToFacultyMap = {};

for (var faculty in facultyToSubjectMap) {
	for (var i in facultyToSubjectMap[faculty])
		subjectToFacultyMap[facultyToSubjectMap[faculty][i]] = faculty;
}

var subjectCache = {}, courseCache = {};

function attachCourseHandlers () {
	$('.course').each(function () {
		var id = $(this).attr('id');
		var subject = $(this).data('subject');
		var number = $(this).data('number');
		$('#' + id + ' .icon').css('background-image', getIconUrl(subject));
		$(this).click(function () {
			window.location.href = window.location.href.split('#')[0] + '#' + subject + '-' + number;
		});
	});
}

function loadCourses (results, limit) {
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

function loadCourse (subject, number) {
	var title = courses[subject][number] || '';
	HTML = '<div class="course ' + subjectToFacultyMap[subject] + '" id="' + subject + number + '" data-subject="'+ subject +'" data-number="' + number + '">';
	HTML += '<div class="header"><div class="icon-wrapper"><div class="icon"></div></div>';
	HTML += '<div class="title"><h2><span class="code">' + subject + " " + number + '</span></h2>';
	HTML += '<h3><span class="name">' + title.trunc(50) + '</span></h3></div></div>';
	HTML += '<div class="details" style="display: none"></div></div>';
	$('.course-results').append(HTML);
}

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

function filter (query) {
	var sortFn = function (a, b) { return $(a).attr('id') - $(b).attr('id'); };
	$('.course').each(function () {
		if ($(this).find('.code').text().replaceAll(' ', '').toLowerCase().indexOf(query.toLowerCase()) == -1) {
			$(this).hide();
		} else $(this).show()
	});
	if($('.course:visible').length > COURSES_SHOWN) {
		$('.course:visible:gt(' + (COURSES_SHOWN - 1) + ')').hide();
	}
}

function enableSearch() {
	$('.search input').on('input', function (e) {
		var href = window.location.href;
		if (href.indexOf('#') !== -1) {
			window.location.href = href.split('#')[0];
		} else if ($(this).val()) {
			getCoursesByQuery($(this).val());
		} else {
			$('.course-results').empty();
		}
	});
	$('.search input').on('focus', function() {
		$('.course.selected').removeClass('selected');
	});
}

function getCoursesByQuery(query) {
	var start = new Date();
	query = query.toUpperCase().replaceAll(' ', '');
	var re = /([A-Za-z]+)\s*([0-9]*)/;
	var result = query.match(re);
	if (result && result[0]) {
		if (!result[1]) return;
		// subject only
		else if (!result[2]) {
			var queriedSubject = result[1];
			var len = queriedSubject.length;
			if (subjectCache[queriedSubject]){
			} else if (len > 1 && subjectCache[queriedSubject.substring(0, len-1)]) {
				var results = {};
				for (var subject in subjectCache[queriedSubject.substring(0, len-1)]) {
					if (subject.startWith(queriedSubject)) {
						results[subject] = courses[subject];
					}
				}
				subjectCache[queriedSubject] = results;
			} else {
				var results = {};
				for (var subject in courses) {
					if (subject.startWith(queriedSubject)) {
						results[subject] = courses[subject];
					}
				} 
				subjectCache[queriedSubject] = results;
			}
			$('.course').remove();
			loadCourses(subjectCache[queriedSubject], 5);
		} else {
			var queriedSubject = result[1];
			var queriedNumber = result[2];
		}
		var end = new Date();
		console.log('Search completed in ' + (end.getTime() - start.getTime()) + ' ms for query ' + query);
	} else if (query === '') {
		$('.course').remove();
	}
};

function addArrowKeyListener() {
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
			$('.course-results').empty(); 
			if (href.indexOf('#') !== -1) {
				var subject = href.split('#')[1].split('-')[0];
				var number = href.split('#')[1].split('-')[1];
				showCourse(subject, number);
				$('#' + subject + number + ' .icon').css('background-image', getIconUrl(subject));
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


// utils

String.prototype.startWith = function (str) {
	var re = new RegExp('^' + str);
	return re.test(this);
}

function getIconUrl (filename) {
	return 'url("img/course-icons/' + filename + '.svg")';
}
String.prototype.trunc = function (n) {
	return this.substr(0,n-1)+(this.length>n?'&hellip;':'');
};

String.prototype.replaceAll = function (find, replace) {
	return this.replace(new RegExp(find, 'g'), replace);
}