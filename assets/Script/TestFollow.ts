const { ccclass, property } = cc._decorator;

@ccclass
export default class TestFollow extends cc.Component {
    @property(cc.Node)
    private followed: cc.Node = null;

    protected onLoad(): void {
        let followAct = cc.follow(this.followed, null);
        this.node.runAction(followAct);
    }
}
