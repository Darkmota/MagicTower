import { FpsWatcher } from './types/global.js'

class FpsWatcherImpl implements FpsWatcher {
    private fpsDog?: number
    private fps: number = 0
    private frameCount: number = 0
    private absFrameCount: number = 0
    private preFrameCount: number = 0

    public set(): void {
        this.fpsDog = window.setInterval(() => {
            this.fps = this.absFrameCount - this.preFrameCount
            this.preFrameCount = this.absFrameCount
        }, 1000)
    }

    public refresh(): void {
        ctx.fillStyle = "#eee"
        ctx.fillText("FPS: " + this.fps, 475, 394)
        this.frameCount = (this.frameCount + 1) % 36
        this.absFrameCount++
    }
}

export { FpsWatcherImpl as FpsWatcher }
