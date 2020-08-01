import EventSrever from "./EventServer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadServer extends cc.Component {
    static load(url: string, callBack: (err, data) => void) {
        EventSrever.send("loadStart");
        cc.resources.loadDir(url, (err, data) => {
            EventSrever.send("loadOver");
            callBack(err, data)
        });
    }
}
