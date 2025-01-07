import { Item } from './types/global.js'

export class ItemImpl implements Item {
    public ready: boolean = false
    public data: any[][] = []

    constructor() {}

    public set(itemData: any[][]): void {
        this.data = itemData
        this.ready = true
    }

    public refresh(): void {
        // Required by interface
    }
}

export { ItemImpl as Item }
