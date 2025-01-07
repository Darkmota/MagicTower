import { imgLoad } from './function.js';

interface TilesetData {
    tileset: Array<{
        tilesetSrc: string;
    }>;
    tilesetNum: number;
}

export class Tileset {
    public loaded: number = 0;
    public loadTotal: number = Infinity;
    public dataReady: boolean = false;
    private data: Array<{tilesetSrc: string}> | null = null;
    private image: HTMLImageElement[] = [];
    private mapctx: CanvasRenderingContext2D | null = null;
    private canvas: HTMLCanvasElement | null = null;

    constructor() {}

    public load(tilesetData: TilesetData): void {
        this.loaded = 0;
        this.loadTotal = Infinity;
        this.dataReady = false;
        this.data = null;
        this.image = [];
        this.mapctx = null;
        this.canvas = null;
        this.data = tilesetData.tileset;
        this.loadTotal = tilesetData.tilesetNum;
        
        for (let i = 0; i < this.loadTotal; ++i) {
            this.image[i] = new Image();
            this.image[i].src = this.data[i].tilesetSrc;
            imgLoad(this.image[i], (img: HTMLImageElement) => {
                this.loaded++;
                if (this.loaded === this.loadTotal) {
                    this.dataReady = true;
                }
            });
        }
    }

    public changeTileset(id: number): void {
        if (!this.canvas) {
            this.canvas = document.createElement("canvas");
            this.mapctx = this.canvas.getContext("2d");
        }
        if (this.mapctx && this.image[id]) {
            this.canvas.width = this.image[id].width;
            this.canvas.height = this.image[id].height;
            this.mapctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.mapctx.drawImage(this.image[id], 0, 0);
        }
    }
}
