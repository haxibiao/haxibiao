import { observable, action } from 'mobx';

class LiveStore {
    @observable showlivemodal: {
        change: boolean;
        flag: boolean;
    } = { change: false, flag: false };

    @observable dankamu: { name: string; message: string }[] = [];
    @observable hot: number = 0;
    @observable count_audience = 0;
    @observable joinRoomEcho: any = null;
    @observable roomidForOnlinePeople: string = '';
    @observable streamerLeft: boolean = false;
    @observable onlinePeople: {
        user_id: number;
        user_name: string;
        user_avatar: string;
    }[] = [];

    @action.bound
    public setonlinepeople(
        people: {
            user_id: number;
            user_name: string;
            user_avatar: string;
        }[],
    ) {
        this.onlinePeople = [...people];
    }

    @action.bound
    public setStreamerLeft(left: boolean) {
        this.streamerLeft = left;
    }

    @action.bound
    public setroomidForOnlinePeople(id: string) {
        this.roomidForOnlinePeople = id;
    }

    @action.bound
    public setJoinRoomEcho(echo: any) {
        this.joinRoomEcho = echo;
    }
    @action.bound
    public setHot(hot: number) {
        this.hot = hot;
    }
    @action.bound
    public setCountAudience(count: number) {
        this.count_audience = count;
    }

    @action.bound
    public setshowlivemodal(show: boolean) {
        this.showlivemodal = { change: true, flag: show };
    }
    @action.bound
    public closelivemodaltower() {
        this.showlivemodal.change = false;
    }
    @action.bound
    public setDankamu(dankamu: { name: string; message: string }[]) {
        this.dankamu = [...dankamu];
        this.hot = dankamu.length;
    }
    @action.bound
    public pushDankamu(dankamu: { name: string; message: string }) {
        const temp = this.dankamu;
        temp.push(dankamu);
        this.dankamu = [...temp];
        this.hot = temp.length;
    }
    @action.bound
    public clearDankamu() {
        this.dankamu = [];
    }
}

export default new LiveStore();
