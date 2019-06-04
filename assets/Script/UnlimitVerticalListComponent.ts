import ItemComponent from "./ItemComponent";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.ScrollView)
export default class UnlimitVerticalListComponent extends cc.Component {

    @property
    private totoalCount: number = 20;

    @property
    private itemPadding: number = 5;

    @property
    private itemHeight: number = 145;

    @property(cc.Prefab)
    private itemPrefab: cc.Prefab = null;

    @property
    private bufferWidth: number = 200;

    private scrollView: cc.ScrollView;
    private scrollContent: cc.Node;
    protected onLoad(): void {
        this.scrollView = this.getComponent(cc.ScrollView);
        this.scrollContent = this.scrollView.content;

        this.initialize();
    }

    setContentHeight(h: number): void {
        this.scrollContent.height = h;
    }

    private items: any[];
    private scrollItems: cc.Node[];
    initialize(): void {
        let h = (this.itemHeight + this.itemPadding) * this.totoalCount - this.itemPadding;
        this.setContentHeight(h);

        this.items = [];
        for (let i = 0; i < this.totoalCount; ++i) {
            this.items.push({ id: i });
        }

        this.scrollItems = [];
        let count = Math.floor(this.bufferWidth * 2 /(this.itemPadding + this.itemHeight) + 0.5);
        for (let i = 0; i < count; ++i) {
            let item = cc.instantiate(this.itemPrefab);
            this.scrollContent.addChild(item);
            item.y = (this.itemHeight + this.itemPadding) * i + this.itemHeight * 0.5;
            item.getComponent(ItemComponent).refresh(this.items[i]);

            this.scrollItems.push(item);
        }
    }

    private lastContentPosY = -10000;

    private static readonly kUpdateIntervalS = 0.05;
    private updateTimer: number = 0;
    protected update(dt: number): void {
        this.updateTimer += dt;
        if (this.updateTimer < UnlimitVerticalListComponent.kUpdateIntervalS) {
            return;
        }
        this.updateTimer = 0;

        let offset = (this.itemPadding + this.itemHeight) * this.scrollItems.length;
        let downForward = this.scrollContent.y < this.lastContentPosY;
        this.lastContentPosY = this.scrollContent.y;
        this.scrollItems.forEach((item, id, arr) => {
            let viewPosition = this.getPositionInView(item);
            if (downForward) {
                if (viewPosition.y < -this.bufferWidth && item.y + offset < this.scrollContent.height) {
                    item.y = item.y + offset;
                    let comp = item.getComponent(ItemComponent);
                    let ii = comp.id + this.scrollItems.length;
                    comp.refresh(this.items[ii]);
                }
            } else {
                if (viewPosition.y > this.bufferWidth && item.y - offset > 0) {
                    item.y = item.y - offset;
                    let comp = item.getComponent(ItemComponent);
                    let ii = comp.id - this.scrollItems.length;
                    let data = this.items[ii];
                    comp.refresh(data);
                }
            }
        });
    }

    private getPositionInView(item: cc.Node): cc.Vec2 {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        return this.scrollView.node.convertToNodeSpaceAR(worldPos);
    }
}