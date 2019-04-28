import RoadItemComponent from "./RoadItemComponent";
import BackCarComponent from "./BackCarComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UnlimitMapComponent extends cc.Component {
    @property(cc.Node)
    private roadNode: cc.Node = null;

    @property(cc.Prefab)
    private carPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    private roadPrefab: cc.Prefab = null;

    private backComp: BackCarComponent
    protected onLoad(): void {
        this.backComp = this.getComponent(BackCarComponent);
        this.initRoad();
        this.initCar();
    }

    private readonly roadLength: number = 128 * 100;
    private readonly bufferLength: number = 128 * 6;
    private readonly viewLength: number = 128 * 4;
    private map: any[];
    private mapItems: cc.Node[];
    private initRoad(): void {
        this.map = [];
        this.mapItems = [];
        for (let i = 0; i < 100; ++i) {
            this.map.push(Math.floor(Math.random() * 100) % 3);
        }

        cc.log("roadNode.position: %s/%s", this.roadNode.position.toString(), this.roadNode.getParent().convertToWorldSpaceAR(this.roadNode.position).toString());
        for (let i = 0; i < 12; ++i) {
            let item = cc.instantiate(this.roadPrefab);
            this.roadNode.addChild(item);
            item.position = cc.Vec2.UP.mul(i * 128);
            item.getComponent(RoadItemComponent).refresh(i, this.map[i]);

            cc.log("Position: %s/%s", item.position.toString(), this.roadNode.convertToWorldSpaceAR(item.position).toString());
            this.mapItems.push(item);
        }
    }

    private initCar(): void {
        let car = cc.instantiate(this.carPrefab);
        this.roadNode.addChild(car);

        let followAct = cc.follow(car, null);
        this.roadNode.runAction(followAct);
        this.backComp.carNode = car;
    }

    private readonly intervalS: number = 0.05;
    private updateInterval: number = 0;
    protected update(dt: number): void {
        this.updateInterval += dt;
        if (this.updateInterval < this.intervalS) {
            return;
        }

        this.updateInterval = 0;

        let offset = 128 * this.mapItems.length;
        this.mapItems.forEach(el => {
            let viewPos = this.getPositionInMap(el);
            if (viewPos.y < -128 * 6) {
                el.y = el.y + offset;
                let itemComp = el.getComponent(RoadItemComponent);
                let id = itemComp.id + this.mapItems.length;
                itemComp.refresh(id, this.map[id]);
            }
        })
    }

    private getPositionInMap(item: cc.Node): cc.Vec2 {
        let worldPos = item.getParent().convertToWorldSpaceAR(item.position);
        return this.node.convertToNodeSpaceAR(worldPos);
    }
}
