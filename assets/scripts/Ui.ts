// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventSrever from "./EventServer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ui extends cc.Component {
    home: cc.Node = null;
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
    onload() {
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
        this.loading.active = true;
        this.step = this.load;
        console.log("load start");
    }
    loadOver() {
        this.loading.active = false;
        this.step = () => { };
        console.log("load over");
    }
    updata(dt) {
        this.time += dt;
        if (this.time >= 1) {
            this.time--;
        }
        this.step();
    }
}
