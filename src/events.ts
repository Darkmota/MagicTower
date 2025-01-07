/*
events.data: 记录events.data
events.ready: 记录是否即时刷新所有事件的动画和执行step
events.touching: 记录目前触发的事件
events.step: 记录事件触发处理的当前步骤
events.waiting: 停止当前事件触发的处理，一般为等待当前事件步骤的结束
                一般来说。触发事件的瞬间，waiting为true，处理完毕后，waiting变为false

events.set(mapData): 从Mapxxx.json得来的mapData中获取事件信息
events.getTouch(event): 设定当前主角开始触发的事件
events.refresh(): 刷新事件动画，执行step（如果waiting为false）
events.eventFind(): 返回地图位置的事件
events.eventRun(): 处理当前step，更改step位置
events.next() jump(int) run(int): step的自增，赋值，增减

touching.imageSrc =string
touching.faceto =int

touching.x =int
touching.y =int
touching.evpau[3] =true
        .rate =int
        .faceto =int;

touching.evpau[0] =boolean
touching.evpau[1] =boolean
*/

import { GameEvents, GameEvent } from './types/global.js'

interface EventData extends GameEvent {
    evpau: boolean[]
    imageSrc: number
    xyffr: number[]
    list: any[][]
}

export { EventsImpl as Events }
export class EventsImpl implements GameEvents {
    public data: EventData[] = []
    private image: HTMLImageElement[] = []
    public ready: boolean = false
    public touching: EventData | null = null
    private step: number = 0
    public waiting: boolean = false
    public select: number | false = false

    public set(data: GameEvent[]): void {
        this.data = data.map(event => ({
            ...event,
            evpau: event.evpau || [],
            imageSrc: event.imageSrc || 0,
            xyffr: event.xyffr || [],
            list: event.list || []
        })) as EventData[]
        this.ready = true
        const firstEvent = this.eventFindByName("firstThing")
        if (firstEvent) this.getTouch(firstEvent)
    }

    public getTouch(event: GameEvent): void {
        if (!event) return
        const eventData = this.data.find(e => e.x === event.x && e.y === event.y)
        if (!eventData || this.touching || !eventData.evpau[0]) return
        console.warn(eventData)
        this.touching = eventData
        this.step = 0
    }

    public refresh(): void {
        if (!this.ready) return
        for (let i = 0; i < this.data.length; ++i) {
            if (this.data[i].evpau[0] && this.data[i].evpau[1]) {
                if (this.data[i].evpau[3]) {
                    ctx.drawImage(
                        mainEventImage.canvas[this.data[i].imageSrc],
                        (Math.floor(frameCount / this.data[i].xyffr[4]) + this.data[i].xyffr[2]) % 4 * 32,
                        this.data[i].xyffr[3] * 32,
                        32, 32,
                        64 + this.data[i].xyffr[0] * 32,
                        32 + this.data[i].xyffr[1] * 32,
                        32, 32
                    )
                } else {
                    ctx.drawImage(
                        mainEventImage.canvas[this.data[i].imageSrc],
                        this.data[i].xyffr[2] * 32,
                        this.data[i].xyffr[3] * 32,
                        32, 32,
                        64 + this.data[i].xyffr[0] * 32,
                        32 + this.data[i].xyffr[1] * 32,
                        32, 32
                    )
                }
            }
        }
        if (this.touching !== null && !this.waiting) {
            if (this.touching.evpau[4]) {
                if (this.step < mainPublicEvent.data[this.touching.publicEventName!].length) {
                    this.eventRun(this.step)
                } else {
                    this.touching = null
                }
            } else {
                if (this.step < this.touching.list.length) {
                    this.eventRun(this.step)
                } else {
                    this.touching = null
                }
            }
        }
    }

    public eventFind(x: number, y: number): GameEvent | null {
        for (let i = 0; i < this.data.length; ++i) {
            const event = this.data[i] as EventData
            if (event.xyffr[1] === y && event.xyffr[0] === x) {
                event.x = event.xyffr[0]
                event.y = event.xyffr[1]
                return event
            }
        }
        return null
    }

    public eventFindByName(name: string): GameEvent | null {
        for (const event of this.data) {
            const eventData = event as EventData
            if (eventData && eventData.name === name) {
                eventData.x = eventData.xyffr[0]
                eventData.y = eventData.xyffr[1]
                return eventData
            }
        }
        return null
    }

    public eventFindById(id: number): GameEvent | null {
        for (const event of this.data) {
            const eventData = event as EventData
            if (eventData && eventData.id === id) {
                eventData.x = eventData.xyffr[0]
                eventData.y = eventData.xyffr[1]
                return eventData
            }
        }
        return null
    }

    public eventRun(step: number): void {
        if (!this.touching) return

        const event = this.touching.evpau[4]
            ? mainPublicEvent.data[this.touching.publicEventName!][this.step]
            : this.touching.list[this.step]

        console.log(step + ":", event)
        
        switch (event[0]) {
            case "playSE":
                mainAudio.playSE(event[1])
                this.next()
                break

            case "stopBGM":
                mainAudio.stopBGM()
                this.next()
                break

            case "playBGM":
                mainAudio.playBGM(event[1])
                this.next()
                break

            case "teleport":
                if (event[1] === mainHero.z || event[1] === "self") {
                    console.log(event[1], mainHero.z)
                    mainHero.x = event[2]
                    mainHero.y = event[3]
                } else {
                    mainMapMover.set(50, event[1], event[2], event[3])
                }
                this.next()
                break

            case "jump":
                this.jump(event[1])
                break

            case "textBox": {
                const newBox = new textBox(32, 272, 416, 96)
                if (event[2]) {
                    newBox.talker = event[1]
                    newBox.set(event[2])
                } else {
                    newBox.set(event[1])
                }
                if (mainBox) {
                    let b = mainBox
                    while (b.include) {
                        b = b.include
                    }
                    b.include = newBox
                } else {
                    mainBox = newBox
                }
                this.next()
                break
            }

            case "dependTextBox": {
                const newBox = new textBox(32, 176, 416, 96, true)
                newBox.set(event[1])
                if (mainBox) {
                    let b = mainBox
                    while (b.include) {
                        b = b.include
                    }
                    b.include = newBox
                } else {
                    mainBox = newBox
                }
                this.next()
                break
            }

            case "systemMessageBox":
                addDownMessage(event[1])
                this.next()
                break

            case "selectionBox":
                if (this.select === false) {
                    const newBox = new selectionBox(32, 272, 416, 96)
                    console.log(event, event.slice(2, 2 + event[1]))
                    newBox.set(event[1], event.slice(2, 2 + event[1]))
                    if (mainBox) {
                        let b = mainBox
                        while (b.include) {
                            b = b.include
                        }
                        b.include = newBox
                    } else {
                        mainBox = newBox
                    }
                } else {
                    this.jump(event[this.select + event[1] + 2])
                    this.select = false
                }
                break

            case "battle":
                mainBattleBox.set(event[1])
                this.next()
                break

            case "Azreal":
                if (mainHero.hp <= 0) {
                    const newBox = new textBox(32, 272, 416, 96)
                    newBox.talker = "作者"
                    newBox.set("如果这是在真正的冒险里，你已经翘了，但现在这里是体验中心，没关系接着玩去吧~\\n(其实是因为有些人会卡关导致看不到后面的内容所以直接删掉了死亡事件)")
                    if (mainBox) {
                        let b = mainBox
                        while (b.include) {
                            b = b.include
                        }
                        b.include = newBox
                    } else {
                        mainBox = newBox
                    }
                }
                this.next()
                break

            case "assign": {
                const leftType = event[1].charAt(0)
                const _left = event[1].substring(1)
                let leftValue = 0
                const rightType = event[3].charAt(0)
                const _right = event[3].substring(1)
                let rightValue = 0

                switch (leftType) {
                    case "v":
                        leftValue = mainGlobal[_left]
                        break
                    case "i":
                        leftValue = mainHero.bag[_left] === undefined ? 0 : mainHero.bag[_left]
                        break
                    case "h":
                        leftValue = mainHero.hp
                        break
                    case "a":
                        leftValue = mainHero.atk
                        break
                    case "d":
                        leftValue = mainHero.def
                        break
                    case "g":
                        leftValue = mainHero.gold
                        break
                    case "e":
                        leftValue = mainHero.exp
                        break
                    default:
                        try {
                            leftValue = eval(event[1])
                        } catch(exception) {
                            console.warn(exception)
                        }
                }

                switch (rightType) {
                    case "v":
                        rightValue = mainGlobal[_right]
                        break
                    case "i":
                        rightValue = mainHero.bag[_right] === undefined ? 0 : mainHero.bag[_right]
                        break
                    case "h":
                        rightValue = mainHero.hp
                        break
                    case "a":
                        rightValue = mainHero.atk
                        break
                    case "d":
                        rightValue = mainHero.def
                        break
                    case "g":
                        rightValue = mainHero.gold
                        break
                    case "e":
                        rightValue = mainHero.exp
                        break
                    default:
                        rightValue = parseInt(event[3])
                }

                switch (event[2]) {
                    case "=":
                        leftValue = rightValue
                        break
                    case "+=":
                        leftValue += rightValue
                        break
                    case "-=":
                        leftValue -= rightValue
                        break
                    case "*=":
                        leftValue *= rightValue
                        break
                    case "/=":
                        leftValue /= rightValue
                        break
                }

                switch (leftType) {
                    case "v":
                        mainGlobal[_left] = leftValue
                        break
                    case "i":
                        mainHero.bag[_left] = leftValue
                        break
                    case "h":
                        mainHero.hp = leftValue
                        break
                    case "a":
                        mainHero.atk = leftValue
                        break
                    case "d":
                        mainHero.def = leftValue
                        break
                    case "g":
                        mainHero.gold = leftValue
                        break
                    case "e":
                        mainHero.exp = leftValue
                        break
                }
                this.next()
                break
            }

            case "getItem":
                if (event[2] >= 0) {
                    const message = "获得了" + event[2] + mainItem.data[event[1]][1]
                    addDownMessage(message)
                } else {
                    const message = "失去了" + (-event[2]) + mainItem.data[event[1]][1]
                    addDownMessage(message)
                }
                mainHero.bag[event[1]] += event[2]
                this.next()
                break

            case "if": {
                const leftType = event[1].charAt(0)
                const _left = event[1].substring(1)
                let leftValue = 0
                const rightType = event[3].charAt(0)
                const _right = event[3].substring(1)
                let rightValue = 0
                let bool = false

                switch (leftType) {
                    case "v":
                        leftValue = mainGlobal[_left]
                        break
                    case "i":
                        leftValue = mainHero.bag[_left] === undefined ? 0 : mainHero.bag[_left]
                        break
                    case "h":
                        leftValue = mainHero.hp
                        break
                    case "a":
                        leftValue = mainHero.atk
                        break
                    case "d":
                        leftValue = mainHero.def
                        break
                    case "g":
                        leftValue = mainHero.gold
                        break
                    case "e":
                        leftValue = mainHero.exp
                        break
                    default:
                        leftValue = eval(event[1])
                }

                switch (rightType) {
                    case "v":
                        rightValue = mainGlobal[_right]
                        break
                    case "i":
                        rightValue = mainHero.bag[_right] === undefined ? 0 : mainHero.bag[_right]
                        break
                    case "h":
                        rightValue = mainHero.hp
                        break
                    case "a":
                        rightValue = mainHero.atk
                        break
                    case "d":
                        rightValue = mainHero.def
                        break
                    case "g":
                        rightValue = mainHero.gold
                        break
                    case "e":
                        rightValue = mainHero.exp
                        break
                    default:
                        rightValue = event[3]
                }

                switch (event[2]) {
                    case ">":
                        bool = leftValue > rightValue
                        break
                    case ">=":
                        bool = leftValue >= rightValue
                        break
                    case "==":
                        bool = leftValue === rightValue
                        break
                    case "<=":
                        bool = leftValue <= rightValue
                        break
                    case "<":
                        bool = leftValue < rightValue
                        break
                    default:
                        bool = false
                }

                if (bool) {
                    this.next()
                } else {
                    this.jump(event[4])
                }
                break
            }

            case "setFace": {
                if (!event[1] || !event[2]) {
                    console.warn('Invalid setFace event:', event)
                    this.next()
                    break
                }
                if (event[1] === "self") {
                    if (this.touching && (this.touching as EventData).xyffr) {
                        (this.touching as EventData).xyffr[3] = event[2]
                    }
                } else {
                    const targetEvent = this.data[event[1]] as EventData
                    if (targetEvent && targetEvent.xyffr) {
                        targetEvent.xyffr[3] = event[2]
                    }
                }
                this.next()
                break
            }

            case "wait":
                mainWait.set(event[1])
                this.next()
                break

            case "suicide":
                this.touching.evpau[0] = false
                if (this.touching.evpau[4]) {
                    this.step = mainPublicEvent.data[this.touching.publicEventName!].length
                } else {
                    this.step = this.touching.list.length
                }
                break

            case "escape":
                if (this.touching.evpau[4]) {
                    this.step = mainPublicEvent.data[this.touching.publicEventName!].length
                } else {
                    this.step = this.touching.list.length
                }
                break

            default:
                try {
                    eval(event[1])
                } catch(exception) {
                    console.warn(exception)
                }
                this.next()
                break
        }
    }

    public next(): void {
        this.step += 1
    }

    public jump(target: number): void {
        this.step = target
    }

    public run(variation: number): void {
        this.step += variation
    }
}
