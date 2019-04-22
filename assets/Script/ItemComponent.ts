const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemComponent extends cc.Component {
    @property(cc.Label)
    private textLabel: cc.Label = null;

    get id(): any {
        return this.data.id;
    }

    private data: any;
    refresh(data: any): void {
        this.data = data;
        this.textLabel.string = data.id.toString();
    }
}