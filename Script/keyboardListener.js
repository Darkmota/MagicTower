var keysDown = {};
var keysReacted = {};
for (var i = 0; i < 256; ++i) {
	keysReacted[i] = 0;
}
function keyboardListener() {
    this.ready = false;
}
function kble(i) {
	if (i in keysDown) {
		if (keysReacted[i] == 0) {
			keysReacted[i] = 1;
			return true;
		}
		else {
			return keysReacted[i] == 13;
		}
	}
	else {
		return false;
	}
}
keyboardListener.prototype = {
	set:function() {
		addEventListener("keydown", function (e) {
			keysDown[e.keyCode] = true;
		}, false);

		addEventListener("keyup", function (e) {
			keysReacted[e.keyCode] = 0;
			delete keysDown[e.keyCode];
		}, false);

		this.ready = true;
	},
	refresh:function() {
		for (var i = 0; i < 256; ++i) {
			if (keysReacted[i] != 13 && keysReacted[i] != 0) {
				++keysReacted[i];
			}
		}
		if (!this.ready || mainWait.ready) return;
		if (mainBox && mainBox.input) {
			if (kble(40)) { // 下
	       		mainBox.input("Down");
			}
	    	else if (kble(37)) { // 左
	       		mainBox.input("Left");
			}
	    	else if (kble(39)) { // 右
	       		mainBox.input("Right");
			}
	    	else if (kble(38)) { // 上
	       		mainBox.input("Up");
			}
			else if (kble(13) || kble(108)) { // 回车,
				mainBox.input("Enter");
			}
		}
		else {
			if (mainHero.movable) {
				if (kble(40)) { // 下
		       		mainHero.go_down();
				}
		    	else if (kble(37)) { // 左
		       		mainHero.go_left();
				}
		    	else if (kble(39)) { // 右
		       		mainHero.go_right();
				}
		    	else if (kble(38)) { // 上
		       		mainHero.go_up();
				}	
			}
			if (keysDown[83]) {
				if (!mainMonsterBook.ready) {
					mainMonsterBook.set();
				}
			}
			else {
				mainMonsterBook.ready = false;
			}
		}
	}
}