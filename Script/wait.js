function wait() {
	this.ready = false;
	this.frameCountdown = 0;
}

wait.prototype = {
	set:function (initCountdown) {
		this.frameCountdown = initCountdown;
		this.ready = true;
		mainEvents.waiting = true;
	},
	refresh:function() {
		if (!this.ready) return;
		if (--this.frameCountdown == 0) {
			this.ready = false;
			mainEvents.waiting = false;
		}
	}
}
