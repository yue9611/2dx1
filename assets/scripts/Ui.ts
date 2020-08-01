
import EventSrever from "./EventServer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ui extends cc.Component {
    //主界面
    home: cc.Node = null;
    //加载界面
    loading: cc.Node = null;
    loadingWord: cc.Label = null;
    time: number = 0;
    step: Function = (dt: number) => { };
    init() {
        this.home = this.node.getChildByName("home");
        this.loading = this.node.getChildByName("loading");
        this.loadingWord = this.loading.getChildByName("loading").getComponent(cc.Label);
        EventSrever.on("loadStart", this.loadStart, this);
        EventSrever.on("loadOver", this.loadOver, this);
        this.reset();
        this.node.active = true;
    }
    onEnable() {
        this.home.active = true;
        this.loading.active = false;
        this.step = this.homeing;
    }
    reset() {
        this.home.active = false;
        this.loading.active = false;
        this.loadingWord.string = "load";
        this.time = 0;
    }
    load() {
        console.log("load");
    }
    homeing() {
        console.log("home");
    }
    loadStart() {
        this.reset();
        this.loading.active = true;
        this.step = this.load;
        console.log("load start");
    }
    loadOver() {
        this.reset();
        this.loading.active = false;
        this.step = () => { };
        this.node.active = false;
        console.log("load over");
    }
    update(dt) {
        this.time += dt;
        if (this.time >= 1) {
            this.time--;
        }
        this.step();
    }
}
