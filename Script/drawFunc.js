function drawBox(c, x, y, w, h, alpha) {
	c.fillStyle = "rgba(50,50,50," + alpha + ")";
	c.fillRect(x+4,y+4,w-8,h-8);

	c.fillStyle = "rgba(200,70,70," + alpha + ")";
	c.fillRect(x,y,w-4,4);
	c.fillRect(x,y+4,4,h-4);
	c.fillRect(x+w-4,y,4,h-4);
	c.fillRect(x+4,y+h-4,w-4,4);
	c.fillStyle = "rgba(255,255,255,255)";
}
function drawTextInBox(c, mes, x, y, w, h, alpha) {
	var startX = x + 8,
		startY = y + 8,
		temp = 0,
		width = w - 16,
		height = h - 16,
		left = mes,
		line = "",
		newLine = false,
		deleteChar = 0;
	c.fillStyle = "rgba(255,255,255," + alpha + ")";
	c.font = "14px consolas";
	c.textAlign = "left";
	c.textBaseline = "top";
	while (left != "") {
		line = "";
		deleteChar = 0;
		while (c.measureText(line).width <= width && left != "") {
			line = line + left.charAt(0);
			left = left.substring(1);
			deleteChar = 0;
			if (left.charAt(0) == "\\") {
				switch (left.charAt(1)) {
					case "n":
						newLine = true;
						deleteChar = 2;
					break;
					case "r":
						c.fillStyle = "rgba(255,128,128," + alpha + ")";
						deleteChar = 2;
					break;
					case "g":
						c.fillStyle = "rgba(128,255,128," + alpha + ")";
						deleteChar = 2;
					break;
					case "b":
						c.fillStyle = "rgba(128,128,255," + alpha + ")";
						deleteChar = 2;
					break;
					case "c":
						var color = left.substring(2, 6);
						c.fillStyle = "rgba(" + parseInt(color.substring(0, 2), 16) + "," + parseInt(color.substring(2, 2), 16) + "," + parseInt(color.substring(4, 2), 16) + "," + alpha + ")";
						deleteChar = 8;
					break;
					default:
						deleteChar = 0;
				}
			}
			left = left.substring(deleteChar);
			if (newLine) {
				newLine = false;
				break;
			}
//			console.log(left + "|" + line);
		}
		if (c.measureText(line).width > width) {
			left = line.charAt(line.length - 1) + left;
			line = line.substring(0, line.length - 1);
		}
		c.fillText(line, startX, startY + temp * 16);
		++temp;
	}
}

/*
	ctx.fillStyle = "rgba(220,220,220," + alpha + ")";
	ctx.font = "14px consolas";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText(mes, startX, startY);
 */