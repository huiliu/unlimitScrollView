const { ccclass, property } = cc._decorator;

@ccclass
export default class DragComponent extends cc.Component {
    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    private onTouchStart(event: cc.Event.EventTouch): void {
    }

    private onTouchMove(event: cc.Event.EventTouch): void {
        let delta = event.touch.getDelta();
        delta.x = 0;
        this.node.position = this.node.position.add(delta);
        cc.log("node.position: %s, worldposition: %s",
            this.node.position.toString(),
            this.node.getParent().convertToWorldSpaceAR(this.node.position).toString());
    }

    private onTouchEnd(event: cc.Event.EventTouch): void {

    }

    private onTouchCancel(event: cc.Event.EventTouch): void {

    }
}
