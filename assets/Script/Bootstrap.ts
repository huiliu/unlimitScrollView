import RandomMap from "./Logic/RandomMap";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bootstrap extends cc.Component {
    protected onLoad(): void {
        let map = new RandomMap(50, 50);
        map.generate();
        console.log(map.toString());
    }
}