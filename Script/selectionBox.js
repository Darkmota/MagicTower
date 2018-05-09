function selectionBox(x, y, w, h) {
    this.active = false;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.selections = [];
    this.selectionNum = 0;
    this.selectId = -1;
    this.cacheCanvas = document.createElement("canvas");
    this.cacheCanvas.width = this.w;
    this.cacheCanvas.height = this.h;
    this.cacheContext = this.cacheCanvas.getContext("2d");
    this.include = false;
}

selectionBox.prototype = {
	set:function(selectionNum, selections) {
		mainEvents.waiting = true;
		mainHero.movable = false;
		this.selectionNum = selectionNum;
		this.selections = $.extend(true, [], selections);
		for (var i = 2; i < 2 + selectionNum; ++i) {
			selections[i - 2] = arguments[i];
		}
		this.selectId = 0;
		this.active = true;
	},
	input:function(inputEvent) {
		if (this.include) {
			this.include.input(inputEvent);
			return;
		}
		switch (inputEvent) {
			case "Enter":
				if (mainBox == this) {
					mainHero.movable = true;
					mainEvents.waiting = false;
				}
				mainEvents.select = this.selectId;
				this.active = false;
				break;
			case "Down":
			case "Right":
				mainAudio.playSE(11);
				this.selectId = (this.selectId == this.selectionNum - 1 ? 0 : this.selectId + 1);
				break;
			case "Up":
			case "Left":
				mainAudio.playSE(11);
				this.selectId = (this.selectId == 0 ? this.selectionNum - 1 : this.selectId - 1);
				break;
		}
	},
	refresh:function() {
		if (! this.active) return;
		if (! this.include.active) {
			this.include = false;
		}
		this.cacheContext.clearRect(0, 0, this.w, this.h);
		drawBox(this.cacheContext, 0, 0,this.w,this.h, 0.75);
		for (var i = 0; i < this.selectionNum; ++i) {
			if (i == this.selectId) {
				drawBox(this.cacheContext, 0, 20*i, this.w, 20, Math.abs(frameCount - 18)/18*0.5 + 0.5);
			}
			drawTextInBox(this.cacheContext, this.selections[i], 0, 20*i - 6, this.w, this.h, 1);
		}
		ctx.drawImage(this.cacheCanvas, this.x, this.y, this.w, this.h);
		if (this.include) {
			this.include.refresh();
		}
	}
}