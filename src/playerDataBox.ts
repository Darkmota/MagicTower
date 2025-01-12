import { PlayerDataBox } from './types/global.js'

class PlayerDataBoxImpl implements PlayerDataBox {
    public ready: boolean = true
    private x: number = 57
    private y: number = 19

    public set(): void {
        this.ready = true
    }

    public refresh(): void {
        if (!this.ready) return
        ctx.font = "italic 12px Arial Black"
        drawBox(ctx, 0, 0, 64, 416, 1)
        drawBox(ctx, 60, 0, 360, 32, 1)
        drawBox(ctx, 60, 384, 360, 32, 1)
        drawBox(ctx, 416, 0, 64, 416, 1)

        ctx.fillStyle = "#f77"
        const s1 = 45
        const list = ["HP", "ATK", "DEF", "GOLD", "EXP", "yellowK", "blueK", "redK"]

        for (let i = 0; i < 8; ++i) {
            ctx.fillRect(4, 19 + i * s1, 56, 1)
            ctx.fillRect(10, 19 + i * s1, 1, 15)
            ctx.fillRect(4, 34 + i * s1, 56, 1)
            ctx.fillRect(10, 19 + i * s1, 50, 15)
        }

        // 绘制状态栏文字
        ctx.textAlign = "left"
        for (let i = 0; i < 8; ++i) {
            switch (i) {
                case 5:
                    ctx.fillStyle = "#ff1"
                    break
                case 6:
                    ctx.fillStyle = "#6bf"
                    break
                case 7:
                    ctx.fillStyle = "#f77"
                    break
            }
            ctx.fillText(list[i], 4, 4 + i * s1)
        }

        ctx.textAlign = "right"
        ctx.fillStyle = "#222"
        ctx.fillText(mainHero.hp.toString(), this.x, this.y)
        ctx.fillText(mainHero.atk.toString(), this.x, this.y + 1 * s1)
        ctx.fillText(mainHero.def.toString(), this.x, this.y + 2 * s1)
        ctx.fillText(mainHero.gold.toString(), this.x, this.y + 3 * s1)
        ctx.fillText(mainHero.exp.toString(), this.x, this.y + 4 * s1)
        ctx.fillText(mainHero.bag[0].toString(), this.x, this.y + 5 * s1)
        ctx.fillText(mainHero.bag[1].toString(), this.x, this.y + 6 * s1)
        ctx.fillText(mainHero.bag[2].toString(), this.x, this.y + 7 * s1)
        ctx.textAlign = "center"
        ctx.fillStyle = "#FFF"
        ctx.font = "14px Arial Black"
        ctx.fillText(mainLand.data.name, windowWidth/2, 6)
        ctx.textAlign = "right"
    }
}

export { PlayerDataBoxImpl as PlayerDataBox }
