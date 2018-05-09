function textBox(x, y, w, h, dependInclude, talker) {
    this.active = false;
    this.typing = false;
    this.typingLength = 0;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.message = "";
    this.talker = talker;
    this.cacheCanvas = document.createElement("canvas");
    this.cacheCanvas.width = this.w;
    this.cacheCanvas.height = this.h;
    this.cacheContext = this.cacheCanvas.getContext("2d");
    this.include = false;
    this.dependInclude = dependInclude;
}

textBox.prototype = {
	set:function(initMessage) {
		mainEvents.waiting = true;
		mainHero.movable = false;
		this.message = initMessage;
    	this.typingLength = 0;
		this.typing = true;
		this.active = true;
	},
	input:function(inputEvent) {
		if (this.include) {
			this.include.input(inputEvent);
			return;
		}
		switch (inputEvent) {
			case "Enter":
				if (this.typing) {
					this.typing = false;
				}
				else {
					if (mainBox == this) {
						mainHero.movable = true;  
						mainEvents.waiting = false;
					}
					this.active = false;
				}
			break;
		}
	},
	refresh:function() {
		if (! this.include.active) {
			this.include = false;
			if (this.dependInclude) {
				this.active = false;
			}
		}
		if (! this.active) return;
		if (this.talker) {
			drawBox(ctx, this.x, this.y - 30, ctx.measureText(this.talker).width + 20, 27, 0.75);
			drawTextInBox(ctx, this.talker, this.x, this.y - 33, ctx.measureText(this.talker).width + 20, 27, 1);
		}
		this.cacheContext.clearRect(0, 0, this.w, this.h);
		drawBox(this.cacheContext, 0, 0,this.w,this.h, 0.75);
		if (this.typing) {
			if (this.typingLength <= this.message.length) {
				drawTextInBox(this.cacheContext, this.message.substr(0, this.typingLength), 0, 0, this.w, this.h, 1);
				this.typingLength++;
			}
			else {
				drawTextInBox(this.cacheContext, this.message, 0, 0, this.w, this.h, 1);
				this.typing = false;
			}
		}
		else {
			drawTextInBox(this.cacheContext, this.message, 0, 0, this.w, this.h, 1);
		}
		ctx.drawImage(this.cacheCanvas, this.x, this.y, this.w, this.h);
		if (this.include) {
			this.include.refresh();
		}
	}
}