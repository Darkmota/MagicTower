import { Hero, GameEvent } from './types/global.js'

class HeroImpl implements Hero {
    public ready: boolean = false
    public x: number = 5
    public y: number = 10
    public z: number = 0
    public movable: boolean = true
    public faceto: number = 0
    private image: HTMLImageElement

    public hp: number = 1000
    public atk: number = 10
    public def: number = 10
    public gold: number = 0
    public exp: number = 0

    public bag: number[] = [1, 0, 0]

    public data: any = null

    constructor() {
        this.image = new Image()
    }

    public set(mainData: any): void {
        this.data = mainData
        this.hp = mainData.start.hp
        this.atk = mainData.start.atk
        this.def = mainData.start.def
        this.gold = mainData.start.gold
        this.exp = mainData.start.exp
        this.bag = mainData.start.bag
        this.image.src = mainData.heroImgSrc
        this.ready = true
    }
    public refresh(): void {
        if (!this.ready) return
        if (37 in window.keysDown || 38 in window.keysDown || 39 in window.keysDown || 40 in window.keysDown) {
            window.ctx.drawImage(this.image, Math.floor(window.frameCount / 9) * 32, this.faceto * 33, 32, 32, 64 + this.x * 32, 32 + this.y * 32, 32, 32)
        } else {
            window.ctx.drawImage(this.image, 0, this.faceto * 33, 32, 32, 64 + this.x * 32, 32 + this.y * 32, 32, 32)
        }
    }
    public go_down(): void {
        this.faceto = 0
        let tobeTouch: GameEvent | null = null
        let blocked = false
        if (this.y < 10) {
            if (tobeTouch = mainEvents.eventFind(this.x, this.y + 1)) {
                if (tobeTouch.evpau[0]) {
                    mainEvents.getTouch(tobeTouch)
                    if (!tobeTouch.evpau[2]) {
                        blocked = true
                    }
                }
            } else if (!mainLand.canPass(this.x, this.y + 1)) {
                blocked = true
                mainAudio.playSE(14)
            }
            if (!blocked) {
                this.y += 1
            }
        }
    }
    public go_left(): void {
        this.faceto = 1
        let tobeTouch: GameEvent | null = null
        let blocked = false
        if (this.x > 0) {
            if (tobeTouch = mainEvents.eventFind(this.x - 1, this.y)) {
                if (tobeTouch.evpau[0]) {
                    mainEvents.getTouch(tobeTouch)
                    if (!tobeTouch.evpau[2]) {
                        blocked = true
                    }
                }
            } else if (!mainLand.canPass(this.x - 1, this.y)) {
                blocked = true
                mainAudio.playSE(14)
            }
            if (!blocked) {
                this.x -= 1
            }
        }
    }
    public go_right(): void {
        this.faceto = 2
        let tobeTouch: GameEvent | null = null
        let blocked = false
        if (this.x < 10) {
            if (tobeTouch = mainEvents.eventFind(this.x + 1, this.y)) {
                if (tobeTouch.evpau[0]) {
                    mainEvents.getTouch(tobeTouch)
                    if (!tobeTouch.evpau[2]) {
                        blocked = true
                    }
                }
            } else if (!mainLand.canPass(this.x + 1, this.y)) {
                blocked = true
                mainAudio.playSE(14)
            }
            if (!blocked) {
                this.x += 1
            }
        }
    }
    public go_up(): void {
        this.faceto = 3
        let tobeTouch: GameEvent | null = null
        let blocked = false
        if (this.y > 0) {
            if (tobeTouch = mainEvents.eventFind(this.x, this.y - 1)) {
                if (tobeTouch.evpau[0]) {
                    mainEvents.getTouch(tobeTouch)
                    if (!tobeTouch.evpau[2]) {
                        blocked = true
                    }
                }
            } else if (!mainLand.canPass(this.x, this.y - 1)) {
                blocked = true
                mainAudio.playSE(14)
            }
            if (!blocked) {
                this.y -= 1
            }
        }
    }
}

export { HeroImpl as Hero }
