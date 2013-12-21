function loadSVGToCSS (svg) {
	var finalCSS = "";
	for(var key in svg) {
		if(key === "generic") {
			finalCSS += ".icon ";
		}
		else {
			finalCSS += ".icon-wrapper .icon-" + key; 
		}
		finalCSS += "{ background-image: url(\"" + getDataURI("image/svg+xml", svg[key]) + "\") }\n";
	}
	loadCSSToPage(finalCSS);
}

var styleTag;
function loadCSSToPage(css) {
	if(!styleTag) {
		styleTag = $("<style type='text/css'></style>");
		$("head").append(styleTag);
	}
	var previous = styleTag.html();
	styleTag.html(previous + "\n" +  css);
}

loadAllCssGradients();

function loadAllCssGradients() {
	loadCSSToPage(generateCssGradient(".course, .note", 0, [100, 0], [90, 0]));
	loadCSSToPage(generateCssGradient(".course .header:hover, .note .header:hover", 0, [94, 0], [90, 0]));
	loadCSSToPage(generateCssGradient(".course .header:active, .note .header:active", 0, [84, 0], [92, 0]));
	loadCssGradientSat("ART", 33, 100, 100, 10, 20, 30, 60);
	loadCssGradientSat("REN", 33, 100, 100, 10, 20, 30, 60);
	loadCssGradientSat("WLU", 33, 100, 100, 10, 20, 30, 60);
	loadCssGradientSat("MAT", 323, 100, 100, 10, 20, 30, 60);
	loadCssGradientRaw("AHS", 184, [90, 10], [90, 35], [90, 30], [85, 60]);
	loadCssGradientSat("ENG", 276, 100, 100, 10, 20, 30, 60);
	loadCssGradientSat("SCI", 206, 100, 100, 10, 20, 30, 60);
	loadCssGradientRaw("ENV", 62, [90, 15], [90, 35], [90, 30], [85, 60]);
	loadCssGradientRaw("VPA", 0, [93, 0], [85, 0], [85, 0], [66, 0]);
}

function loadCssGradientSat(subject, h, v1, v2, s1, s2, s3, s4) {
	loadCssGradientRaw(subject, h, [v1, s1], [v1, s2], [v2, s3], [v2, s4]);
}

function loadCssGradientRaw(subject, h, c1, c2, c3, c4) {
	var css1 = generateCssGradient(cssGradientTitleHeader(subject), h, c1, c2);
	var css2 = generateCssGradient(cssGradientTitleIcon(subject), h, c3, c4);
	loadCSSToPage(css1 + css2);
}

function cssGradientTitleHeader(subject) {
	return title = "." + subject + ".opened .header, ." + subject + ".subject .header";
}

function cssGradientTitleIcon(subject) {
	return title = "." + subject + " .icon-wrapper, ." + subject + " span.offered";
}

function generateCssGradient(title, hue, c1, c2) {
	var color1 = getGradientColorFrom(hue, c1[1], c1[0]);
	var color2 = getGradientColorFrom(hue, c2[1], c2[0]);
	var css = title + " {\n";
	css += "\tbackground: " + color1 + ";\n"; // Old browsers
	css += "\tbackground: -moz-linear-gradient(top,  " + color1 + " 0%, " + color2 + " 100%);\n"; // FF3.6+
	css += "\tbackground: -webkit-gradient(linear, left top, left bottom, color-stop(0%," + color1 + "), color-stop(100%," + color2 + "));\n"; // Chrome,Safari4+
	css += "\tbackground: -webkit-linear-gradient(top,  " + color1 + " 0%," + color2 + " 100%);\n"; // Chrome10+,Safari5.1+
	css += "\tbackground: -o-linear-gradient(top,  " + color1 + " 0%," + color2 + " 100%);\n"; // Opera 11.10+
	css += "\tbackground: -ms-linear-gradient(top,  " + color1 + " 0%," + color2 + " 100%);\n"; // IE10+
	css += "\tbackground: linear-gradient(to bottom,  " + color1 + " 0%," + color2 + " 100%);\n"; // W3C
	css += "\tfilter: progid:DXImageTransform.Microsoft.gradient( startColorstr='" + color1 + "', endColorstr='" + color2 + "',GradientType=0 );\n"; // IE6-9
	css += "}\n";
	return css;
}

function getGradientColorFrom(h, s, v) {
	var rgb = hsvToRgb(h / 360, s / 100, v / 100);
	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}
	return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

function hsvToRgb(h, s, v) {
	var i = Math.floor(h * 6);
	var f = h * 6 - i;
	v *= 255;
	var p = Math.round(v * (1 - s));
	var q = Math.round(v * (1 - s * f));
	var t = Math.round(v * (1 - s * (1 - f)));
	v = Math.round(v);
	switch (i) {
		case 0: return [v, t, p];
		case 1: return [q, v, p];
		case 2: return [p, v, t];
		case 3: return [p, q, v];
		case 4: return [t, p, v];
		case 5: return [v, p, q];
	}
}