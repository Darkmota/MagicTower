import { BattleBox } from './types/global.js'

class BattleBoxImpl implements BattleBox {
    public ready: boolean = false
    public x: number = 96
    public y: number = 160
    public w: number = 288
    public h: number = 112
    private frameCount: number = 0
    private speed: number = 1
    private htoe: number = 0
    private etoh: number = 0
    private enemyId: number = 0
    private enemyName: string = "W.D.Gaster"
    private enemyHp: number = 0
    private enemyAtk: number = 0
    private enemyDef: number = 0
    private enemyGold: number = 0
    private enemyExp: number = 0
    private enemyImageSrc: string | null = null
    private turn: number = 0
    private cacheCanvas: HTMLCanvasElement
    private cacheContext: CanvasRenderingContext2D

    constructor() {
        this.cacheCanvas = document.createElement("canvas")
        this.cacheCanvas.width = this.w
        this.cacheCanvas.height = this.h
        const context = this.cacheCanvas.getContext("2d")
        if (!context) throw new Error("Failed to get 2D context")
        this.cacheContext = context
        this.cacheContext.fillStyle = "#f99"
        this.cacheContext.font = "italic 20px Arial Black"
    }

    public set(enemyId: number): void {
        this.enemyId = window.mainBattler.data[enemyId][0]
        this.enemyName = window.mainBattler.data[enemyId][1].split(':')[0]
        this.enemyHp = window.mainBattler.data[enemyId][2]
        this.enemyAtk = window.mainBattler.data[enemyId][3]
        this.enemyDef = window.mainBattler.data[enemyId][4]
        this.enemyGold = window.mainBattler.data[enemyId][5]
        this.enemyExp = window.mainBattler.data[enemyId][6]
        this.enemyImageSrc = window.mainBattler.data[enemyId][7]
        window.mainEvents.waiting = true
        window.mainHero.movable = false
        this.cacheContext.clearRect(0, 0, this.w, this.h)
        const burn = 0
        switch (Number(window.mainBattler.data[enemyId][1].split(':')[1])) {
            case 1:
                window.mainHero.hp -= 100
                window.mainAudio.playSE(0)
                break
            case 2:
                window.mainHero.hp -= 300
                window.mainAudio.playSE(0)
                break
            case 3:
                window.mainHero.hp -= Math.floor(window.mainHero.hp/4)
                window.mainAudio.playSE(0)
                break
            case 4:
                window.mainHero.hp -= Math.floor(window.mainHero.hp/3)
                window.mainAudio.playSE(0)
                break
            default:
                break
        }
        this.turn = 0
        this.frameCount = 0
        this.ready = true
        if (window.mainHero.hp <= 0) {
            window.mainHero.hp = 0
            window.mainEvents.waiting = false
            window.mainHero.movable = true
            this.ready = false
        }
    }
    public refresh(): void {
        if (!this.ready) return
        window.drawBox(window.ctx, this.x, this.y, this.w, this.h, 0.66)
        window.ctx.drawImage(this.cacheCanvas, this.x, this.y, this.w, this.h)

        if (this.frameCount % this.speed == 0) {
            ++this.turn
            if (this.turn % 2 == 1) {
                window.mainAudio.playSE(1)
                this.htoe = 0
                if (window.mainHero.atk > this.enemyDef) {
                    this.htoe += window.mainHero.atk - this.enemyDef
                }

                this.enemyHp -= this.htoe

                if (this.enemyHp <= 0) {
                    this.enemyHp = 0
                    window.mainHero.gold += this.enemyGold
                    window.mainHero.exp += this.enemyExp
                    window.addDownMessage("战胜了"+this.enemyName+"，获得"+this.enemyGold+"金币和"+this.enemyExp+"经验")
                    window.mainEvents.waiting = false
                    window.mainHero.movable = true
                    this.ready = false
                }
            }
            else {
                window.mainAudio.playSE(2)
                this.etoh = 0
                if (this.enemyAtk > window.mainHero.def) {
                    this.etoh += this.enemyAtk - window.mainHero.def
                }

                window.mainHero.hp -= this.etoh

                if (window.mainHero.hp <= 0) {
                    window.mainHero.hp = 0
                    window.mainEvents.waiting = false
                    window.mainHero.movable = true
                    this.ready = false
                }
            }

            this.cacheContext.clearRect(0, 0, this.w, this.h)

            this.cacheContext.textAlign = "left"
            this.cacheContext.fillStyle = "#f77"
            this.cacheContext.fillText("HP", 20, 32)
            this.cacheContext.fillText("ATK", 20, 62)
            this.cacheContext.fillText("DEF", 20, 92)

            this.cacheContext.textAlign = "right"
            this.cacheContext.fillStyle = "#fff"
            this.cacheContext.fillText(window.mainHero.hp.toString(), 137, 32)
            this.cacheContext.fillText(window.mainHero.atk.toString(), 137, 62)
            this.cacheContext.fillText(window.mainHero.def.toString(), 137, 92)

            this.cacheContext.fillStyle = "#f77"
            this.cacheContext.fillText("HP", 268, 32)
            this.cacheContext.fillText("ATK", 268, 62)
            this.cacheContext.fillText("DEF", 268, 92)

            this.cacheContext.textAlign = "left"
            this.cacheContext.fillStyle = "#fff"
            this.cacheContext.fillText(this.enemyHp.toString(), 151, 32)
            this.cacheContext.fillText(this.enemyAtk.toString(), 151, 62)
            this.cacheContext.fillText(this.enemyDef.toString(), 151, 92)

		}
		++this.frameCount;
    }
}

export { BattleBoxImpl as BattleBox }
