interface PublicEventData {
    // Add properties based on actual data structure
    [key: string]: any
}

export class PublicEvent {
    private ready: boolean = false
    private data: PublicEventData | null = null

    constructor() {}

    public set(publicEventData: PublicEventData): void {
        this.data = publicEventData
        this.ready = true
    }
}
