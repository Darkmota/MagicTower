function hero() {
    this.ready = false;
    this.x = 5;
    this.y = 10;
    this.z = 0;
    this.movable = true;
    this.faceto = 0;
    this.image = new Image();

    this.hp = 1000;
    this.atk = 10;
    this.def = 10;
    this.gold = 0;
    this.exp = 0;

    this.bag = [1, 0, 0];

    this.data = null;
}

hero.prototype = {
	set:function(mainData) {
		this.data = mainData;
	    this.hp = mainData.start.hp;
	    this.atk = mainData.start.atk;
	    this.def = mainData.start.def;
	    this.gold = mainData.start.gold;
	    this.exp = mainData.start.exp;
	    this.bag = mainData.start.bag;
		this.image.src = mainData.heroImgSrc;
		this.ready = true;
	},
	refresh:function(){
		if (!this.ready) return;
		if (37 in keysDown || 38 in keysDown || 39 in keysDown || 40 in keysDown) {
			ctx.drawImage(this.image, Math.floor(frameCount / 9) * 32, this.faceto * 33, 32, 32, 64 + this.x * 32, 32 + this.y * 32, 32, 32);
		}
		else {
			ctx.drawImage(this.image, 0, this.faceto * 33, 32, 32, 64 + this.x * 32, 32 + this.y * 32, 32, 32);
		}
	},
	go_down:function(){
		this.faceto = 0;
		var tobeTouch = null;
		var blocked = false;
		if (this.y < 10) {
			if (tobeTouch = mainEvents.eventFind(this.x, this.y + 1)) {
				if (tobeTouch.evpau[0]) {
					mainEvents.getTouch(tobeTouch);
					if (! tobeTouch.evpau[2]) {
						blocked = true;
					}
				}
			}
			else if (! mainLand.canPass(this.x, this.y + 1)) {
				blocked = true;
				mainAudio.playSE(14);
			}
       		if (! blocked){
				this.y += 1;	
       		}
		}
	},
	go_left:function() {
		this.faceto = 1;
		var tobeTouch = null;
		var blocked = false;
		if (this.x > 0) {
			if (tobeTouch = mainEvents.eventFind(this.x - 1, this.y)) {
				if (tobeTouch.evpau[0]) {
					mainEvents.getTouch(tobeTouch);
					if (! tobeTouch.evpau[2]) {
						blocked = true;
					}
				}
			}
			else if (! mainLand.canPass(this.x - 1, this.y)) {
				blocked = true;
				mainAudio.playSE(14);
			}
       		if (! blocked){
				this.x -= 1;	
       		}
		}
	},
	go_right:function() {
		this.faceto = 2;
		var tobeTouch = null;
		var blocked = false;
		if (this.x < 10) {
			if (tobeTouch = mainEvents.eventFind(this.x + 1, this.y )) {
				if (tobeTouch.evpau[0]) {
					mainEvents.getTouch(tobeTouch);
					if (! tobeTouch.evpau[2]) {
						blocked = true;
					}
				}
			}
			else if (! mainLand.canPass(this.x + 1, this.y)) {
				blocked = true;
				mainAudio.playSE(14);
			}
       		if (! blocked){
				this.x += 1;	
       		}
		}
	},
	go_up:function(){
		this.faceto = 3;
		var tobeTouch = null;
		var blocked = false;
		if (this.y > 0) {
			if (tobeTouch = mainEvents.eventFind(this.x, this.y - 1)) {
				if (tobeTouch.evpau[0]) {
					mainEvents.getTouch(tobeTouch);
					if (! tobeTouch.evpau[2]) {
						blocked = true;
					}
				}
			}
			else if (! mainLand.canPass(this.x, this.y - 1)) {
				blocked = true;
				mainAudio.playSE(14);
			}
       		if (! blocked){
				this.y -= 1;	
       		}
		}
	}
}
