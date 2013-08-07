var BACKEND = (function (object) {
	var courseIndex;
	var subjectIndex;
	loadCourses();
	loadSubjectIndex();

	//{subjectprefix:{subject:{courses}}}
	var subjectCache = {};
	//{subject:{numberprefix:{courses}}}
	var courseCaches = {};

	function getCoursesByQuery (query, callback) {
		query = query.toUpperCase();
		var queries = query.match(/([A-Z]+)(\s*)(.*)/);
		if(!queries || !queries[0]) return null;
		var subject = queries[1];
		var foundWhitespace = queries[2];
		var number = queries[3];
		var resultMap = findOrCacheSubjects(subject, foundWhitespace || number);
		if(number || Object.size(resultMap) == 1) {
			resultMap = findOrCacheCourses(resultMap, number);
		}

		callback(resultMap);
	}

	function findOrCacheSubjects (subject, exactMatch) {
		if(exactMatch) {
			var result = {};
			result[subject] = courseIndex[subject];
			return result;
		}

		if(!subject || subject.length == 0) {
			return courseIndex;
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
			//Create new otherwise
			if(!subjectCache[subject]) {
				subjectCache[subject] = subset(courseIndex, subject);
			}
		}

		return subjectCache[subject];
	}

	function findOrCacheCourses (subjectMap, number) {
		var results = {};

		for (var key in subjectMap) {
			//{numberprefix:{courses}}
			var courseList = courseCaches[key];
			var cachedCourseList;
			//Cache found for subject
			if(courseList) {
				var length = number.length;
				cachedCourseList = courseList[number];
				//Cached search
				if(!cachedCourseList){
					if(length > 1) {
						var cached = courseList[number.substring(0, length - 1)];
						if(cached) {
							cachedCourseList = subset(cached, number);
							courseList[number] = cachedCourseList;
						}
					}
				}
			}
			//Create cache for subject
			else {
				courseList = {};
				courseCaches[key] = courseList;
			}

			//Do a full search if not cached or from a cached search
			if(!cachedCourseList) {
				cachedCourseList = subset(subjectMap[key], number);
				courseList[number] = cachedCourseList;
			}

			results[key] = cachedCourseList;
		}

		return results;
	}

	function getCourse (subject, number, callback) {
		$.ajax({
			url: "get.php?course&subject=" + subject + "&number=" + number,
			dataType: "json",
			success: function (data) {
				callback(data);
			}
		})
	};

	function loadSubjectIndex () {
		$.ajax({
			url: "get.php?subjects",
			dataType: "json",
			async: false,
			success: function (data) {
				subjectIndex = data;
				object.departments = subjectIndex["departments"];
				object.subjects = subjectIndex["subjects"];
			}
		});
	}

	function loadCourses () {
		$.ajax({
			url: "get.php?index",
			dataType: "json",
			async: false,
			success: function (data) {
				courseIndex = data;
				object.courseIndex = courseIndex;
			}
		});
	};

	object.getCoursesByQuery = getCoursesByQuery;
	object.getCourse = getCourse;

	return object;
}(BACKEND || {}));
