// Prototype extensions

String.prototype.startWith = function (str) {
	return this.indexOf(str) === 0;
}

String.prototype.trunc = function (n) {
	return this.substr(0,n-1)+(this.length>n?'&hellip;':'');
}

String.prototype.replaceAll = function (find, replace) {
	return this.replace(new RegExp(find, 'g'), replace);
}

String.prototype.toTitleCase = function (){
	return this.replace(/\w\S*/g, function(txt)
		{
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
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


// Util functions

function subset(map, prefix) {
	var results = {};
	for (var key in map) {
		if (key.startWith(prefix)) {
			results[key] = map[key];
		}
	}
	return results;
}

function sortedEach(object, func) {
	var keys = [];
	for(var key in object) {
		keys.push(key);
	}
	for (var i = 0; i < keys.length; i++) {
		if(func(keys[i], i)) {
			return;
		}
	}
}

function safeAjax(params, callback, retryTimeout, retryTimes) {
	// Verify our numbers
	if(!retryTimeout || isNaN(retryTimeout)) {
		retryTimeout = 50;
	}
	if(!retryTimes || isNaN(retryTimes)) {
		retryTimes = 10;
	}

	// The recursive call
	function ajaxCall() {
		$.ajax(params);
	}

	// Set the callbacks
	params.success = function (data) {
		callback(data);
	}
	params.error = function (data) {
		if(retryTimes > 0) {
			retryTimes--;
			setTimeout(ajaxCall, retryTimeout);
		}
	}

	// Start the call
	ajaxCall();
}

function getDataURI (mime, data) {
	return "data:" + mime + ";charset=UTF-8," + encodeURIComponent(data);
}

function withinDistanceFromPageBottom (distanceInPixel) {
	return ($(window).scrollTop() + $(window).height() > $(document).height() - distanceInPixel);
}