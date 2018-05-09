function item() {
	this.ready = false;
	this.data = null;
}

item.prototype = {
	set:function(itemData) {
		this.data = itemData;
	}
}
