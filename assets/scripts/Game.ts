import Ui from "./Ui";
import Level from "./Level";
import EventSrever from "./EventServer";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    ui: Ui = null;
    level: Level = null;
    onLoad() {
        this.ui = this.node.getChildByName("ui").getComponent(Ui);
        this.level = this.node.getChildByName("level").getComponent(Level);
        EventSrever.on("23", this.nihao, this);
    }
    start() {
        this.ui.init();
        this.level.init();
    }
    nihao() {
        console.log("nihao!Game");
    }
    
}
