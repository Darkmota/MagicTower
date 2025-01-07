export function drawBox(
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    alpha: number
): void {
    c.fillStyle = "rgba(50,50,50," + alpha + ")";
    c.fillRect(x+4, y+4, w-8, h-8);

    c.fillStyle = "rgba(200,70,70," + alpha + ")";
    c.fillRect(x, y, w-4, 4);
    c.fillRect(x, y+4, 4, h-4);
    c.fillRect(x+w-4, y, 4, h-4);
    c.fillRect(x+4, y+h-4, w-4, 4);
    c.fillStyle = "rgba(255,255,255,255)";
}

export function drawTextInBox(
    c: CanvasRenderingContext2D,
    mes: string,
    x: number,
    y: number,
    w: number,
    h: number,
    alpha: number
): void {
    const startX = x + 8;
    const startY = y + 8;
    let temp = 0;
    const width = w - 16;
    const height = h - 16;
    let left = mes;
    let line = "";
    let newLine = false;
    let deleteChar = 0;
    c.fillStyle = `rgba(255,255,255,${alpha})`;
    c.font = "14px consolas";
    c.textAlign = "left";
    c.textBaseline = "top";

    while (left !== "") {
        line = "";
        deleteChar = 0;
        while (c.measureText(line).width <= width && left !== "") {
            line = line + left.charAt(0);
            left = left.substring(1);
            deleteChar = 0;

            if (left.charAt(0) === "\\") {
                switch (left.charAt(1)) {
                    case "n":
                        newLine = true;
                        deleteChar = 2;
                        break;
                    case "r":
                        c.fillStyle = `rgba(255,128,128,${alpha})`;
                        deleteChar = 2;
                        break;
                    case "g":
                        c.fillStyle = `rgba(128,255,128,${alpha})`;
                        deleteChar = 2;
                        break;
                    case "b":
                        c.fillStyle = `rgba(128,128,255,${alpha})`;
                        deleteChar = 2;
                        break;
                    case "c": {
                        const color = left.substring(2, 6);
                        const r = parseInt(color.substring(0, 2), 16);
                        const g = parseInt(color.substring(2, 4), 16);
                        const b = parseInt(color.substring(4, 6), 16);
                        c.fillStyle = `rgba(${r},${g},${b},${alpha})`;
                        deleteChar = 8;
                        break;
                    }
                    default:
                        deleteChar = 0;
                }
            }

            left = left.substring(deleteChar);
            if (newLine) {
                newLine = false;
                break;
            }
        }

        if (c.measureText(line).width > width) {
            left = line.charAt(line.length - 1) + left;
            line = line.substring(0, line.length - 1);
        }

        c.fillText(line, startX, startY + temp * 16);
        ++temp;
    }
}
