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
    lineCD: number = 13;
    listCD: number = 10;
    deleteNode: number[][] = [];
    detection: boolean = false;
    //节点池
    nodePool: cc.Node[][] = [];
    poolNum: number = 100;
    //预制键
    prefabData: cc.Prefab[] = null;
    //引擎回调*****************************************************************************************************************************
    onEnable() {
        this.reportCard = this.node.getChildByName("up").getChildByName("score").getComponent(cc.Label);
        this.majorRegion = this.node.getChildByName("centre");
    }
    start() {
        this.resetScore();
        this.initCentreData();
        this.detection = true;
    }
    update(dt) {
        this.updateCD();
        this.remove();
        this.padding();
    }

    //多次调用**********************************************************************************************************************
    updateCD() {
        if (this.detection) {
            for (let i = 0; i < this.lineCD; i++) {
                for (let j = 0; j < this.listCD; j++) {
                    let node = this.centreData[i][j];
                    if (j > 0 && j < this.centreData[i].length - 1) {
                        let node_1 = this.centreData[i][j - 1];
                        let node__1 = this.centreData[i][j + 1];
                        if (node_1 && node__1) {
                            if (node.name == node_1.name && node.name == node__1.name) {
                                this.deleteNode.push([i, j - 1], [i, j], [i, j + 1]);
                            }
                        }
                    }
                    if (i > 0 && i < this.centreData.length - 1) {
                        let node_1 = this.centreData[i - 1][j];
                        let node__1 = this.centreData[i + 1][j];
                        if (node_1 && node__1) {
                            if (node.name == node_1.name && node.name == node__1.name) {
                                this.deleteNode.push([i - 1, j], [i, j], [i + 1, j]);
                            }
                        }
                    }
                }
            }
        }
        this.detection = false;
    }
    remove() {
        while (this.deleteNode.length > 0) {
            let crood = this.deleteNode.pop();
            let node = this.centreData[crood[0]][crood[1]];
            this.centreData[crood[0]][crood[1]] = null;
            if (!!node) {
                this.formattingNode(node);
                this.poolPut(node, this.nodePool);
            } else {
                console.log("同一节点多次消除，存在重叠");
            }
        }
    }
    padding() {
        for (let i = 0; i < this.lineCD; i++) {
            for (let j = 0; j < this.listCD; j++) {
                if (!this.centreData[i][j]) {
                    for (let k = i + 1; k < this.lineCD; k++) {
                        if (!!this.centreData[k][j]) {
                            this.centreData[i][j] = this.centreData[k][j];
                            this.centreData[k][j] = null;
                            this.run(this.centreData[i][j], i - k,
                                () => {

                                });
                            break;
                        }
                    }
                    if (!this.centreData[i][j]) {
                        let node = this.poolGet(this.nodePool, this.randInt(0, 3), this.prefabData);
                        this.initNode(node, this.lineCD, j, this.majorRegion);
                        this.centreData[i][j] = node;
                        this.run(this.centreData[i][j], i - this.lineCD,
                            () => {

                            });
                    }
                }
            }
        }
        this.detection = true;
    }


    //初始化函数************************************************************************************************************************
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
    initpool(prefab: cc.Prefab, array: cc.Node[], num: number) {
        if (!!prefab) {
            for (let i = 0; i < num; i++) {
                let newnode = cc.instantiate(prefab);
                this.formattingNode(newnode);
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
    initCentreData() {
        for (let i = 0; i < this.lineCD; i++) {
            this.centreData.push([]);
            for (let j = 0; j < this.listCD; j++) {
                this.centreData[i].push(this.poolGet(this.nodePool, this.randInt(0, 3), this.prefabData));
                this.initNode(this.centreData[i][j], i, j, this.majorRegion);
            }
        }

    }



    //事件回调******************************************************************************************************************************
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


    //数据重置与格式化********************************************************************************************************************************
    reset() {
        this.score = 0;
    }
    resetScore() {
        this.reportCard.string = "分数: " + this.score;
    }
    /**
     * 格式化网格中的节点
     * @param node 格式化对象
     * @param i 对象在网格中的一级索引
     * @param j 对象在网格中的二级索引
     */
    initNode(node: cc.Node, i: number, j: number, praentNode: cc.Node) {
        node.parent = praentNode;
        node.setPosition(cc.v2((2 * j + 1) * 30, (2 * i + 1) * 30));
        node.active = true;
    }
    formattingNode(node: cc.Node) {
        node.active = false;
        node.setPosition(cc.v2(0, 0));
        node.parent = null;
    }

    //场景按键功能***************************************************************************************************************************
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


    //常用功能******************************************************************************************************************************
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
    poolGet(pool: cc.Node[][], num: number, prefab?: cc.Prefab[]): cc.Node {
        let node: cc.Node = null;
        if (pool[num].length > 0) {
            node = pool[num].pop();
        } else {
            if (!!prefab) {
                node = cc.instantiate(prefab[num]);
            } else {
                console.log("预制资源不存在，pool内无对象");
            }
        }
        this.formattingNode(node);
        return node;
    }
    poolPut(node: cc.Node, pool: cc.Node[][]) {
        for (let i = 0; i < pool.length; i++) {
            if (node.name == pool[i][0].name) {
                this.formattingNode(node);
                pool[i].push(node);

            }
        }
    }
    run(node: cc.Node, distance: number, callback: Function) {
        cc.tween(node)
            .by(Math.abs(distance) / 10, { position: cc.v3(0, 60 * distance, 0) })
            .call(() => { callback(); })
            .start();

    }
}
enum Events {
}