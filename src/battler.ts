import { Battler } from './types/global.js'

interface BattlerData {
    battler: any[][]
    battlerNum: number
}

class BattlerImpl implements Battler {
    public loaded: number = 0
    public loadTotal: number = Infinity
    public dataReady: boolean = false
    public data: any[][] = []
    public image: HTMLImageElement[] = []
    public canvas: HTMLCanvasElement[] = []
    private ctx: CanvasRenderingContext2D[] = []

    public load(battlerData: BattlerData): void {
        this.loaded = 0
        this.loadTotal = Infinity
        this.dataReady = false
        this.image = []
        this.canvas = []
        this.ctx = []
        this.data = battlerData.battler
        this.loadTotal = battlerData.battlerNum

        for (let i = 0; i < this.loadTotal; ++i) {
            this.image[i] = new Image()
            this.image[i].src = this.data[i][7]
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

    public damageCalculate(enemyId: number): [number, string, number] {
        const eId = this.data[enemyId][0]
        const eName = this.data[enemyId][1].split(':')[0]
        const eHp = this.data[enemyId][2]
        const eAtk = this.data[enemyId][3]
        const eDef = this.data[enemyId][4]
        const eGold = this.data[enemyId][5]
        const eExp = this.data[enemyId][6]
        let burn = 0

        switch (Number(this.data[enemyId][1].split(':')[1])) {
            case 1:
                burn = 100
                break
            case 2:
                burn = 300
                break
            case 3:
                burn = Math.floor(mainHero.hp/4)
                break
            case 4:
                burn = Math.floor(mainHero.hp/3)
                break
        }

        let turn = 0
        const htoe = (mainHero.atk > eDef ? mainHero.atk - eDef : 0)
        const etoh = (mainHero.def < eAtk ? eAtk - mainHero.def : 0)

        if (htoe > 0 && etoh > 0) {
            turn = Math.floor((eHp - 1) / htoe) + 1
            const damage = (turn - 1) * etoh + burn
            if ((turn - 1) * etoh < mainHero.hp) {
                return [0, `怪物将对你造成${damage}点伤害 你出手${turn}次`, damage]
            } else {
                return [-1, `怪物将对你造成${damage}点伤害 你来不及出手${turn}次`, damage]
            }
        } else if (htoe > 0 && etoh === 0) {
            return [1, '怪物对你没有任何威胁', burn]
        } else if (etoh > 0) {
            return [-2, '你对怪物没有任何威胁', 9999999]
        } else {
            return [-2, '永无休止的战斗', 9999999]
        }
    }
}

export { BattlerImpl as Battler }
