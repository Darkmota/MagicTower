var AC = false;

try {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	AC = new window.AudioContext();
}
catch (e) {
	alert("该浏览器不支持Web Audio API");
}

function audioLoad(src, callback) {
	if (! src) return;
	var audio = document.createElement("Audio");
	audio.oncanplay = callback(audio);
	audio.src = src;
	audio.style.crossOrigin = "anonymous";
	callback(audio);
}

function playSound(buffer, startTime) {
	var source = AC.createBufferSource();
	source.buffer = buffer;
	source.connect(AC.destination);
	source.start(startTime || 0);
}

function loadSound(url, index){
	var request = new XMLHttpRequest();
	request.open('GET',url,true);
	request.responseType = 'arraybuffer';
	request.onload = function(){
	    AC.decodeAudioData(request.response,function(buffer){
	    	mainAudio.buffer[index] = $.extend(buffer, {}, true);
	    	mainAudio.loaded++;
			if (mainAudio.loaded == mainAudio.loadTotal) {
				mainAudio.dataReady = true;
			}
		}, function () {
			alert("WEB Audio API error");
		});
	}
	request.send();
}

function audio() {
	this.loaded = 0;
	this.waitBuffer = false;
	this.loadTotal = Infinity;
    this.dataReady = false;
    this.data = null;
    this.audio = [];
    this.buffer = [];
    this.BGM = false;
    this.BGMId = -1;
}

audio.prototype = {
	load:function (audioData) {
		this.loaded = 0;
		this.loadTotal = Infinity;
	    this.dataReady = false;
	    this.buffer = [];
		this.data = audioData.audio;
		this.loadTotal = audioData.audioNum;
		for (var i = 0; i < this.loadTotal; ++i) {
			loadSound(this.data[i][2], i);
		}
	},
	playSE:function (i) {
		playSound(this.buffer[i]);
	},
	playBGM:function (i) {
		if (i != this.BGMId) {
			this.BGMId = i;
			if (this.BGM) {
				this.BGM.stop();
			}
		    this.BGM = AC.createBufferSource();
			this.BGM.connect(AC.destination);
			this.BGM.buffer = this.buffer[i];
			this.BGM.start(0);
		}
	},
	stopBGM:function () {
		if (this.BGM) {
			this.BGM.stop();
			this.BGM = false;
			this.BGMId = -1;
		}
	}
}
