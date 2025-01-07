import { MonsterBook } from './types/global.js'

class MonsterBookImpl implements MonsterBook {
    private monsterList: number[] = []
    private monsterExist: boolean[] = []
    private cacheCanvas: HTMLCanvasElement[] = []
    private cacheContext: CanvasRenderingContext2D[] = []
    public ready: boolean = false
    private x: number = 64
    private y: number = 32
    private w: number = 352
    private h: number = 352
    private cursorPos: number = 0
    private cursorY: number = 0
    private alpha: number = 0
    private frameCount: number = 0

    public set(): void {
        this.frameCount = 0
        this.monsterList = []
        this.monsterExist = []
        for (let i = 0; i < mainEvents.data.length; ++i) {
            if (mainEvents.data[i]?.evpau[0] && mainEvents.data[i]?.name?.substring(0, 6) === "battle") {
                const index = parseInt(mainEvents.data[i]?.name?.substring(6, 9) || "0")
                if (!this.monsterExist[index]) {
                    this.monsterList.push(index)
                }
                this.monsterExist[index] = true
            }
        }
        this.monsterList.sort()
        for (let j = 0; j < this.monsterList.length; ++j) {
            const i = this.monsterList[j]
            if (!this.cacheCanvas[i]) {
                this.cacheCanvas[i] = document.createElement("canvas")
                this.cacheCanvas[i].width = 352
                this.cacheCanvas[i].height = 44
                const context = this.cacheCanvas[i].getContext("2d")
                if (!context) throw new Error("Failed to get 2D context")
                this.cacheContext[i] = context
                this.cacheContext[i].font = "12px Consolas"
                this.cacheContext[i].fillStyle = "#fff"
            }
            this.cacheContext[i].clearRect(0, 0, 352, 42)
            drawBox(this.cacheContext[i], -2, -2, 354, 46, 0.9)
            this.cacheContext[i].drawImage(mainBattler.canvas[i], 4, 4, 32, 32)
            this.cacheContext[i].fillText(mainBattler.data[i][1], 48, 16)
            this.cacheContext[i].fillStyle = "#9f9"
            this.cacheContext[i].fillText("HP " + mainBattler.data[i][2], 144, 16)
            this.cacheContext[i].fillStyle = "#f99"
            this.cacheContext[i].fillText("ATK " + mainBattler.data[i][3], 216, 16)
            this.cacheContext[i].fillStyle = "#99f"
            this.cacheContext[i].fillText("DEF " + mainBattler.data[i][4], 216, 36)
            this.cacheContext[i].fillStyle = "#ff9"
            this.cacheContext[i].fillText("GOLD " + mainBattler.data[i][5], 280, 16)
            this.cacheContext[i].fillStyle = "#9ff"
            this.cacheContext[i].fillText("EXP " + mainBattler.data[i][6], 280, 36)
            this.cacheContext[i].fillStyle = "#f55"
            this.cacheContext[i].fillText(mainBattler.damageCalculate(i)[2].toString(), 48, 32)
        }
        this.ready = true
    }

    public refresh(): void {
        if (!this.ready) {
            this.alpha = 0
            this.frameCount = 0
            return
        }
        this.alpha = (2 + this.alpha) / 3
        this.frameCount = (this.frameCount + 1) % 18
        ctx.globalAlpha = this.alpha
        for (let i = 0; i < this.monsterList.length; ++i) {
            ctx.drawImage(this.cacheCanvas[this.monsterList[i]], 64, this.cursorY + i * 44 + 32, 352, 44)
        }
        ctx.globalAlpha = 1
    }
}

export { MonsterBookImpl as MonsterBook }
