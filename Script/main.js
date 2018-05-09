var mainTileset = new tileset(),
	mainPublicEvent = new publicEvent(),
	mainLand = new land(),
	mainItem = new item(),
	mainBattler = new battler(),
	mainEvents = new events(),
	mainEventImage = new eventImage();
	mainAudio = new audio();
	mainMonsterBook = new monsterBook();
	mainWait = new wait(),
	mainHero = new hero(),
	mainPlayerDataBox = new playerDataBox(),
	mainBattleBox = new battleBox(),
	mainBox = false,
	mainAutoBox = [],
	mainMonsterBook = new monsterBook(),
	mainMapMover = new mapMover(),
	memoryMap = [],
	mainKeyboardListener = new keyboardListener(),
	mainFpsWatcher = new fpsWatcher(),
	status = 0;

	mainKeyboardListener.set();
	mainFpsWatcher.set();
$.getJSON("./Json/main.json", function(data) {
	$.ajaxSettings.async = false;
	mainHero.set(data.main);
	$.getJSON(data.main.tilesetData, function(data) {
		mainTileset.load(data);
	});

	$.getJSON(data.main.eventImageData, function(data) {
		mainEventImage.load(data);
	});

	$.getJSON(data.main.battlerData, function(data) {
		mainBattler.load(data);
	});

	$.getJSON(data.main.itemData, function(data) {
		mainItem.set(data.item);
	});

	$.getJSON(data.main.audioData, function(data) {
		mainAudio.load(data);
	});

	for(var i = 0; i < data.main.mapDataNum; ++i) {
		$.getJSON(data.main.mapData[i], function(data) {
			memoryMap[i] = $.extend(true, {}, data);
		});
	}

	$.getJSON(data.main.publicEventData, function(data) {
		mainPublicEvent.set(data.publicEvent);
	});
	$.ajaxSettings.async = true;
});

var windowWidth = 480,
	windowHeight = 416,
	canvas = document.createElement("canvas"),
	ctx = canvas.getContext("2d");
canvas.width = windowWidth;
canvas.height = windowHeight;
ctx.font = "italic 12px Arial Black";
ctx.textBaseline = "top";
document.getElementById("game").appendChild(canvas);

var mainGlobal = [];

var main = function() {
	switch (status) {
		case "0":
			if (mainTileset.dataReady && mainEventImage.dataReady && mainBattler.dataReady && mainAudio.dataReady) {
				mainTileset.changeTileset(mainHero.z);
				mainLand.set(memoryMap[mainHero.z].land);
				mainEvents.set(memoryMap[mainHero.z].events);
				status = 1;
			} else {
				var p = (mainTileset.loaded + mainEventImage.loaded + mainBattler.loaded + mainAudio.loaded)/(mainTileset.loadTotal + mainEventImage.loadTotal + mainBattler.loadTotal + mainAudio.loadTotal);
				ctx.fillStyle = "black";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.textAlign = "center";
				ctx.fillStyle = "white";
				ctx.fillText("MAGIC TOWER " + Math.round(p*1000)/10 + "%", windowWidth/2, windowHeight/2);
				ctx.fillRect(0, 0, (windowWidth - 20)*p, 20);
				ctx.fillRect(windowWidth - 20, 0, 20, (windowHeight - 20)*p);
				ctx.fillRect((windowWidth - 20)*(1 - p) + 20, windowHeight - 20, (windowWidth - 20)*p, 20);
				ctx.fillRect(0, (windowHeight - 20)*(1 - p) + 20, 20, (windowHeight - 20)*p);
			}
			break;
		case "1":
			if (! mainBox.active) { mainBox = false; }
			for (var b of mainAutoBox) { if (b && ! b.active) delete b; }
			mainLand.refresh();
			mainEvents.refresh();
			mainHero.refresh();
			mainPlayerDataBox.refresh();
			mainBattleBox.refresh();
			if (mainBox) { mainBox.refresh(); }
			for (var b of mainAutoBox) { if (b) b.refresh(); }
			mainMonsterBook.refresh();
			mainWait.refresh();
			mainKeyboardListener.refresh();
			mainMapMover.refresh();
			mainFpsWatcher.refresh();
			break;

	}
	requestAnimationFrame(main);
};

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

main();