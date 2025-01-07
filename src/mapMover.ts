import { MapMover } from './types/global.js'

export class MapMoverImpl implements MapMover {
    public ready: boolean = false
    private frameCountdown: number = 0
    private totalCount: number = 0
    private mapId: number = 0
    public x: number = 0
    public y: number = 0

    constructor() {}

    public set(initCountdown: number, mapId: number, x: number, y: number): void {
        this.totalCount = this.frameCountdown = initCountdown
        this.ready = true
        this.mapId = mapId
        this.x = x
        this.y = y
        mainHero.movable = false
        mainEvents.waiting = true
        mainEvents.touching = null
        mainAutoBox = []
    }

    public refresh(): void {
        if (!this.ready) return
        if (this.frameCountdown == this.totalCount / 2) {
            mainTileset.changeTileset(memoryMap[this.mapId].land.tilesetId)
            mainLand.set(memoryMap[this.mapId].land)
            mainEvents.set(memoryMap[this.mapId].events)
            mainHero.x = this.x
            mainHero.y = this.y
            mainHero.z = this.mapId
        }
        ctx.globalAlpha = jb(1 - Math.pow(2 * this.frameCountdown/this.totalCount - 1, 2), 0, 1)
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, windowWidth, windowHeight)
        ctx.globalAlpha = 1
        if (--this.frameCountdown == 0) {
            this.ready = false
            mainHero.movable = true
            mainEvents.waiting = false
        }
    }
}

export { MapMoverImpl as MapMover }
