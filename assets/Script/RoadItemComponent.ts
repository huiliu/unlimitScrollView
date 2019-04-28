const { ccclass, property } = cc._decorator;

export enum RoadType {
    Asphalt,
    Dirt,
    Sand,
}

@ccclass
export default class RoadItemComponent extends cc.Component {
    @property([cc.Sprite])
    private roadSprites: cc.Sprite[] = [];

    @property([cc.SpriteFrame])
    private asphaltSprites: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    private dirtSprites: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    private sandSprites: cc.SpriteFrame[] = [];

    id: any;
    refresh(id: any, type: RoadType): void {
        this.id = id;
        let spriteFrames = this.getSpriteFramesByType(type);
        for (let i = 0; i < spriteFrames.length; ++i) {
            this.roadSprites[i].spriteFrame = spriteFrames[i];
        }
    }

    private getSpriteFramesByType(type: RoadType): any {
        switch (type) {
            case RoadType.Asphalt:
                return this.asphaltSprites;
            case RoadType.Dirt:
                return this.dirtSprites;
            case RoadType.Sand:
                return this.sandSprites;
            default:
                cc.error("unknow roadType: [%s]", type);
                return this.sandSprites;
        }
    }
}