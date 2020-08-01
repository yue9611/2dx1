import EventSrever from "./EventServer";
import LoadServer from "./LoadServer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Level extends cc.Component {
    reportCard: cc.Label = null;
    score: number = 0;
    //主要操作显示区
    majorRegion: cc.Node = null;
    //数据存储库
    centreData: cc.Node[][] = [];
    //节点池
    nodePool: cc.Node[][] = [];
    poolNum: number = 100;
    //预制键
    prefabData: cc.Prefab[] = null;
    init() {
        //预制资源加载，完成后显示节点
        LoadServer.load("prefab", (err, data) => {
            if (err) {
                console.log(err);
            }
            this.prefabData = data;
            if (this.prefabData) {
                this.initPoolT(this.prefabData, this.nodePool);
                this.node.active = true;
            } else {
                console.log("prefab load fail");
            }
        })
        this.reset();
    }
    //数据重置
    reset() {
        this.score = 0;
    }
    initpool(prefab: cc.Prefab, array: cc.Node[], num: number) {
        if (!!prefab) {
            for (let i = 0; i < num; i++) {
                let newnode = cc.instantiate(prefab);
                newnode.active = false;
                array.push(newnode);
            }
        }
    }
    initPoolT(prefabs: cc.Prefab[], array: cc.Node[][]) {
        for (let i = 0, leng = prefabs.length; i < leng; i++) {
            array.push([]);
            this.initpool(this.prefabData[i], array[i], this.poolNum);
        }
    }
    onEnable() {
        this.reportCard = this.node.getChildByName("up").getChildByName("score").getComponent(cc.Label);
        this.majorRegion = this.node.getChildByName("centre");
    }
    start() {
        this.resetScore();
    }
    touchStart(e: cc.Event.EventTouch) {
        let fcrood = e.getLocation();
        console.log(fcrood);
        console.log(this.majorRegion.convertToNodeSpaceAR(fcrood));
    }
    touchMove(e) {
        console.log("sttt");
    }
    touchEnd(e) {

    }
    resetScore() {
        this.reportCard.string = "分数: " + this.score;
    }
    setButton() {
        console.log("setBUtton");
    }
    skil_1() {
        console.log("skil_1");
    }
    skil_2() {
        console.log("skil_2");
    }
    skil_3() {
        console.log("skil_3");
    }
    skil_4() {
        console.log("skil_4");
    }
    skil_player() {
        console.log("skil_player");
    }
    /**
     * 返回一个包含最大最小值在内的随机整数
     * @param min 可返回的最小范围
     * @param max 可返回的最大范围
     */
    randInt(min: number, max: number): number {
        if (min - Math.floor(min) != 0) {
            min = Math.floor(min) + 1;
        }
        if (max - Math.floor(max) != 0) {
            max = Math.floor(max);
        }
        let num = Math.floor((max - min + 1) * Math.random()) + min;
        return num;
    }
}
enum Events {
}