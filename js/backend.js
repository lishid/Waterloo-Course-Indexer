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
    var re = /([A-Za-z]+)\s*(.*)/;
    var queries = query.match(re);
    var courseCount = 0, subjectCount = 0;
    var finalResults = {};
    if (queries && queries[0]) {
        if (!queries[1]) return;
        // subject is specified
        else {
            var queriedSubject = queries[1];
            var len = queriedSubject.length;
            if (!subjectCache[queriedSubject] && len > 1 && subjectCache[queriedSubject.substring(0, len-1)]) {
                var cachedDic = subjectCache[queriedSubject.substring(0, len-1)];
                subjectCache[queriedSubject] = queryInDic(queriedSubject, cachedDic);
            } else {
                subjectCache[queriedSubject] = queryInDic(queriedSubject, courses);
            }
            // if number is specified
            if (queries[2]) {
                var queriedNumber = queries[2];
                var query = queriedSubject + queriedNumber.toString();
                var len = query.length;
                var results = {};
                // if prefix is in cache
                if (!courseCache[query] && len > 1 && courseCache[query.substring(0, len-1)]) {
                    var cachedDic = courseCache[query.substring(0, len-1)];
                    results = queryInDic(queriedNumber, cachedDic);
                } else {
                    var coursesUnderSubject = subjectCache[queriedSubject][queriedSubject];
                    results = queryInDic(queriedNumber, coursesUnderSubject);
                }
                courseCache[query] = results;
                finalResults[queriedSubject] = results;
            } else {
                finalResults = subjectCache[queriedSubject];
            }
            loadCourses(finalResults, 5);
        }
        var end = new Date();
        console.log('Search completed in ' + (end.getTime() - start.getTime()) + ' ms for query ' + query);
    }
};


// utils
function queryInDic (query, dic) {
    var results = {};
    for (var key in dic) {
        if (key.startWith(query)) {
            results[key] = dic[key];
        }
    }
    return results;
}

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