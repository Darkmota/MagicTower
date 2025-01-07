import { EventImage } from './types/global.js'

interface EventImageData {
    image: any[][]
    imageNum: number
}

class EventImageImpl implements EventImage {
    public loaded: number = 0
    public loadTotal: number = Infinity
    public dataReady: boolean = false
    public data: any[][] = []
    public image: HTMLImageElement[] = []
    public canvas: HTMLCanvasElement[] = []
    private ctx: CanvasRenderingContext2D[] = []

    public load(eventImageData: EventImageData): void {
        this.loaded = 0
        this.loadTotal = Infinity
        this.dataReady = false
        this.image = []
        this.canvas = []
        this.ctx = []
        this.data = eventImageData.image
        this.loadTotal = eventImageData.imageNum

        for (let i = 0; i < this.loadTotal; ++i) {
            this.image[i] = new Image()
            this.image[i].src = this.data[i][1]
            this.canvas[i] = document.createElement('canvas')
            imgLoadWith(this.image[i], i, (img: HTMLImageElement, index: number) => {
                this.canvas[index].width = this.image[index].width
                this.canvas[index].height = this.image[index].height
                const context = this.canvas[index].getContext('2d')
                if (!context) throw new Error('Failed to get 2D context')
                this.ctx[index] = context
                this.ctx[index].drawImage(this.image[index], 0, 0)
                this.loaded++
                if (this.loaded === this.loadTotal) {
                    this.dataReady = true
                }
            })
        }
    }
}

export { EventImageImpl as EventImage }
