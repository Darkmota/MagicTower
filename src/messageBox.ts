import { drawBox, drawTextInBox } from './drawFunc.js';

export class MessageBox {
    private active: boolean = false;
    private x: number;
    private y: number;
    private w: number;
    private h: number;
    private alpha: number;
    private message: string = "";
    private typingLength: number = 0;
    private timeCount: number;
    private time: number = 0;
    private typing: boolean = false;
    private cacheCanvas: HTMLCanvasElement;
    private cacheContext: CanvasRenderingContext2D;

    constructor(x: number, y: number, w: number, h: number, timeCount: number, alpha: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.alpha = alpha;
        this.timeCount = timeCount;
        this.cacheCanvas = document.createElement("canvas");
        this.cacheCanvas.width = this.w;
        this.cacheCanvas.height = this.h;
        const context = this.cacheCanvas.getContext("2d");
        if (!context) throw new Error("Could not get 2D context");
        this.cacheContext = context;
    }

    public set(initMessage: string): void {
        this.cacheContext.clearRect(0, 0, this.w, this.h);
        this.message = initMessage;
        this.typingLength = 0;
        this.time = 0;
        this.active = true;
    }

    public refresh(): void {
        if (!this.active) return;
        
        const currentAlpha = this.alpha * (1 - this.time/this.timeCount);
        drawBox(this.cacheContext, 0, 0, this.w, this.h, currentAlpha);
        
        if (this.typingLength <= this.message.length) {
            drawTextInBox(this.cacheContext, this.message.substr(0, this.typingLength), 0, 0, this.w, this.h, 1);
            this.typingLength++;
        } else {
            this.typing = false;
            drawTextInBox(this.cacheContext, this.message, 0, 0, this.w, this.h, this.alpha);
            ++this.time;
            if (this.time === this.timeCount + 1) {
                this.active = false;
            }
        }

        ctx.globalAlpha = Math.max(0, currentAlpha);
        ctx.drawImage(this.cacheCanvas, this.x, this.y, this.w, this.h);
        ctx.globalAlpha = 1;
    }
}
