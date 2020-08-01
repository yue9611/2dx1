
const { ccclass, property } = cc._decorator;

@ccclass
export default class EventSrever extends cc.Component {
    static eventData: { [key: string]: EventData } = {};
    static on(type: string | number, func: Function, tager: Object) {
        if (this.eventData[type] != null) {
            let flag = 0;
            for (let i = 0, leng = this.eventData[type].callBack.length; i < leng; i++) {
                if (this.eventData[type].callBack[i].tager == tager) {
                    if (this.eventData[type].callBack[i].func == func) {
                        flag++;
                        console.log("警告！ 同事件同节点想要注册多次一个相同回调函数，已拒绝。");
                    } else {
                        console.log("警告！ 同事件同节点注册了两个不同的回调函数，允许注册。");
                    }
                }
            }
            if (flag == 0) {
                this.eventData[type].callBack.push({ func: func, tager: tager, });
            }
        } else {
            this.eventData[type] = new EventData;
            this.eventData[type].type = type;
            this.eventData[type].callBack.push({ func: func, tager: tager, });
        }
    }
    static off(type: string | number, func: Function, tager: Object) {
        let event = this.eventData[type];
        if (!!event) {
            for (let i = event.callBack.length - 1; i >= 0; i--) {
                if (event.callBack[i].tager == tager && event.callBack[i].func == func) {
                    event.callBack.splice(i, 1);
                }
            }
            if (event.callBack.length == 0) {
                delete this.eventData[type];
            }
        } else {
            console.log("事件未注册");
        }
    }
    static send(type: string | number, data?: any) {
        let event = this.eventData[type];
        if (!!event) {
            for (let i = 0, lengF = event.callBack.length; i < lengF; i++) {
                event.callBack[i].func.call(event.callBack[i].tager, data);
            }
        } else {
            console.log("事件未注册");
        }
    }
}
class EventData {
    type: string | number = null;
    callBack: {
        func: Function;
        tager: Object;
    }[] = [];
}