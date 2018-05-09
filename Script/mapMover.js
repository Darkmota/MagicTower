function mapMover() {
	this.ready = false;
	this.frameCountdown = 0;
	this.totalCount = 0;
	this.mapId = 0;
	this.x = 0;
	this.y = 0;
}

mapMover.prototype = {
	set:function (initCountdown, mapId, x, y) {
		this.totalCount = this.frameCountdown = initCountdown;
		this.ready = true;
		this.mapId = mapId;
		this.x = x;
		this.y = y;
		mainHero.movable = false;
		mainEvents.waiting = true;
		mainEvents.touching = null;
		mainAutoBox = [];
	},
	refresh:function() {
		if (!this.ready) return;
		if (this.frameCountdown == this.totalCount / 2) {
			mainTileset.changeTileset(memoryMap[this.mapId].land.tilesetId);
			mainLand.set(memoryMap[this.mapId].land);
			mainEvents.set(memoryMap[this.mapId].events);
			mainHero.x = this.x;
			mainHero.y = this.y;
			mainHero.z = this.mapId;
		}
		ctx.globalAlpha = jb(1 - Math.pow(2 * this.frameCountdown/this.totalCount - 1, 2), 0, 1);
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, windowWidth, windowHeight);
		ctx.globalAlpha = 1;
		if (--this.frameCountdown == 0) {
			this.ready = false;
			mainHero.movable = true;
			mainEvents.waiting = false;
		}
	}
}
