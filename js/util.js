function subset(map, prefix) {
	var results = {};
	for (var key in map) {
		if (key.startWith(prefix)) {
			results[key] = map[key];
		}
	}
	return results;
}

String.prototype.startWith = function (str) {
	return this.indexOf(str) === 0;
}

String.prototype.trunc = function (n) {
	return this.substr(0,n-1)+(this.length>n?'&hellip;':'');
}

String.prototype.replaceAll = function (find, replace) {
	return this.replace(new RegExp(find, 'g'), replace);
}

Object.size = function(object) {
	var count = 0;
	for (var key in object){
		if (object.hasOwnProperty(key)){
			count++;
		}
	}
	return count;
}