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
    }
    onEnable() {
        this.onEvent();
    }
    onDisable() {
        this.offEvent();
    }
    onEvent() {
        this.node.on("touchstart", this.touchStart, this);
        this.node.on("touchmove", this.touchMove, this);
        this.node.on("touchend", this.touchEnd, this);
    }
    offEvent() {
        this.node.off("touchstart", this.touchStart, this);
        this.node.off("touchmove", this.touchMove, this);
        this.node.off("touchend", this.touchEnd, this);
    }
    touchStart(e: cc.Event.EventTouch) {
        this.level.touchStart(e);
    }
    touchMove(e: cc.Event.EventTouch) {
        this.level.touchMove(e);
    }
    touchEnd(e: cc.Event.EventTouch) {
        this.level.touchEnd(e);
    }
    start() {
        this.ui.init();
        this.level.init();
    }
}
