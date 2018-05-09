function imgLoad(img, callback) {
	var timer = setInterval(function() {
		if (img && img.complete) {
			clearInterval(timer);
			callback(img);
		}
	}, 50);
}

function imgLoadWith(img, thing, callback) {
	var timer = setInterval(function() {
		if (img && img.complete) {
			clearInterval(timer);
			callback(img, thing);
		}
	}, 50);
}

function between(x, a, b) {
	if (a > b) {
		var temp = a;
		a = b;
		b = temp;
	}
	return a <= x && x <= b;
}
function jb(x, a, b) {
	if (a > b) {
		var temp = a;
		a = b;
		b = temp;
	}
	if (x < a) {
		return a;
	}
	else if (x > b) {
		return b;
	}
	else {
		return x;
	}
}

function addDownMessage(message) {
	var newBox = new messageBox(60, 384, 360, 32, 100, 1);
	newBox.set(message);
	for (var i = 0; mainAutoBox[i]; ++i);
	mainAutoBox[i] = $.extend(true, {}, newBox);
}
