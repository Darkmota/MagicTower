declare namespace MagicTower {
    interface MainJsonData {
        main: {
            tilesetData: string
            eventImageData: string
            battlerData: string
            itemData: string
            audioData: string
            mapData: string[]
            mapDataNum: number
            publicEventData: string
        }
    }

    interface PublicEventData {
        publicEvent: any
    }

    interface ItemData {
        item: any
    }

    interface TilesetData {
        tileset: Array<{
            tilesetSrc: string;
        }>;
        tilesetNum: number;
    }

    interface BattlerData {
        battler: any[][];
        battlerNum: number;
    }

    interface AudioData {
        audio: any[];
        audioNum: number;
    }

    interface MapData {
        land: any
    }
}

export = MagicTower
