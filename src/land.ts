interface TilesetMap {
    useEventImage: boolean
    eventImageSrc?: string
    x: number
    y: number
    animation?: boolean
    passable: boolean
}

interface LandData {
    name?: string
    id: number
    tilesetId: number
    map: number[][]
}

export class Land {
    private data: LandData | null = null
    private ready: boolean = false
    private cacheCanvas: HTMLCanvasElement[] = []
    private cacheContext: (CanvasRenderingContext2D | null)[] = []

    constructor() {}

    public set(landData: LandData): void {
        this.data = landData

        if (!this.data) return

        const tilesetData = (mainTileset as any).data[this.data.tilesetId]
        if (!tilesetData?.tilesetMap) return

        for (let i = 0; i < tilesetData.tilesetMap.length; ++i) {
            if (!tilesetData.tilesetMap[i].useEventImage) {
                this.cacheCanvas[i] = document.createElement("canvas")
                this.cacheCanvas[i].width = 32
                this.cacheCanvas[i].height = 32
                const context = this.cacheCanvas[i].getContext("2d")
                if (!context) continue
                this.cacheContext[i] = context
                const tile = tilesetData.tilesetMap[i]
                context.drawImage(
                    (mainTileset as any).canvas,
                    tile.x * 32,
                    tile.y * 32,
                    32, 32,
                    0, 0,
                    32, 32
                )
            }
        }
        this.ready = true
    }

    public refresh(): void {
        if (!this.ready || !this.data) return

        const tilesetData = (mainTileset as any).data[this.data.tilesetId]
        if (!tilesetData?.tilesetMap) return

        for (let i = 0; i < 11; ++i) {
            for (let j = 0; j < 11; ++j) {
                const block = tilesetData.tilesetMap[this.data.map[i][j]]
                if (block.useEventImage) {
                    if (block.animation) {
                        ctx.drawImage(
                            mainEventImage.canvas[block.eventImageSrc],
                            block.x * 32 + Math.floor(frameCount / 9) % 4 * 32,
                            block.y * 32,
                            32, 32,
                            64 + j * 32,
                            32 + i * 32,
                            32, 32
                        )
                    } else {
                        ctx.drawImage(
                            mainEventImage.canvas[block.eventImageSrc],
                            block.x * 32,
                            block.y * 32,
                            32, 32,
                            64 + j * 32,
                            32 + i * 32,
                            32, 32
                        )
                    }
                } else {
                    ctx.drawImage(
                        this.cacheCanvas[this.data.map[i][j]],
                        64 + j * 32,
                        32 + i * 32,
                        32, 32
                    )
                }
            }
        }
    }

    public canPass(xx: number, yy: number): boolean {
        if (!this.data) return false

        const tilesetData = (mainTileset as any).data[this.data.tilesetId]
        if (!tilesetData?.tilesetMap) return false

        return tilesetData.tilesetMap[this.data.map[yy][xx]].passable
    }
}
