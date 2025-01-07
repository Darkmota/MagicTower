import { drawBox, drawTextInBox } from './utils/drawing.js'

declare const ctx: CanvasRenderingContext2D
declare const mainEvents: { waiting: boolean, select: number }
declare const mainHero: { movable: boolean }
declare const mainBox: any
declare const mainAudio: { playSE(id: number): void }
declare let frameCount: number

interface SelectionBoxOptions {
    x: number
    y: number
    w: number
    h: number
}

export class SelectionBox {
    private active: boolean = false
    private x: number
    private y: number
    private w: number
    private h: number
    private selections: string[] = []
    private selectionNum: number = 0
    private selectId: number = -1
    private cacheCanvas: HTMLCanvasElement
    private cacheContext: CanvasRenderingContext2D
    private include: any = false

    constructor(options: SelectionBoxOptions) {
        const { x, y, w, h } = options
        this.x = x
        this.y = y
        this.w = w
        this.h = h

        this.cacheCanvas = document.createElement("canvas")
        this.cacheCanvas.width = this.w
        this.cacheCanvas.height = this.h
        const context = this.cacheCanvas.getContext("2d")
        if (!context) throw new Error("Failed to get 2D context")
        this.cacheContext = context
    }

    public set(selectionNum: number, selections: string[]): void {
        mainEvents.waiting = true
        mainHero.movable = false
        this.selectionNum = selectionNum
        this.selections = [...selections]
        this.selectId = 0
        this.active = true
    }

    public input(inputEvent: KeyboardEvent): void {
        if (!this.active) return

        if (this.include) {
            this.include.input(inputEvent)
            return
        }

        switch (inputEvent.key) {
            case "Enter":
            case " ":
                if (mainBox == this) {
                    mainHero.movable = true
                    mainEvents.waiting = false
                }
                mainEvents.select = this.selectId
                this.active = false
                break
            case "ArrowDown":
            case "ArrowRight":
                mainAudio.playSE(11)
                this.selectId = (this.selectId === this.selectionNum - 1) ? 0 : this.selectId + 1
                break
            case "ArrowUp":
            case "ArrowLeft":
                mainAudio.playSE(11)
                this.selectId = (this.selectId === 0) ? this.selectionNum - 1 : this.selectId - 1
                break
        }
    }

    public refresh(): void {
        if (!this.active) return

        if (this.include?.active === false) {
            this.include = false
        }

        this.cacheContext.clearRect(0, 0, this.w, this.h)
        drawBox(this.cacheContext, 0, 0, this.w, this.h, 0.75)

        for (let i = 0; i < this.selectionNum; ++i) {
            if (i === this.selectId) {
                drawBox(this.cacheContext, 0, 20 * i, this.w, 20, Math.abs(frameCount - 18) / 18 * 0.5 + 0.5)
            }
            drawTextInBox(this.cacheContext, this.selections[i], 0, 20 * i - 6, this.w, this.h, 1)
        }

        ctx.drawImage(this.cacheCanvas, this.x, this.y, this.w, this.h)

        if (this.include) {
            this.include.refresh()
        }
    }
}
