import { Tileset } from './tileset.js'
import { PublicEvent } from './publicEvent.js'
import { Land } from './land.js'
import { Item } from './item.js'
import { Battler } from './battler.js'
import { Events } from './events.js'
import { EventImage } from './eventImage.js'
import { GameAudio } from './audio.js'
import { MonsterBook } from './monsterBook.js'
import { Wait } from './wait.js'
import { Hero } from './hero.js'
import { PlayerDataBox } from './playerDataBox.js'
import { BattleBox } from './battleBox.js'
import { MapMover } from './mapMover.js'
import { KeyboardListener } from './keyboardListener.js'
import { FpsWatcher } from './fpsWatcher.js'
import { imgLoadWith } from './function.js'
import { TextBox } from './textBox.js'
import { SelectionBox } from './selectionBox.js'
import type { MainJsonData, PublicEventData, ItemData, TilesetData, BattlerData, AudioData, MapData } from './types/json.js'

// Make TextBox and SelectionBox available globally
// Make constructors available globally
function createTextBox(x: number, y: number, w: number, h: number, dependInclude: boolean = false, talker: string = "") {
    return new TextBox({ x, y, w, h, dependInclude, talker });
}
function createSelectionBox(x: number, y: number, w: number, h: number) {
    return new SelectionBox({ x, y, w, h });
}

;(globalThis as any).textBox = createTextBox;
;(globalThis as any).selectionBox = createSelectionBox;

// Make imgLoadWith available globally
(window as any).imgLoadWith = imgLoadWith;

// Game instance declarations
// Global variables are declared in global.d.ts

// Initialize globals
(globalThis.mainTileset as any) = new Tileset();
(globalThis.mainPublicEvent as any) = new PublicEvent();
(globalThis.mainLand as any) = new Land();
(globalThis.mainItem as any) = new Item();
(globalThis.mainBattler as any) = new Battler();
(globalThis.mainEvents as any) = new Events();
(globalThis.mainEventImage as any) = new EventImage();
(globalThis.mainAudio as any) = new GameAudio();
(globalThis.mainMonsterBook as any) = new MonsterBook();
(globalThis.mainWait as any) = new Wait();
(globalThis.mainHero as any) = new Hero();
(globalThis.mainPlayerDataBox as any) = new PlayerDataBox();
(globalThis.mainBattleBox as any) = new BattleBox();
(globalThis.mainBox as any) = null;
(globalThis.mainAutoBox as any) = [];
(globalThis.mainMapMover as any) = new MapMover();
(globalThis.memoryMap as any) = [];
(globalThis.mainKeyboardListener as any) = new KeyboardListener();
(globalThis.mainFpsWatcher as any) = new FpsWatcher();

let status = 0;

// Initialize systems after globals are set
(globalThis.mainKeyboardListener as any).set();
(globalThis.mainFpsWatcher as any).set();
$.getJSON("./Json/main.json", function(mainData: MainJsonData) {
	$.ajaxSettings.async = false
	mainHero.set(mainData.main)
	$.getJSON(mainData.main.tilesetData, function(tilesetData: TilesetData) {
		mainTileset.load(tilesetData)
	});

	$.getJSON(mainData.main.eventImageData, function(eventData: any) {
		mainEventImage.load(eventData)
	});

	$.getJSON(mainData.main.battlerData, function(battlerData: BattlerData) {
		mainBattler.load(battlerData)
	});

	$.getJSON(mainData.main.itemData, function(itemData: ItemData) {
		mainItem.set(itemData.item)
	})

	$.getJSON(mainData.main.audioData, function(audioData: AudioData) {
		mainAudio.load(audioData)
	});

	for(let i = 0; i < mainData.main.mapDataNum; ++i) {
		$.getJSON(mainData.main.mapData[i], function(mapData: MapData) {
			memoryMap[i] = $.extend(true, {}, mapData)
		});
	}

	$.getJSON(mainData.main.publicEventData, function(eventData: PublicEventData) {
		mainPublicEvent.set(eventData.publicEvent)
	})
	$.ajaxSettings.async = true
});

// Initialize canvas and context
(globalThis.windowWidth as number) = 480;
(globalThis.windowHeight as number) = 416;
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("Could not get 2D context");

canvas.width = (globalThis.windowWidth as number);
canvas.height = (globalThis.windowHeight as number);
ctx.font = "italic 12px Arial Black";
ctx.textBaseline = "top";
const gameElement = document.getElementById("game");
if (!gameElement) throw new Error("Game element not found");
gameElement.appendChild(canvas);

// Assign canvas and context to global scope
(globalThis.canvas as HTMLCanvasElement) = canvas;
(globalThis.ctx as CanvasRenderingContext2D) = ctx;

const mainGlobal: any[] = []
// Initialize frameCount as global
;(globalThis.frameCount as number) = 0

const main = function() {
	switch (status.toString()) {
		case "0":
			if ((globalThis.mainTileset as any).dataReady && (globalThis.mainEventImage as any).dataReady && (globalThis.mainBattler as any).dataReady && (globalThis.mainAudio as any).dataReady) {
				(globalThis.mainTileset as any).changeTileset((globalThis.mainHero as any).z);
				(globalThis.mainLand as any).set((globalThis.memoryMap as any)[(globalThis.mainHero as any).z].land);
				(globalThis.mainEvents as any).set((globalThis.memoryMap as any)[(globalThis.mainHero as any).z].events);
				status = 1;
			} else {
				var p = ((globalThis.mainTileset as any).loaded + (globalThis.mainEventImage as any).loaded + (globalThis.mainBattler as any).loaded + (globalThis.mainAudio as any).loaded)/((globalThis.mainTileset as any).loadTotal + (globalThis.mainEventImage as any).loadTotal + (globalThis.mainBattler as any).loadTotal + (globalThis.mainAudio as any).loadTotal);
				(globalThis.ctx as CanvasRenderingContext2D).fillStyle = "black";
				(globalThis.ctx as CanvasRenderingContext2D).fillRect(0, 0, (globalThis.canvas as HTMLCanvasElement).width, (globalThis.canvas as HTMLCanvasElement).height);
				(globalThis.ctx as CanvasRenderingContext2D).textAlign = "center";
				(globalThis.ctx as CanvasRenderingContext2D).fillStyle = "white";
				(globalThis.ctx as CanvasRenderingContext2D).fillText("MAGIC TOWER " + Math.round(p*1000)/10 + "%", (globalThis.windowWidth as number)/2, (globalThis.windowHeight as number)/2);
				(globalThis.ctx as CanvasRenderingContext2D).fillRect(0, 0, ((globalThis.windowWidth as number) - 20)*p, 20);
				(globalThis.ctx as CanvasRenderingContext2D).fillRect((globalThis.windowWidth as number) - 20, 0, 20, ((globalThis.windowHeight as number) - 20)*p);
				(globalThis.ctx as CanvasRenderingContext2D).fillRect(((globalThis.windowWidth as number) - 20)*(1 - p) + 20, (globalThis.windowHeight as number) - 20, ((globalThis.windowWidth as number) - 20)*p, 20);
				(globalThis.ctx as CanvasRenderingContext2D).fillRect(0, ((globalThis.windowHeight as number) - 20)*(1 - p) + 20, 20, ((globalThis.windowHeight as number) - 20)*p);
			}
			break;
		case "1":
			if ((globalThis.mainBox as any) && !((globalThis.mainBox as any).active)) { (globalThis.mainBox as any) = null; }
			(globalThis.mainAutoBox as any[]) = ((globalThis.mainAutoBox as any[]).filter(b => !b || (b as any).active));
			(globalThis.mainLand as any).refresh();
			(globalThis.mainEvents as any).refresh();
			(globalThis.mainHero as any).refresh();
			(globalThis.mainPlayerDataBox as any).refresh();
			(globalThis.mainBattleBox as any).refresh();
			if (mainBox && (mainBox as any).refresh) { (mainBox as any).refresh(); }
			for (var b of mainAutoBox) { if (b) b.refresh(); }
			(globalThis.mainMonsterBook as any).refresh();
			(globalThis.mainWait as any).refresh();
			(globalThis.mainKeyboardListener as any).refresh();
			(globalThis.mainMapMover as any).refresh();
			(globalThis.mainFpsWatcher as any).refresh();
			break;

	}
	(globalThis.frameCount as number)++
	requestAnimationFrame(main)
}

const w = window
const requestAnimationFrame = (callback: FrameRequestCallback): number => {
    return (w.requestAnimationFrame ||
        ((w as any).webkitRequestAnimationFrame) ||
        ((w as any).msRequestAnimationFrame) ||
        ((w as any).mozRequestAnimationFrame) ||
        ((cb: FrameRequestCallback) => window.setTimeout(cb, 1000 / 60)))(callback)
}

main()
