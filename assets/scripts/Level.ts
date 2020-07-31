import EventSrever from "./EventServer";
import LoadServer from "./LoadServer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Level extends cc.Component {
    reportCard: cc.Label = null;
    score: number = 0;
    majorRegion: cc.Node = null;
    centreData: cc.Node[][] = [];
    prefabData: cc.Asset[] = null;
    init() {
        LoadServer.load("prefab", (err, data) => {
            if (err) {
                console.log(err);
            }
            this.prefabData = data;
            console.log(this.prefabData);
            if (this.prefabData) {
                this.node.active = true;
            } else {
                console.log("prefab load fail");
            }
            this.nihao();
        })
        this.score = 0;
        this.node.active = true;
    }

    onLoad() {
        this.reportCard = this.node.getChildByName("up").getChildByName("score").getComponent(cc.Label);
        this.majorRegion = this.node.getChildByName("centre");
        EventSrever.on(Events.nihao, this.nihao, this);
        EventSrever.on(21, this.nihao, this);
    }
    start() {
        this.resetScore();
    }
    resetScore() {
        this.reportCard.string = "分数: " + this.score;
    }
    nihao() {
        console.log("nihao! Level");
    }
    setButton() {
        EventSrever.send("set", 1);
    }
    skil_1() {

    }
    skil_2() {

    }
    skil_3() {

    }
    skil_4() {

    }
    skil_player() {

    }
}
enum Events {
    nihao = 0,
    tahao,
}