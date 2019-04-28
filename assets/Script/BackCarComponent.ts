const { ccclass, property } = cc._decorator;

@ccclass
export default class BackCarComponent extends cc.Component {
    @property(cc.Node)
    carNode: cc.Node = null;

    @property(cc.Sprite)
    private energy: cc.Sprite = null;

    @property(cc.Node)
    private targetPoint: cc.Node = null;

    private direction: cc.Vec2 = cc.Vec2.ZERO;
    protected onLoad(): void {
        this.energy.node.opacity = 0;

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this.direction = this.targetPoint.position.sub(this.node.position).normalizeSelf();
    }

    private readonly maxBackDistance = 100;
    private readonly maxDistance = 500;
    private readonly maxForceSeq = 20000;

    private moveDelta: cc.Vec2;
    private onTouchStart(event: cc.Event.EventTouch): void {
        this.moveDelta = cc.Vec2.ZERO;
        this.energy.fillRange = 0;
        this.energy.node.opacity = 255;
    }

    private ratio: number = 0;
    private onTouchMove(event: cc.Event.EventTouch): void {
        this.moveDelta.addSelf(event.touch.getDelta());

        this.ratio = this.moveDelta.magSqr() / this.maxForceSeq;
        this.energy.fillRange = this.ratio;
        this.refreshCarPosition(this.energy.fillRange);
    }

    private onTouchEnd(event: cc.Event.EventTouch): void {
        this.doMove();
    }

    private onTouchCancel(event: cc.Event.EventTouch): void {
        this.doMove();
    }

    private doMove(): void {
        this.energy.node.opacity = 0;
        let moveDistance = this.direction.mul(this.maxDistance).mul(this.energy.fillRange);
        // let moveAct = cc.moveTo(0.3, this.node.position.add(moveDistance)).easing(cc.easeCircleActionOut());
        let moveAct = cc.moveTo(0.3, this.node.position.add(moveDistance));

        this.carNode.runAction(moveAct);
    }

    private refreshCarPosition(force: number): void {
        let currentPos = this.carNode.position;
        this.carNode.position = currentPos.add(this.direction.mul(-1 * force * this.maxBackDistance));
    }
}
