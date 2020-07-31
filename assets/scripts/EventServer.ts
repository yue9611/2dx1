

const { ccclass, property } = cc._decorator;

@ccclass
export default class EventSrever extends cc.Component {
    static eventData = {};
    static on(type: string | number, func: Function, tager: Object) {
        if (this.eventData[type] != null) {
            let flag = 0;
            for (let i = 0, leng = this.eventData[type].callBack.length; i < leng; i++) {
                if (this.eventData[type].callBack[i].tager == tager) {
                    flag++;
                }
            }
            if (flag == 0) {
                this.eventData[type].callBack.push({ func: func, tager: tager, });
            }else{
                console.log("注册事件重复，请检查");
            }
        } else {
            this.eventData[type] = new EventData;
            this.eventData[type].type = type;
            this.eventData[type].callBack.push({ func: func, tager: tager, });
        }
    }
    static send(type: string | number, data?: any) {
        // for (let i = 0, leng = this.eventData.length; i < leng; i++) {
        let event = this.eventData[type];
        if (type === event.type) {
            for (let j = 0, lengF = event.callBack.length; j < lengF; j++) {
                event.callBack[j].func.call(event.callBack[j].tager, data);
            }
        }
        // }
    }
}
class EventData {
    type: string | number = null;
    callBack: {
        func: Function;
        tager: Object;
    }[] = [];
}