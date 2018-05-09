function battleBox() {
	this.ready = false;
	this.x = 96;
	this.y = 160;
	this.w = 288;
	this.h = 112;
	this.frameCount = 0;
	this.speed = 1;
	var htoe;
	var etoh;
	this.enemyId = 0;
	this.enemyName = "W.D.Gaster";
	this.enemyHp = 0;
	this.enemyAtk = 0;
	this.enemyDef = 0;
	this.enemyGold = 0;
	this.enemyExp = 0;
	this.enemyImageSrc = null;
	this.turn = 0;
    this.cacheCanvas = document.createElement("canvas");
    this.cacheCanvas.width = this.w;
    this.cacheCanvas.height = this.h;
    this.cacheContext = this.cacheCanvas.getContext("2d");
	this.cacheContext.fillStyle = "#f99";
	this.cacheContext.font = "italic 20px Arial Black";
}

battleBox.prototype = {
	set:function (enemyId) {
		this.enemyId = mainBattler.data[enemyId][0];
		this.enemyName = mainBattler.data[enemyId][1].split(':')[0];
		this.enemyHp = mainBattler.data[enemyId][2];
		this.enemyAtk = mainBattler.data[enemyId][3];
		this.enemyDef = mainBattler.data[enemyId][4];
		this.enemyGold = mainBattler.data[enemyId][5];
		this.enemyExp = mainBattler.data[enemyId][6];
		this.enemyImageSrc = mainBattler.data[enemyId][7];
		mainEvents.waiting = true;
		mainHero.movable = false;
		this.cacheContext.clearRect(0, 0, this.w, this.h);
		var burn = 0;
		switch (Number(mainBattler.data[enemyId][1].split(':')[1])) {
			case 1:
				mainHero.hp -= 100;
				mainAudio.playSE(0);
				break;
			case 2:
				mainHero.hp -= 300;
				mainAudio.playSE(0);
				break;
			case 3:
				mainHero.hp -= Math.floor(mainHero.hp/4);
				mainAudio.playSE(0);
				break;
			case 4:
				mainHero.hp -= Math.floor(mainHero.hp/3);
				mainAudio.playSE(0);
				break;
			default:
				break;
		}
		this.turn = 0;
		this.frameCount = 0;
		this.ready = true;
		if (mainHero.hp <= 0) {
			mainHero.hp = 0;
			mainEvents.waiting = false;
			mainHero.movable = true;
			this.ready = false;
		}
	},
	refresh:function() {
		if (!this.ready) return;
		drawBox(ctx,this.x,this.y,this.w,this.h, 0.66);
		ctx.drawImage(this.cacheCanvas, this.x, this.y, this.w, this.h);

		if (this.frameCount % this.speed == 0) {
			++this.turn;
			if (this.turn % 2 == 1) {
				mainAudio.playSE(1);
				htoe = 0;
				if (mainHero.atk > this.enemyDef) {
					htoe += mainHero.atk - this.enemyDef;
				}

				this.enemyHp -= htoe;

				if (this.enemyHp <= 0) {
					this.enemyHp = 0;
					mainHero.gold += this.enemyGold;
					mainHero.exp+= this.enemyExp;
					addDownMessage("战胜了"+this.enemyName+"，获得"+this.enemyGold+"金币和"+this.enemyExp+"经验");
					mainEvents.waiting = false;
					mainHero.movable = true;
					this.ready = false;
				}
			}
			else  {
				mainAudio.playSE(2);
				etoh = 0;
				if (this.enemyAtk > mainHero.def) {
					etoh += this.enemyAtk - mainHero.def;
				}

				mainHero.hp -= etoh;

				if (mainHero.hp <= 0) {
					mainHero.hp = 0;
					mainEvents.waiting = false;
					mainHero.movable = true;
					this.ready = false;
				}
			}

			this.cacheContext.clearRect(0, 0, this.w, this.h);

			this.cacheContext.textAlign = "left";
			this.cacheContext.fillStyle = "#f77";
			this.cacheContext.fillText("HP", 20, 32);
			this.cacheContext.fillText("ATK", 20, 62);
			this.cacheContext.fillText("DEF", 20, 92);

			this.cacheContext.textAlign = "right";
			this.cacheContext.fillStyle = "#fff";
			this.cacheContext.fillText(mainHero.hp, 137, 32);
			this.cacheContext.fillText(mainHero.atk, 137, 62);
			this.cacheContext.fillText(mainHero.def, 137, 92);


			this.cacheContext.fillStyle = "#f77";
			this.cacheContext.fillText("HP", 268, 32);
			this.cacheContext.fillText("ATK", 268, 62);
			this.cacheContext.fillText("DEF", 268, 92);


			this.cacheContext.textAlign = "left";
			this.cacheContext.fillStyle = "#fff";
			this.cacheContext.fillText(this.enemyHp, 151, 32);
			this.cacheContext.fillText(this.enemyAtk, 151, 62);
			this.cacheContext.fillText(this.enemyDef, 151, 92);

		}
		++this.frameCount;
	}
}
