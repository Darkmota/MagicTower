function publicEvent() {
	this.ready = false;
	this.data = null;
}

publicEvent.prototype = {
	set:function(publicEventData) {
		this.data = publicEventData;
		this.ready = true;
	}
}