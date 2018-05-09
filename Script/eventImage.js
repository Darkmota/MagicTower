function eventImage() {
	this.loaded = 0;
	this.loadTotal = Infinity;
    this.dataReady = false;
    this.data = null;
    this.image = [];
    this.canvas = [];
    this.ctx = [];
}

eventImage.prototype = {
	load:function(eventImageData){
		this.loaded = 0;
		this.loadTotal = Infinity;
	    this.dataReady = false;
	    this.image = [];
	    this.canvas = [];
	    this.ctx = [];
		this.data = eventImageData.image;
		this.loadTotal = eventImageData.imageNum;
		for (var i = 0; i < this.loadTotal; ++i) {
			this.image[i] = new Image();
			this.image[i].src = this.data[i][1];
			this.canvas[i] = document.createElement('canvas');
			imgLoadWith(this.image[i], i, function(img, i) {
				mainEventImage.canvas[i].width = mainEventImage.image[i].width;
				mainEventImage.canvas[i].height = mainEventImage.image[i].height;
				mainEventImage.ctx[i] = mainEventImage.canvas[i].getContext("2d");
				mainEventImage.ctx[i].drawImage(mainEventImage.image[i], 0, 0);
				mainEventImage.loaded++;
				if (mainEventImage.loaded == mainEventImage.loadTotal) {
					mainEventImage.dataReady = true;
				}
			});
		}
	}
}
