/*
mainLand
data.name
	.id
	.tilesetId
	.map[][]
 */
function land() {
    this.data = null;
    this.ready = false;
    this.cacheCanvas = [];
    this.cacheContext = [];
}

land.prototype = {
	set:function(landData) {
		this.data = landData;

		for (var i = 0; i < mainTileset.data[this.data.tilesetId].tilesetMap.length; ++i) {
			if (! mainTileset.data[this.data.tilesetId].tilesetMap[i].useEventImage) {
				this.cacheCanvas[i] = document.createElement("canvas");
				this.cacheCanvas[i].width = 32;
				this.cacheCanvas[i].height = 32;
				this.cacheContext[i] = this.cacheCanvas[i].getContext("2d");
				var tile = mainTileset.data[this.data.tilesetId].tilesetMap[i];
				this.cacheContext[i].drawImage(mainTileset.canvas, tile.x * 32, tile.y * 32, 32, 32, 0, 0, 32, 32);
			}
		}
		this.ready = true;
	},
	refresh:function(){
		if (!this.ready) return;
		for (var i = 0; i < 11; ++i){
			for (var j = 0; j < 11; ++j){
				var block = mainTileset.data[this.data.tilesetId].tilesetMap[this.data.map[i][j]];
				if (block.useEventImage) {
					if (block.animation) {
						ctx.drawImage(mainEventImage.canvas[block.eventImageSrc], block.x*32 + Math.floor(frameCount/9)%4*32, block.y*32, 32, 32, 64 + j * 32, 32 + i * 32, 32, 32);
					}
					else {
						ctx.drawImage(mainEventImage.canvas[block.eventImageSrc], block.x*32, block.y*32, 32, 32, 64 + j * 32, 32 + i * 32, 32, 32);
					}
				}
				else {
					ctx.drawImage(this.cacheCanvas[this.data.map[i][j]], 64 + j * 32, 32 + i * 32, 32, 32);
				}
				/*
				ctx.textAlign = "right";
				ctx.fillText(j+" "+i, 96 + j * 32, 32 + i * 32);
				/*
				var tempImage = new Image();
				var tile = mainTileset.data[this.data.tilesetId].tilesetMap[this.data.map[i][j]];
				tempImage.src = mainTileset.data[this.data.tilesetId].tilesetSrc;
				ctx.drawImage(tempImage, tile.x * 32, tile.y * 32, 32, 32, 64 + j * 32, 32 + i * 32, 32, 32);
				*/
			}
		}
	},
	canPass:function(xx, yy){
		return mainTileset.data[this.data.tilesetId].tilesetMap[this.data.map[yy][xx]].passable;
	}
}
