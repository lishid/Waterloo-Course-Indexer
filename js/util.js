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

var AssocArray = function (object) {
	this.keys = [];
	for(var key in object) {
		this[key] = object[key];
		this.keys.push(key);
	}
	this.keys.sort(this.keys);
};

AssocArray.prototype.getKeys = function () {
	return this.keys;
};

AssocArray.prototype.each = function (func) {
	for (var i = 0; i < this.keys.length; i++) {
		func(this.keys[i]);
	};
};

function safeAjax(params, callback, retryTimeout, retryTimes) {
	//Verify our numbers
	if(!retryTimeout || isNaN(retryTimeout)) {
		retryTimeout = 50;
	}
	if(!retryTimes || isNaN(retryTimes)) {
		retryTimes = 10;
	}

	//The recursive call
	function ajaxCall() {
		$.ajax(params);
	}

	//Set the callbacks
	params.success = function (data) {
		callback(data);
	}
	params.error = function (data) {
		if(retryTimes > 0) {
			retryTimes--;
			setTimeout(ajaxCall, retryTimeout);
		}
	}

	//Start the call
	ajaxCall();
}