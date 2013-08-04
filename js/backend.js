// params
var DESC_LENGTH = 200;
var COURSES_SHOWN = 5;

var subjectTitles = {
	'AFM': 'Accounting & Financial Management', 
	'ACTSC': 'Actuarial Science', 
	'ANTH': 'Anthropology', 
	'AHS': 'Applied Health Sciences', 
	'APPLS': 'Applied Language Studies', 
	'AMATH': 'Applied Mathematics', 
	'ARCH': 'Architecture', 
	'ARTS': 'Arts', 
	'ARBUS': 'Arts and Business', 
	'AVIA': 'Aviation', 
	'BIOL': 'Biology', 
	'BUS': 'Business (Wilfrid Laurier University)', 
	'BET': 'Business, Entrepreneurship and Technology', 
	'CHE': 'Chemical Engineering', 
	'CHEM': 'Chemistry', 
	'CHINA': 'Chinese', 
	'CMW': 'Church Music and Worship', 
	'CIVE': 'Civil Engineering', 
	'CLAS': 'Classical Studies', 
	'CO': 'Combinatorics and Optimization', 
	'COMM': 'Commerce ', 
	'CS': 'Computer Science', 
	'COOP': 'Co-operative Work Term', 
	'CROAT': 'Croatian', 
	'DAC': 'Digital Arts Communication', 
	'DRAMA': 'Drama', 
	'DUTCH': 'Dutch', 
	'EARTH': 'Earth Sciences', 
	'EASIA': 'East Asian', 
	'ECON': 'Economics', 
	'ECE': 'Electrical and Computer Engineering', 
	'ENGL': 'English', 
	'ESL': 'English as a Second Languag', 
	'EFAS': 'English for Academic Success', 
	'ENBUS': 'Environment and Business', 
	'ERS': 'Environment and Resource Studies', 
	'ENVE': 'Environmental Engineering', 
	'ENVS': 'Environmental Studies', 
	'FINE': 'Fine Arts', 
	'FR': 'French', 
	'GENE': 'General Engineering', 
	'GEOG': 'Geography and Environmental Management', 
	'GEOE': 'Geological Engineering', 
	'GER': 'German', 
	'GERON': 'Gerontology', 
	'GBDA': 'Global Business and Digital Arts', 
	'GRK': 'Greek', 
	'HLTH': 'Health Studies', 
	'HIST': 'History', 
	'HRM': 'Human Resources Management', 
	'HUMSC': 'Human Sciences', 
	'IS': 'Independent Studies', 
	'INDEV': 'International Development', 
	'INTST': 'International Studies', 
	'INTTS': 'International Trade', 
	'ITAL': 'Italian', 
	'ITALST': 'Italian Studies', 
	'JAPAN': 'Japanese', 
	'JS': 'Jewish Studies', 
	'KIN': 'Kinesiology', 
	'INTEG': 'Knowledge Integration', 
	'KOREA': 'Korean', 
	'LAT': 'Latin', 
	'LS': 'Legal Studies', 
	'MATBUS': 'Mathematical Business', 
	'MSCI': 'Management Sciences', 
	'MNS': 'Materials and Nano-Sciences', 
	'MATH': 'Mathematics', 
	'MTHEL': 'Mathematics Electives', 
	'ME': 'Mechanical Engineering', 
	'MTE': 'Mechatronics Engineering', 
	'MEDVL': 'Medieval Studies', 
	'MUSIC': 'Music', 
	'NE': 'Nanotechnology Engineering', 
	'NATST': 'Native Studies', 
	'OPTOM': 'Optometry', 
	'PACS': 'Peace and Conflict Studies', 
	'PHARM': 'Pharmacy', 
	'PHIL': 'Philosophy', 
	'PHYS': 'Physics', 
	'PLAN': 'Planning', 
	'POLSH': 'Polish', 
	'PSCI': 'Political Science', 
	'PORT': 'Portuguese', 
	'PD': 'Professional Development', 
	'PDPHRM': 'Professional Development for Pharmacy Students', 
	'PSYCH': 'Psychology', 
	'PMATH': 'Pure Mathematics', 
	'REC': 'Recreation and Leisure Studies', 
	'RS': 'Religious Studies', 
	'RUSS': 'Russian', 
	'REES': 'Russian and East European Studies', 
	'SCI': 'Science', 
	'SCBUS': 'Science and Business', 
	'SMF': 'Sexuality, Marriage, and Family Studies', 
	'SDS': 'Social Development Studies', 
	'SOCWK': 'Social Work (Social Development Studies)', 
	'SWREN': 'Social Work (Bachelor of Social Work)', 
	'STV': 'Society, Technology and Values', 
	'SOC': 'Sociology', 
	'SE': 'Software Engineering', 
	'SPAN': 'Spanish', 
	'SPCOM': 'Speech Communication', 
	'STAT': 'Statistics', 
	'SI': 'Studies in Islam', 
	'SYDE': 'Systems Design Engineering', 
	'UNIV': 'University', 
	'VCULT': 'Visual Culture', 
	'WS': 'Women\'s Studies', 
	'WKRPT': 'Work-term Report'
};

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

// {subjectprefix:{subject:{courses}}}
var subjectCache = {};
// {subject:{numberprefix:{courses}}}
var courseCaches = {};

function getCoursesByQuery(query, callback) {
	var start = new Date();
	query = query.toUpperCase();
	var queries = query.match(/([A-Z]+)(\s*)(.*)/);
	if(!queries || !queries[0]) return null;
	var subject = queries[1];
	var foundWhitespace = queries[2];
	var number = queries[3];
	var resultMap = findOrCacheSubject(subject, foundWhitespace || number);
	if(number || objectKeyLength(resultMap) == 1) {
		resultMap = findOrCacheCourses(resultMap, number);
	}

	callback(resultMap);

	console.log('Search completed in ' + ((new Date()).getTime() - start.getTime()) + ' ms for query ' + query);
}

function findOrCacheSubject(subject, exactMatch) {
	if(exactMatch) {
		var result = {};
		result[subject] = courses[subject];
		return result;
	}

	if(!subject || subject.length == 0) {
		return courses;
	}

	var length = subject.length;
	if(!subjectCache[subject]){
		//From prev cached
		if(length > 1) {
			var cached = subjectCache[subject.substring(0, length - 1)];
			if(cached) {
				subjectCache[subject] = subset(cached, subject);
			}
		}
		//Create new
		if(!subjectCache[subject]) {
			subjectCache[subject] = subset(courses, subject);
		}
	}

	return subjectCache[subject];
}

function findOrCacheCourses(subjectMap, number) {
	var results = {};

	for (var key in subjectMap) {
		var courseList = courseCaches[key];
		if(courseList) {
			var length = number.length;
			if(!courseList[number]){
				//From prev cached
				if(length > 1) {
					var cached = courseList[number.substring(0, length - 1)];
					if(cached) {
						courseList[number] = subset(cached, number);
					}
				}
			}
		}
		else {
			courseList = {};
			courseCaches[key] = courseList;
		}

		//Create new
		if(!courseList[number]) {
			courseList[number] = subset(subjectMap[key], number);
		}

		results[key] = courseList[number];
	}

	return results;
}

function fetchCourse(subject, number, callback) {
	$.ajax({
		url: 'get?course&subject=' + subject + '&number=' + number,
		dataType: 'json',
		success: function (data) {
			callback(data);
		}
	})
};

var courses;
//loadCourses();

function loadCourses() {
	$.ajax({
		url: 'get?index',
		dataType: 'json',
		success: function (data) {
			courses = data;
		}
	})
};