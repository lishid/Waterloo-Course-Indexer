// params
var DESC_LENGTH = 200;
var COURSES_SHOWN = 5;

var courseCodes = ["AFM", "ACTSC", "ANTH", "AHS", "APPLS", "AMATH", "ARCH", "ARTS", "ARBUS", "AVIA", "BIOL", "BUS", "BET", "CHE", "CHEM", "CHINA", "CMW", "CIVE", "CLAS", "CO", "COMM", "CS", "COOP", "CROAT", "DAC", "DRAMA", "DUTCH", "EARTH", "EASIA", "ECON", "ECE", "ENGL", "ESL", "EFAS", "ENBUS", "ERS", "ENVE", "ENVS", "FINE", "FR", "GENE", "GEOG", "GEOE", "GER", "GERON", "GBDA", "GRK", "HLTH", "HIST", "HRM", "HUMSC", "IS", "INDEV", "INTST", "INTTS", "ITAL", "ITALST", "JAPAN", "JS", "KIN", "INTEG", "KOREA", "LAT", "LS", "MATBUS", "MSCI", "MNS", "MATH", "MTHEL", "ME", "MTE", "MEDVL", "MUSIC", "NE", "NATST", "OPTOM", "PACS", "PHARM", "PHIL", "PHYS", "PLAN", "POLSH", "PSCI", "PORT", "PD", "PDPHRM", "PSYCH", "PMATH", "REC", "RS", "RUSS", "REES", "SCI", "SCBUS", "SMF", "SDS", "SOCWK", "SWREN", "STV", "SOC", "SE", "SPAN", "SPCOM", "STAT", "SI", "SYDE", "UNIV", "VCULT", "WS", "WKRPT"];

var facultyToSubjectMap = {
    'AHS': [ 'AHS', 'GERON', 'HLTH', 'KIN', 'REC' ],
    'ART': [ 'AFM', 'ANTH', 'APPLS', 'ARTS', 'ARBUS', 'BUS', 'CHINA', 'CMW', 'CLAS', 'CROAT', 'DAC', 'DRAMA', 'DUTCH', 'EASIA', 'ECON', 'ENGL', 'ESL', 'EFAS', 'FINE', 'FR', 'GER', 'GBDA', 'GRK', 'HIST', 'HRM', 'HUMSC', 'IS', 'INTST', 'INTTS', 'ITAL', 'ITALST', 'JAPAN', 'JS', 'KOREA', 'LAT', 'LS', 'MEDVL', 'MUSIC', 'NATST', 'PACS', 'PHIL', 'POLSH', 'PSCI', 'PORT', 'PSYCH', 'RS', 'RUSS', 'REES', 'SDS', 'SMF', 'SOCWK', 'SOC', 'SPAN', 'SPCOM', 'SI', 'STV', 'SWREN', 'VCULT', 'WS' ],
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


function getCoursesByQuery(query) {
    var start = new Date();
    query = query.toUpperCase().replaceAll(' ', '');
    var re = /([A-Za-z]+)\s*([0-9]*)/;
    var result = query.match(re);
    var courseCount = 0, subjectCount = 0;
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
            for (var subject in subjectCache[queriedSubject]) {
                for (var number in subjectCache[queriedSubject][subject]) {
                    courseCount++;
                }
                subjectCount++;
            }
            showSearchResult(courseCount, subjectCount);
            loadCourses(subjectCache[queriedSubject], 5);
        } else {
            var queriedSubject = result[1];
            var queriedNumber = result[2];
        }
        var end = new Date();
        console.log('Search completed in ' + (end.getTime() - start.getTime()) + ' ms for query ' + query);
    }
};

// utils
String.prototype.startWith = function (str) {
    var re = new RegExp('^' + str);
    return re.test(this);
}
String.prototype.trunc = function (n) {
    return this.substr(0,n-1)+(this.length>n?'&hellip;':'');
};

String.prototype.replaceAll = function (find, replace) {
    return this.replace(new RegExp(find, 'g'), replace);
}