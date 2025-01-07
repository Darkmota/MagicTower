// Extend Window interface for browser compatibility
interface Window {
    webkitRequestAnimationFrame?: (callback: FrameRequestCallback) => number
    mozRequestAnimationFrame?: (callback: FrameRequestCallback) => number
    msRequestAnimationFrame?: (callback: FrameRequestCallback) => number
}

declare class EventImage {
    canvas: HTMLCanvasElement[]
    dataReady: boolean
    loaded: number
    loadTotal: number
    load(data: any): void
}

// Temporary declarations for modules not yet converted
declare class Item {
    set(data: any): void
}

declare class Battler {
    dataReady: boolean
    loaded: number
    loadTotal: number
    load(data: any): void
}

declare class Events {
    set(data: any): void
    refresh(): void
}

declare class GameAudio {
    dataReady: boolean
    loaded: number
    loadTotal: number
    load(data: any): void
}

declare class MonsterBook {
    refresh(): void
}

declare class Wait {
    refresh(): void
}

declare class Hero {
    z: number
    set(data: any): void
    refresh(): void
}

declare class PlayerDataBox {
    refresh(): void
}

declare class BattleBox {
    refresh(): void
}

declare class MapMover {
    refresh(): void
}

declare class KeyboardListener {
    set(): void
    refresh(): void
}

declare class FpsWatcher {
    set(): void
    refresh(): void
}
