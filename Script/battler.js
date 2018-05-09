function battler() {
	this.loaded = 0;
	this.loadTotal = Infinity;
    this.dataReady = false;
    this.data = null;
    this.image = [];
    this.canvas = [];
    this.ctx = [];
}

battler.prototype = {
	load:function(battlerData) {
		this.loaded = 0;
		this.loadTotal = Infinity;
	    this.dataReady = false;
	    this.image = [];
	    this.canvas = [];
	    this.ctx = [];
		this.data = battlerData.battler;
		this.loadTotal = battlerData.battlerNum;
		for (var i = 0; i < this.loadTotal; ++i) {
			this.image[i] = new Image();
			this.image[i].src = this.data[i][7];
			this.canvas[i] = document.createElement('canvas');
			imgLoadWith(this.image[i], i, function(img, i) {
				mainBattler.canvas[i].width = mainBattler.image[i].width;
				mainBattler.canvas[i].height = mainBattler.image[i].height;
				mainBattler.ctx[i] = mainBattler.canvas[i].getContext("2d");
				mainBattler.ctx[i].drawImage(mainBattler.image[i], 0, 0);
				mainBattler.loaded++;
				if (mainBattler.loaded == mainBattler.loadTotal) {
					mainBattler.dataReady = true;
				}
			});
		}
	},
	damageCalculate:function(enemyId) {
		var eId = mainBattler.data[enemyId][0];
		var eName = mainBattler.data[enemyId][1].split(':')[0];
		var eHp = mainBattler.data[enemyId][2];
		var eAtk = mainBattler.data[enemyId][3];
		var eDef = mainBattler.data[enemyId][4];
		var eGold = mainBattler.data[enemyId][5];
		var eExp = mainBattler.data[enemyId][6];
		var burn = 0;
		switch (Number(mainBattler.data[enemyId][1].split(':')[1])) {
			case 1:
				burn = 100;
				break;
			case 2:
				burn = 300;
				break;
			case 3:
				burn = Math.floor(mainHero.hp/4);
				break;
			case 4:
				burn = Math.floor(mainHero.hp/3);
				break;
			default:
				break;
		}
		var dmg = 0;
		var turn = 0;
		htoe = (mainHero.atk > eDef ? mainHero.atk - eDef : 0);
		etoh = (mainHero.def < eAtk ? eAtk - mainHero.def : 0);
		if (htoe > 0 && etoh > 0) {
			turn = Math.floor((eHp - 1) / htoe) + 1;
			if ((turn - 1) * etoh < mainHero.hp) {
				return [0, "怪物将对你造成" + ((turn - 1)*etoh + burn) + "点伤害 你出手" + turn +"次",  ((turn - 1)*etoh + burn)];
			}
			else {
				return [-1, "怪物将对你造成" + ((turn - 1)*etoh + burn) + "点伤害 你来不及出手" + turn +"次",  ((turn - 1)*etoh + burn)];
			}
		}
		else if (htoe > 0 && etoh == 0) {
			return [1, '怪物对你没有任何威胁', burn];
		}
		else if (etoh > 0) {
			return [-2, '你对怪物没有任何威胁', 9999999];
		}
		else {
			return [-2, '永无休止的战斗', 9999999];
		}
	}
}
