/// <reference types="jquery" />

declare module '*.json' {
    const value: any
    export default value
}

declare global {
  // Canvas and rendering context
  var canvas: HTMLCanvasElement
  var ctx: CanvasRenderingContext2D
  var windowWidth: number
  var windowHeight: number

  // Game state and counters
  var frameCount: number
  var keysDown: { [key: number]: boolean }

  // Game systems and managers
  var mainEvents: GameEvents
  var mainLand: Land
  var mainAudio: AudioSystem
  var mainHero: Hero
  var mainBattler: Battler
  var mainBox: TextBox | SelectionBox | null
  var mainAutoBox: any[]
  var mainEventImage: EventImage
  var mainTileset: Tileset
  var mainPublicEvent: PublicEvent
  var mainWait: Wait
  var mainMonsterBook: MonsterBook
  var mainMapMover: MapMover
  var mainPlayerDataBox: PlayerDataBox
  var mainBattleBox: BattleBox
  var mainKeyboardListener: KeyboardListener
  var mainFpsWatcher: FpsWatcher
  var mainItem: Item

  // Game data
  var mainGlobal: any[]
  var memoryMap: any[]

  // Declare global functions
  function drawBox(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, alpha: number): void
  function drawTextInBox(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, w: number, h: number, alpha: number): void
  function imgLoadWith(img: HTMLImageElement, index: number, callback: (img: HTMLImageElement, index: number) => void): void
  function addDownMessage(message: string): void
  function jb(value: number, min: number, max: number): number

  // Extend Window interface
  interface Window {
    AudioContext: typeof AudioContext
    webkitAudioContext: typeof AudioContext
    requestAnimationFrame: (callback: FrameRequestCallback) => number
  }

  // Add index signature to globalThis
  interface GlobalThis {
    [key: string]: any
  }
}

// Basic interfaces
export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface GameConfig {
  tileSize: number
  mapWidth: number
  mapHeight: number
}

// Game interfaces
export interface Hero {
  ready: boolean
  x: number
  y: number
  z: number
  movable: boolean
  faceto: number
  hp: number
  atk: number
  def: number
  gold: number
  exp: number
  bag: number[]
  data: any
  set(data: any): void
  refresh(): void
  go_up(): void
  go_down(): void
  go_left(): void
  go_right(): void
}

interface TextBox {
    talker: string
    include: TextBox | null
    set(text: string): void
    input?(direction: string): void
}

interface SelectionBox {
    include: SelectionBox | null
    set(count: number, options: any[]): void
    input?(direction: string): void
}

interface BattleBox {
    set(enemyId: number): void
    refresh(): void
    active?: boolean
}

interface Item {
    data: any[][]
    set(data: any): void
    refresh(): void
}

declare global {
    var mainBattleBox: BattleBox
    var mainItem: Item
    var mainBox: TextBox | SelectionBox | null
    class textBox implements TextBox {
        constructor(x: number, y: number, width: number, height: number, depend?: boolean)
        talker: string
        include: TextBox | null
        set(text: string): void
    }
    class selectionBox implements SelectionBox {
        constructor(x: number, y: number, width: number, height: number)
        include: SelectionBox | null
        set(count: number, options: any[]): void
    }
}

export interface GameEvent {
    evpau: boolean[]  // [触发条件, 是否已触发, 是否可通过]
    x: number
    y: number
    id?: number
    name?: string
    imageSrc?: number
    xyffr?: number[]
    list?: any[][]
    publicEventName?: string
}

export interface GameEvents {
    waiting: boolean
    select: number | false
    touching: GameEvent | null
    data: GameEvent[]
    ready: boolean
    set(data: GameEvent[]): void
    getTouch(event: GameEvent): void
    eventFind(x: number, y: number): GameEvent | null
    eventFindByName(name: string): GameEvent | null
    eventFindById(id: number): GameEvent | null
    eventRun(step: number): void
    refresh(): void
    next(): void
    jump(target: number): void
    run(variation: number): void
}

export interface AudioSystem {
  load(data: any): void
  playSE(id: number): void
  playBGM(id: number): void
  stopBGM(): void
  dataReady: boolean
  buffer: any[]
  loadTotal: number
  loaded: number
}

export interface Land {
  set(data: any): void
  data: any
  canPass(x: number, y: number): boolean
  refresh(): void
}

export interface Battler {
    data: any[][]
    loaded: number
    loadTotal: number
    dataReady: boolean
    canvas: HTMLCanvasElement[]
    image: HTMLImageElement[]
    load(battlerData: { battler: any[][], battlerNum: number }): void
    damageCalculate(enemyId: number): [number, string, number]
}

export interface PublicEvent {
  data: any
  ready: boolean
  set(data: any): void
}

export interface Wait {
  ready: boolean
  set(countdown: number): void
  refresh(): void
}

export interface MonsterBook {
  ready: boolean
  set(): void
  refresh(): void
}

export interface MapMover {
  ready: boolean
  set(countdown: number, mapId: number, x: number, y: number): void
  refresh(): void
}

export interface EventImage {
    loaded: number
    loadTotal: number
    dataReady: boolean
    data: any[][]
    image: HTMLImageElement[]
    canvas: HTMLCanvasElement[]
    load(eventImageData: { image: any[][], imageNum: number }): void
}

export interface Tileset {
  changeTileset(id: number): void
  dataReady: boolean
  loaded: number
  loadTotal: number
  load(data: any): void
  refresh(): void
}

export interface PlayerDataBox {
  ready: boolean
  set(): void
  refresh(): void
}

export interface FpsWatcher {
  set(): void
  refresh(): void
}
