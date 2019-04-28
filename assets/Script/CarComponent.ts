import InputComponent from "./InputComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CarComponent extends cc.Component {
    @property
    private readonly maxSpeed: number = 20;
    @property
    private readonly acctDelyValueS = 0.1;

    private speed: number = 0;
    private direction: cc.Vec2 = cc.Vec2.UP;

    private acctDelyCounterS: number;
    private tryRefreshSpeed(dt: number): void {
        this.acctDelyCounterS += dt;
        if (this.acctDelyCounterS < this.acctDelyValueS) {
            return;
        }

        this.acctDelyCounterS = 0;
        if (InputComponent.Instance.Acct && this.speed < this.maxSpeed) {
            this.speed += 1;
        }

        if (!InputComponent.Instance.Acct && this.speed > 0) {
            let s = this.speed - 1;
            this.speed = s > 0 ? s : 0;
        }
    }

    protected update(dt: number): void {
        this.tryRefreshSpeed(dt);
        if (this.speed != 0) {
            this.node.position = this.direction.mul(this.speed).add(this.node.position);
        }
    }
}