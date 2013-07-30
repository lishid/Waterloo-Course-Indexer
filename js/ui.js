var DESC_LENGTH = 200;
var COURSES_SHOWN = 5;


var facultyToSubjectMap = {
    'AHS': [ 'AHS', 'GERON', 'HLTH', 'KIN', 'REC' ],
    'ART': [ 'AFM', 'ANTH', 'APPLS', 'ARTS', 'ARBUS', 'BUS', 'CHINA', 'CMW', 'CLAS', 'CROAT', 'DAC', 'DRAMA', 'DUTCH', 'EASIA', 'ECON', 'ENGL', 'ESL', 'EFAS', 'FINE', 'FR', 'GER', 'GBDA', 'GRK', 'HIST', 'HRM', 'HUMSC', 'IS', 'INTST', 'INTTS', 'ITAL', 'ITALST', 'JAPAN', 'JS', 'MEDVL', 'MUSIC', 'NATST', 'PACS', 'PHIL', 'POLSH', 'PSCI', 'PORT', 'PSYCH', 'RS', 'RUSS', 'RESS', 'SMF', 'SOCWK', 'SOC', 'SPAN', 'SPCOM', 'SI', 'STV', 'VCULT', 'WS' ],
    'ENG': [ 'ARCH', 'BET', 'CHE', 'CIVE', 'ECE', 'ENVE', 'GENE', 'GEOE', 'MSCI', 'ME', 'MTE', 'NE', 'SE', 'SYDE' ],
    'ENV': [ 'ENBUS', 'ERS', 'ENVS', 'GEOG', 'INDEV', 'INTEG', 'PLAN' ],
    'MAT': [ 'ACTSC', 'AMATH', 'CO', 'COMM', 'CS', 'MATBUS', 'MATH', 'MTHEL', 'PMATH', 'STAT' ],
    'SCI': [ 'BIOL', 'CHEM', 'EARTH', 'MNS', 'OPTOM', 'PHARM', 'PHYS', 'PDPHRM', 'SCI', 'SCBUS' ],
    'OTHER': [ 'AVIA', 'COOP', 'PD', 'UNIV' ]
};

var subjectToFacultyMap = {};

for (var faculty in facultyToSubjectMap) {
    for (var i in facultyToSubjectMap[faculty])
        subjectToFacultyMap[facultyToSubjectMap[faculty][i]] = faculty;
}

var langMap = {
    'CROAT': 'HR',
    'DUTCH': 'NL',
    'EFAS': 'EN',
    'ENGL': 'EN',
    'ESL': 'EN',
    'FR': 'FR',
    'GRK': 'EL',
    'ITAL': 'IT',
    'KOREA': 'KO',
    'POLSH': 'PL',
    'PORT': 'PT',
    'RUSS': 'RU',
    'SPAN': 'ES'
};

var noIcon = {
    'ITALST': 'generic'
}

for (var lang in langMap) {
    noIcon[lang] = 'lang';
}
function loadCourses () {
    for (var subject in courses) {
        for (var number in courses[subject]) {
            loadCourse(subject, number)
        }
    }
    $('.details').hide();
    $('.course').each(function () {
        var id = $(this).attr('id');
        var subject = $(this).data('subject');
        var number = $(this).data('number');
        $('#' + id + ' .icon').css('background-image', decideIconFileName(subject));
        $(this).click(function () {
            window.location.href = window.location.href.split('#')[0] + '#' + subject + '-' + number;
        });
    });
    if($('.course:visible').length > COURSES_SHOWN) {
        $('.course:visible:gt(' + (COURSES_SHOWN - 1) + ')').hide();
    }
}

function loadCourse (subject, number) {
    var course = courses[subject][number];
    if (course.subject != null && course.number != null) {
        var container = $('<div>').data('subject', subject).data('number', number);
        HTML = '<div class="course ' + subjectToFacultyMap[subject] + '" id="' + subject + number + '" data-subject="'+ subject +'" data-number="' + number + '">';
        HTML += '<div class="header"><div class="icon-wrapper"><div class="icon"></div></div>';
        HTML += '<div class="title"><h2><span class="code">' + subject + " " + number + '</span></h2>';
        HTML += '<h3><span class="name">' + (course.title != null ? course.title.trunc(50) : '') + '</span></h3></div></div>';
        HTML += '<div class="details"></div></div>';
        $('.course-results').append(HTML);
    }
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
        HTML += '<p>' + course.description.trunc(DESC_LENGTH) + '</p>';

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
    $('.search input').keyup(function (e) {
        if (e.keyCode !== 13) {
        var query = $(this).val().replaceAll(' ', '');
            if (window.location.href.indexOf('#') !== -1) {
                $('.course').remove();
                loadCourses();
            }
            filter(query);
        } else {
            var target = $('.course:visible').first();
            showCourse(target.attr('id'));
        }
    });
}

$(document).ready(function () {
    if (history && history.pushState) {
       history.pushState(null, document.title, this.href);
    }
    $("body").addClass("historyPushed");
    window.addEventListener('popstate', function(event) {
        if($("body").hasClass("historyPushed")) {
            var href = window.location.href;
            $('.course-results').empty(); 
            if (href.indexOf('#') !== -1) {
                var subject = href.split('#')[1].split('-')[0];
                var number = href.split('#')[1].split('-')[1];
                showCourse(subject, number);
                $('#' + subject + number + ' .icon').css('background-image', decideIconFileName(subject));
            } else {  
                loadCourses();
                $('.subject').each(function () {
                    $(this).click(function () {
                        var id = $(this).attr('id');
                        $('.search input').val(id + ' ').focus();
                        $('.subject').hide();
                    });
                });
            }
            enableSearch();
        }
    });
});

function decideIconFileName (subject) {
    if (typeof noIcon[subject] === 'undefined') fileName = subject;
    else if (noIcon[subject] === 'generic') fileName = 'generic';
    else if (noIcon[subject] === 'lang') fileName = langMap[subject];
    return 'url("img/course-icons/' + fileName + '.svg")';
}


// utils
String.prototype.trunc = function (n) {
    return this.substr(0,n-1)+(this.length>n?'&hellip;':'');
};

String.prototype.replaceAll = function (find, replace) {
    return this.replace(new RegExp(find, 'g'), replace);
}