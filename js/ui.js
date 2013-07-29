var DESC_MAX_LENGTH = 200;

var courses = {
    'CS135': {
        id: '012040',
        code: 'CS 135',
        title: 'Designing Functional Programs',
        description: 'An introduction to the fundamentals of computer science through the application of elementary programming patterns in the functional style of programming. Syntax and semantics of a functional programming language. Tracing via substitution. Design, testing, and documentation. Linear and nonlinear data structures. Recursive data definitions. Abstraction and encapsulation. Generative and structural recursion. Historical context.',
        offered: [ 'F', 'W' ],
        offered_online: false,
        only_offered_online: false,
        restrictions: {
            prereq: [],
            antireq: [ 'CS115', 'CS121', 'CS122', 'CS123', 'CS125', 'CS131', 'CS132', 'CS133', 'CS134', 'CS137', 'CS138', 'CS145', 'CHE121', 'CIVE121', 'ECE150', 'GENE121', 'PHYS139', 'SYDE121' ],
            coreq: []
        }
    },
    'ECON101': {
        id: '004874',
        code: 'ECON 101',
        title: 'Introduction to Microeconomics',
        description: 'This course provides an introduction to microeconomic analysis relevant for understanding the Canadian economy. The behaviour of individual consumers and producers, the determination of market prices for commodities and resources, and the role of government policy in the functioning of the market system are the main topics covered.',
        offered: [ 'F', 'W', 'S' ],
        offered_online: true,
        only_offered_online: false,
        restrictions: {
            prereq: [],
            antireq: [],
            coreq: []
        }
    },
    'MATH135': {
        id: '006878',
        code: 'MATH 135',
        title: 'Algebra for Honours Mathematics',
        description: 'A study of the basic algebraic systems of mathematics: the integers, the integers modulo n, the rational numbers, the real numbers, the complex numbers and polynomials.',
        offered: [ 'F', 'W', 'S' ],
        offered_online: true,
        only_offered_online: false,
        restrictions: {
            prereq: [ '4U Calculus and Vectors or 4U Geometry and Discrete Mathematics', 'Honours Mathematics or Mathematics/ELAS or Software Engineering students only' ],
            antireq: [ 'MATH145' ],
            coreq: []
        }
    },
    'PHYS121': {
        id: '007393',
        code: 'PHYS 121',
        title: 'Mechanics',
        description: 'An introductory course in physics for students intending to concentrate their future studies in the physical sciences, optometry or mathematics; includes particle kinematics and dynamics, forces in nature, work and energy, conservation of energy and linear momentum, rotational kinematics and dynamics, and conservation of angular momentum.',
        offered: [ 'F', 'W', 'S' ],
        offered_online: true,
        only_offered_online: false,
        restrictions: {
            prereq: [ '4U Calculus and Vectors', '4U Advanced Functions', '4U Physics'],
            antireq: [ 'PHYS111', 'PHYS115', 'ECE105' ],
            coreq: [ { relation: 'or',
                       courses: [ 'MATH104', 'MATH 127', 'MATH137', 'MATH147' ] }
                   ] 
        }
    },
    'PD2': {
        id: '012636',
        code: 'PD 2',
        title: 'Critical Reflection and Report Writing',
        description: 'This course will develop students\' analytical, critical thinking, and report writing skills by focusing on critical reflection and thinking, analysis, and best practices in report writing. This course will lead students through the creation of a report to the co-op guidelines for work-term reports.',
        offered: [ 'F', 'W', 'S' ],
        offered_online: true,
        only_offered_online: true,
        restrictions: {
            prereq: [ 'Co-op students only', 'Not open to Engineering students' ],
            antireq: [ 'PHYS111', 'PHYS115', 'ECE105' ],
            coreq: [ { relation: 'or',
                       courses: [ 'MATH104', 'MATH 127', 'MATH137', 'MATH147' ] }
                   ] 
        }
    }
}

function loadCourses () {
    for (var courseCode in courses) {
        var course = courses[courseCode];
        var HTML = '';
        HTML += '<div class="course" id="' + courseCode + '">';
        HTML += '<div class="header"><div class="icon-wrapper"><div class="icon"></div></div>';
        HTML += '<div class="title"><h2><span class="code">' + course.code + '</span></h2>';
        HTML += '<h3><span class="name">' + course.title + '</span></h3></div></div>';
        HTML += '<div class="details"></div></div>';
        $('.course-results').append(HTML);
    }
};

function showCourse (courseCode) {
    $('.course').each(function () {
        if ($(this).attr('id') !== courseCode) {
            $(this).hide();
        }
    });
    var courseContainer = $('#' + courseCode);
    var course = courses[courseCode];

    courseContainer.off('click');

    var HTML = '<h2>Description</h2>';
    HTML += '<p>' + course.description.trunc(DESC_MAX_LENGTH) + '</p>';

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

    courseContainer.find('.details').empty().append(HTML).show();
    courseContainer.addClass('opened');

    // transformation
    var width = courseContainer.find('.header').width();
    courseContainer.find('.header').width(width + 22);

    var height = $('#' + courseCode).height();
    // $('#' + courseCode).height(height*3);
}; 

$(document).ready(function () {
    loadCourses();
    $('.details').hide();
    $('.course').each(function () {
        var id = $(this).attr('id');
        var department = courses[id].code.split(" ")[0];
        var bgImage = 'url("img/course-icons/' + department + '.svg")';
        $('#' + id + ' .icon').css('background-image', bgImage);
        $(this).click(function () {
            window.location.href = window.location.href.split('#')[0] + '#' + id;
            showCourse(id);
        });
    });
    $('.subject').each(function () {
        $(this).click(function () {
            var id = $(this).attr('id');
            $('.search input').val(id + ' ').focus();
            $('.subject').hide();
        });
    });
});

String.prototype.trunc = function (n) {
    return this.substr(0,n-1)+(this.length>n?'&hellip;':'');
};