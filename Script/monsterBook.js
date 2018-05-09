function monsterBook() {
	this.monsterList = [];
	this.monsterExist = [];
	this.cacheCanvas = [];
	this.cacheContext = [];
	this.ready = false;
	this.x = 64;
	this.y = 32;
	this.w = 352;
	this.h = 352;
	this.cursorPos = 0;
	this.cursorY = 0;
	this.alpha = 0;
	this.frameCount = 0;
}

monsterBook.prototype = {
	set:function() {
		this.frameCount = 0;
		this.monsterList = [];
		this.monsterExist = [];
		for (var i = 0; i < mainEvents.data.length; ++i) {
			if (mainEvents.data[i].evpau[0] && mainEvents.data[i].name.substring(0,6) == "battle") {
				var index = parseInt(mainEvents.data[i].name.substring(6,9));
				if (!this.monsterExist[index]) {
					this.monsterList.push(index);
				}
				this.monsterExist[index] = true;
			}
		}
		this.monsterList.sort();
		for (var j = 0; j < this.monsterList.length; ++j) {
			var i = this.monsterList[j];
			if (!this.cacheCanvas[i]) {
				this.cacheCanvas[i] = document.createElement("canvas");
				this.cacheCanvas[i].width = 352;
				this.cacheCanvas[i].height = 44;
				this.cacheContext[i] = this.cacheCanvas[i].getContext("2d");
				this.cacheContext[i].font = "12px Consolas";
				this.cacheContext[i].fillStyle = "#fff";
			}
			this.cacheContext[i].clearRect(0, 0, 352, 42);
			drawBox(this.cacheContext[i], -2, -2, 354, 46, 0.9);
			this.cacheContext[i].drawImage(mainBattler.canvas[i], 4, 4, 32, 32);
			this.cacheContext[i].fillText(mainBattler.data[i][1], 48, 16);
			this.cacheContext[i].fillStyle = "#9f9";
			this.cacheContext[i].fillText("HP " + mainBattler.data[i][2], 144, 16);
			this.cacheContext[i].fillStyle = "#f99";
			this.cacheContext[i].fillText("ATK " + mainBattler.data[i][3], 216, 16);
			this.cacheContext[i].fillStyle = "#99f";
			this.cacheContext[i].fillText("DEF " + mainBattler.data[i][4], 216, 36);
			this.cacheContext[i].fillStyle = "#ff9";
			this.cacheContext[i].fillText("GOLD " + mainBattler.data[i][5], 280, 16);
			this.cacheContext[i].fillStyle = "#9ff";
			this.cacheContext[i].fillText("EXP " + mainBattler.data[i][6], 280, 36);
			this.cacheContext[i].fillStyle = "#f55";
			this.cacheContext[i].fillText(battler.prototype.damageCalculate(i)[2], 48, 32);
		}
		this.ready = true;
	},
	refresh:function() {
		if (!this.ready) {
			this.alpha = 0;
			this.frameCount = 0;
			return;
		}
		else {
			this.alpha = (2 + this.alpha) / 3;
			this.frameCount = (this.frameCount + 1) % 18;
		}
		ctx.globalAlpha = this.alpha;
		for (var i = 0; i < this.monsterList.length; ++i) {
			ctx.drawImage(this.cacheCanvas[this.monsterList[i]], 64, this.cursorY + i * 44 + 32, 352, 44);
		}
		ctx.globalAlpha = 1;
	}
}
