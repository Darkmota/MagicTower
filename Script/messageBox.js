function messageBox(x, y, w, h, timeCount, alpha) {
    this.active = false;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.alpha = alpha;
    this.message = "";
    this.typingLength = 0;
    this.timeCount = timeCount;
    this.time = 0;
    this.cacheCanvas = document.createElement("canvas");
    this.cacheCanvas.width = this.w;
    this.cacheCanvas.height = this.h;
    this.cacheContext = this.cacheCanvas.getContext("2d");
}

messageBox.prototype = {
	set:function(initMessage) {
		this.cacheContext.clearRect(0, 0, this.w, this.h);
		this.message = initMessage;
		this.typingLength = 0;
		this.time = 0;
		this.active = true;
	},
	refresh:function() {
		if (! this.active) return;
		drawBox(this.cacheContext,0,0,this.w,this.h, this.alpha*(1-this.time/this.timeCount));
		if (this.typingLength <= this.message.length) {
			drawTextInBox(this.cacheContext, this.message.substr(0, this.typingLength), 0, 0, this.w, this.h, 1);
			this.typingLength++;
		}
		else {
			this.typing = false;
			drawTextInBox(this.cacheContext, this.message, 0, 0, this.w, this.h, this.alpha);
			++this.time;
			if (this.time == this.timeCount + 1) {
				this.acitve = false;
			}
		}
		ctx.globalAlpha = (this.alpha*(1-this.time/this.timeCount) < 0 ? 0 : this.alpha*(1-this.time/this.timeCount));
		ctx.drawImage(this.cacheCanvas, this.x, this.y, this.w, this.h);
		ctx.globalAlpha = 1;
	},
}
