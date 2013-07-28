var courseCodes = ["AFM", "ACTSC", "ANTH", "AHS", "APPLS", "AMATH", "ARCH", "ARTS", "ARBUS", "AVIA", "BIOL", "BUS", "BET", "CHE", "CHEM", "CHINA", "CMW", "CIVE", "CLAS", "CO", "COMM", "CS", "COOP", "CROAT", "DAC", "DRAMA", "DUTCH", "EARTH", "EASIA", "ECON", "ECE", "ENGL", "ESL", "EFAS", "ENBUS", "ERS", "ENVE", "ENVS", "FINE", "FR", "GENE", "GEOG", "GEOE", "GER", "GERON", "GBDA", "GRK", "HLTH", "HIST", "HRM", "HUMSC", "IS", "INDEV", "INTST", "INTTS", "ITAL", "ITALST", "JAPAN", "JS", "KIN", "INTEG", "KOREA", "LAT", "LS", "MATBUS", "MSCI", "MNS", "MATH", "MTHEL", "ME", "MTE", "MEDVL", "MUSIC", "NE", "NATST", "OPTOM", "PACS", "PHARM", "PHIL", "PHYS", "PLAN", "POLSH", "PSCI", "PORT", "PD", "PDPHRM", "PSYCH", "PMATH", "REC", "RS", "RUSS", "REES", "SCI", "SCBUS", "SMF", "SDS", "SOCWK", "SWREN", "STV", "SOC", "SE", "SPAN", "SPCOM", "STAT", "SI", "SYDE", "UNIV", "VCULT", "WS", "WKRPT"];
var courseNotes = {};
var courses = {};
var code = 0;
// fetchCourses();
function fetchCourses() {
    $.ajax({
        url: getCoursePage(courseCodes[code])
    }).done(function(data) {
        parsePage(courseCodes[code], data);
        code++;
        if(code < courseCodes.length) {
            fetchCourses();
        }
    });
}

function proxyLink(link) {
    return "/get?url=" + encodeURIComponent(link);
}

function getCoursePage(code) {
    return proxyLink("http://ugradcalendar.uwaterloo.ca/courses.aspx?Code=" + code);
}

function parsePage(code, data) {
    data = $(data);
    data = $("<div />").append(data);
    // window.test = data;
    var notes = data.children("ol").children("li");
    var list = data.children("center");
    parseNotes(code, notes);
    parseCourseList(code, list);
}

function parseNotes(code, notes){
    var courseNoteList = courseNotes[code] || [];
    notes.each(function(){
        courseNoteList.push($.trim($(this).html()
            .replace(/(\r\n|\n|\r)/gm,"")
            .replace(/\<(\/i|i|\/em|em)\>/g,"")
            .replace(/\<(\/p|p)\>/g,"<br>")
            .replace(/\<br\>\s*\<br\>/g,"<br>")));
    });
    courseNotes[code] = courseNoteList;
}

var loadedCourses = 0;

function parseCourseList(code, list) {
    var courseList = courses[code] || [];
    list.each(function(){
        var pieces = $(this).find("td");
        var arry = [];
        pieces.each(function() {
            var item = $.trim($(this).html().replace(/\<[^\<\>]+\>/g,""));
            if(item != "") {
                arry.push(item);
            }
        });
        var course = parseCourse(arry);
        courseList.push(course);
        // courseList.push($.trim($(this).html()
        //     .replace(/(\r\n|\n|\r)/gm,"")
        //     .replace(/\<(\/i|i|\/em|em)\>/g,"")
        //     .replace(/\<(\/p|p)\>/g,"<br>")
        //     .replace(/\<br\>\s*\<br\>/g,"<br>")));
    });
    courses[code] = courseList;
    loadedCourses += courseList.length;
    console.log("Loaded " + courseList.length + " courses from " + code + ". Total: " + loadedCourses);
}

function parseCourse(parts) {
    // (*)CS 499T LAB,LEF,TST,TUT,PRJ 0.50
    // (*)Course ID: 000000
    // (*)Title
    // Description
    // (+)[Note: note]
    // (+)Department Consent Required
    // (+)Prereq: 
    // (+)Coreq: 
    // (+)Antireq: 
    // (+)(Cross-listed with )
    // (-)offered
    var course = {
        "courseCode" : parts[0],
        "courseId" : parts[1],
        "courseTitle" : parts[2],
        "note" : findInArray(parts, 3, parts.length - 1, "[Note: "),
        "deptConsent" : findInArray(parts, 3, parts.length - 1, "Department Consent"),
        "prereq" : findInArray(parts, 3, parts.length - 1, "Prereq:"),
        "coreq" : findInArray(parts, 3, parts.length - 1, "Coreq:"),
        "antireq" : findInArray(parts, 3, parts.length - 1, "Antireq:"),
        "crossListed" : findInArray(parts, 3, parts.length - 1, "(Cross-listed"),
        "description" : findInArray(parts, 3, 3, ""),
    };
    return course;
}

function findInArray(array, start, end, prefix) {
    for (var i = end; i >= start; i--) {
        if(array[i].indexOf(prefix) == 0) {
            var value = array[i];
            array[i] = "";
            return value;
        }
    };
    return "";
}
});