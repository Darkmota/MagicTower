function tileset() {
	this.loaded = 0;
	this.loadTotal = Infinity;
    this.dataReady = false;
    this.data = null;
    this.image = [];
    this.mapctx = null;
    this.canvas = null;
}

tileset.prototype = {
	load:function(tilesetData){
		this.loaded = 0;
		this.loadTotal = Infinity;
	    this.dataReady = false;
	    this.data = null;
	    this.image = [];
	    this.mapctx = null;
	    this.canvas = null;
		this.data = tilesetData.tileset;
		this.loadTotal = tilesetData.tilesetNum;
		for (var i = 0; i < this.loadTotal; ++i) {
			this.image[i] = new Image();
			this.image[i].src = this.data[i].tilesetSrc;
			imgLoad(this.image[i], function(img) {
				mainTileset.loaded++;
				if (mainTileset.loaded == mainTileset.loadTotal) {
					mainTileset.dataReady = true;
				}
			});
		}
	},
	changeTileset:function(id) {
		if (! this.canvas) {
			this.canvas = document.createElement("canvas");
			this.mapctx = this.canvas.getContext("2d");
		}
		this.canvas.width = this.image[id].width;
		this.canvas.height = this.image[id].height;
		this.mapctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.mapctx.drawImage(this.image[id], 0, 0);
	}
}
