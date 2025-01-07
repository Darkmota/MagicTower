import { Wait } from './types/global.js'

export class WaitImpl implements Wait {
    public ready: boolean = false
    private frameCountdown: number = 0

    constructor() {}

    public set(initCountdown: number): void {
        this.frameCountdown = initCountdown
        this.ready = true
        mainEvents.waiting = true
    }

    public refresh(): void {
        if (!this.ready) return
        if (--this.frameCountdown == 0) {
            this.ready = false
            mainEvents.waiting = false
        }
    }
}

export { WaitImpl as Wait }
