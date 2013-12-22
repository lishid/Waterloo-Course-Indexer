var subjectToIconMap = {
    "AFM": "money", "ACTSC": "bar-chart", "ANTH": "man-woman", "AHS": "dropper", "APPLS": "japanese", "AMATH": "calculator", "ARCH": "tower", "ARTS": "pen", "ARBUS": "business-person", "AVIA": "airplane", "BIOL": "microscope", "BUS": "business-person", "BET": "idea", "CHE": "fire", "CHEM": "beaker", "CHINA": "chinese", "CMW": "church", "CIVE": "road", "CLAS": "ankh", "CO": "puzzle", "COMM": "money", "CS": "console", "COOP": "work", "CROAT": "translation", "DAC": "film", "DRAMA": "mask", "DUTCH": "translation", "EARTH": "earth", "EASIA": "china-map", "ECON": "line-chart", "ECE": "chip", "ENGL": "pen", "ESL": "translation", "ENBUS": "recycle", "ERS": "recycle", "ENVE": "recycle", "ENVS": "recycle", "FINE": "palette", "FR": "translation", "GENE": "hard-hat", "GEOG": "globe", "GEOE": "mountain", "GER": "translation", "GERON": "aging", "GBDA": "film", "GRK": "translation", "HLTH": "first-aid", "HRM": "people", "HUMSC": "man-woman", "INDEV": "earth", "INTST": "earth", "INTTS": "earth", "ITAL": "translation", "JAPAN": "japanese", "JS": "jewish", "KIN": "run", "KOREA": "translation", "LAT": "translation", "LS": "gavel", "MATBUS": "business-person", "MSCI": "organize", "MNS": "atom", "MATH": "calculator", "MTHEL": "calculator", "ME": "gear", "MTE": "gear", "MEDVL": "ankh", "MUSIC": "music", "NE": "atom", "NATST": "native", "OPTOM": "eye", "PACS": "peace", "PHARM": "pill", "PHIL": "thinking", "PHYS": "atom", "PLAN": "plan", "POLSH": "translation", "PSCI": "congress", "PORT": "translation", "PD": "wtf", "PDPHRM": "wtf", "PSYCH": "brain", "PMATH": "infinity", "REC": "island", "RS": "church", "RUSS": "translation", "SCI": "magnet", "SCBUS": "magnet", "SMF": "man-woman", "SDS": "network", "SOCWK": "network", "SWREN": "network", "STV": "network",  "SOC": "network", "SE": "console", "SPAN": "translation", "SPCOM": "speech", "STAT": "bar-chart", "SI": "islam", "SYDE": "rocket", "UNIV": "goose", "VCULT": "film", "WS": "female", "WKRPT": "wtf"
};

var notesData = {
    "Chris Thomson": {
        useFormat: true,
        source: "http://cthomson.ca/notes",
        format: function (course) { 
            return "http://notes.cthomson.ca/dl/latest/" + course.toLowerCase() + ".pdf";
        },
        courses: [ "CS360", "CS240", "CS241", "MATH239", "PSYCH207" ]
    },
    "Liam Horne": {
        useFormat: true,
        source: "http://lihorne.wordpress.com/resources/",
        format: function (course) {
            return "https://csclub.uwaterloo.ca/~lihorne/" + course.toLowerCase() + "coursenotes.pdf";
        },
        courses: [ "MATH237", "MATH239", "CS245", "CS246", "STAT230" ]
    },
    "Tim Pei": {
        useFormat: false,
        source: "https://csclub.uwaterloo.ca/~y5pei/",
        urls: {
            "MATH239": "http://csclub.uwaterloo.ca/~y5pei/projects/notes/Year%202B/Math%20239.htm",
            "CO250": "http://csclub.uwaterloo.ca/~y5pei/projects/notes/Year%202B/CO%20250.htm",
            "CS240": "http://csclub.uwaterloo.ca/~y5pei/projects/notes/Year%202B/CS%20240.htm",
            "MATH136": "http://csclub.uwaterloo.ca/~y5pei/projects/previous-notes/Year%201B/MATH%20136.htm",
            "MATH138": "http://csclub.uwaterloo.ca/~y5pei/projects/previous-notes/Year%201B/MATH%20138.htm",
            "STAT230": "http://csclub.uwaterloo.ca/~y5pei/projects/previous-notes/Year%201B/STAT%20230.htm",
            "ECON140": "http://csclub.uwaterloo.ca/~y5pei/projects/previous-notes/Year%201B/ECON%20140.htm"
        }
    },
    "Anthony Zhang": {
        useFormat: true,
        source: "http://uberi.github.io/University-Notes/",
        format: function (course) {
            return "http://uberi.github.io/University-Notes/" + course + "/" + course + ".html";
        },
        courses: [ "MATH135", "MATH137", "PHIL110A", "ECON101", "CS135" ]
    },
    "Janis Lazovskis": {
        useFormat: false,
        source: "http://www.jlazovskis.com/en/cours.html",
        urls: {
            "MATH145": "http://www.jlazovskis.com/docs-ugrad/m145.pdf",
            "MATH146": "http://www.jlazovskis.com/docs-ugrad/m146.pdf",
            "MATH245": "http://www.jlazovskis.com/docs-ugrad/m245.pdf",
            "MATH247": "http://www.jlazovskis.com/docs-ugrad/m247.pdf",
            "MATH249": "http://www.jlazovskis.com/docs-ugrad/m249.pdf",
            "PMATH345": "http://www.jlazovskis.com/docs-ugrad/pm345.pdf",
            "PMATH346": "http://www.jlazovskis.com/docs-ugrad/pm346.pdf",
            "PMATH351": "http://www.jlazovskis.com/docs-ugrad/pm351.pdf",
            "PMATH352": "http://www.jlazovskis.com/docs-ugrad/pm352.pdf",
            "PMATH365": "http://www.jlazovskis.com/docs-ugrad/pm365.pdf",
            "PMATH432": "http://www.jlazovskis.com/docs-ugrad/pm432.pdf",
            "PMATH450": "http://www.jlazovskis.com/docs-ugrad/pm450.pdf",
            "PMATH467": "http://www.jlazovskis.com/docs-ugrad/pm467.pdf",
            "PMATH665": "http://www.jlazovskis.com/docs-mgrad/pm665.pdf",
            "PMATH745": "http://www.jlazovskis.com/docs-mgrad/pm745.pdf",
            "PMATH955": "http://www.jlazovskis.com/docs-mgrad/pm955.pdf"
        }
    },
    "Sampson Chen": {
        useFormat: false,
        source: "http://sampsonchen.com/",
        urls: {
            "SMF204": "https://docs.google.com/document/d/1Y8pLt4K0TdwKYBY5I2t-LcjqK7v3nLx1if9Wfn06jXM/edit",
            "ENGL109": "http://sampsonchen.com/2013/01/22/engl-109-lecture-notes-uwaterloo-winter-2013/",
            "PHIL215": "http://sampsonchen.com/2012/09/13/phil-215-lecture-notes-uwaterloo-fall-2012-professor-brian-orend/"
        }
    }
};

// Spinner options
var mainSpinnerOption = {
    lines: 11, length: 14, width: 5, radius: 21, corners: 1, rotate: 0, direction: 1, color: "#222", speed: 1, trail: 42, shadow: false, hwaccel: false, className: "spinner", zIndex: 2e9, top: "100", left: "auto"
};
var courseSpinnerOption = $.extend({}, mainSpinnerOption);
courseSpinnerOption.top = "250";
var expandedSpinnerOption = {
    lines: 11, length: 9, width: 3, radius: 15, corners: 1, rotate: 0, direction: 1, color: "#222", speed: 1, trail: 42, shadow: false, hwaccel: false, className: "spinner", zIndex: 2e9, top: "15", left: "auto"
};

// Tweakable params
var COURSE_LIMIT = 5;  // how many courses are loaded initially
var COURSE_BATCH_SIZE = 5;  // how many more courses are loaded when page end is reached
var BACK_TO_TOP_THRESHOLD = 300;  // "back to top" button will appear after page is scrolled down this far
var LOAD_MORE_THRESHOLD = 100;  // scrolling beyond this distance to page end loads more courses if present

// State enum
var pageState = {
    MAIN_SEARCH: 0,
    COURSE_DETAILS: 1
}