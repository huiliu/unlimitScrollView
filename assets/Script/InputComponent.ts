const { ccclass, property } = cc._decorator;

@ccclass
export default class InputComponent extends cc.Component {
    private static instance: InputComponent = null;
    static get Instance(): InputComponent {
        return InputComponent.instance;
    }

    protected onLoad(): void {
        InputComponent.instance = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    private accurate: boolean;
    get Acct(): boolean {
        return this.accurate;
    }

    private onKeyDown(event: cc.Event.EventKeyboard): void {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                this.accurate = true;
                break;
            default:
                break;
        }
    }

    private onKeyUp(event: cc.Event.EventKeyboard): void {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                this.accurate = false;
                break;
            default:
                break;
        }
    }
}