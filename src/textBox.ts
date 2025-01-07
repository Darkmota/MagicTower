import { drawBox, drawTextInBox } from './utils/drawing.js'

declare const ctx: CanvasRenderingContext2D
declare const mainEvents: { waiting: boolean }
declare const mainHero: { movable: boolean }
declare const mainBox: any

interface TextBoxOptions {
    x: number
    y: number
    w: number
    h: number
    dependInclude: boolean
    talker: string
}

export class TextBox {
    private active: boolean = false
    private typing: boolean = false
    private typingLength: number = 0
    private x: number
    private y: number
    private w: number
    private h: number
    private message: string = ""
    private talker: string
    private cacheCanvas: HTMLCanvasElement
    private cacheContext: CanvasRenderingContext2D
    private include: any = false
    private dependInclude: boolean

    constructor(options: TextBoxOptions) {
        const { x, y, w, h, dependInclude, talker } = options
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.talker = talker
        this.dependInclude = dependInclude

        this.cacheCanvas = document.createElement("canvas")
        this.cacheCanvas.width = this.w
        this.cacheCanvas.height = this.h
        const context = this.cacheCanvas.getContext("2d")
        if (!context) throw new Error("Failed to get 2D context")
        this.cacheContext = context
    }

    public set(initMessage: string): void {
        mainEvents.waiting = true
        mainHero.movable = false
        this.message = initMessage
        this.typingLength = 0
        this.typing = true
        this.active = true
    }

    public input(inputEvent: KeyboardEvent): void {
        if (!this.active) return

        if (this.include) {
            this.include.input(inputEvent)
            return
        }

        if (inputEvent.key === "Enter" || inputEvent.key === " ") {
            if (this.typing) {
                this.typing = false
                this.typingLength = this.message.length
            } else {
                if (mainBox == this) {
                    mainHero.movable = true
                    mainEvents.waiting = false
                }
                this.active = false
            }
        }
    }

    public refresh(): void {
        if (!this.active) return

        if (this.include?.active === false) {
            this.include = false
            if (this.dependInclude) {
                this.active = false
            }
        }

        if (this.talker) {
            drawBox(ctx, this.x, this.y - 30, ctx.measureText(this.talker).width + 20, 27, 0.75)
            drawTextInBox(ctx, this.talker, this.x, this.y - 33, ctx.measureText(this.talker).width + 20, 27, 1)
        }

        this.cacheContext.clearRect(0, 0, this.w, this.h)
        drawBox(this.cacheContext, 0, 0, this.w, this.h, 0.75)

        if (this.typing) {
            if (this.typingLength <= this.message.length) {
                drawTextInBox(this.cacheContext, this.message.substr(0, this.typingLength), 0, 0, this.w, this.h, 1)
                this.typingLength++
            } else {
                drawTextInBox(this.cacheContext, this.message, 0, 0, this.w, this.h, 1)
                this.typing = false
            }
        } else {
            drawTextInBox(this.cacheContext, this.message, 0, 0, this.w, this.h, 1)
        }

        ctx.drawImage(this.cacheCanvas, this.x, this.y, this.w, this.h)
        
        if (this.include) {
            this.include.refresh()
        }
    }
}
