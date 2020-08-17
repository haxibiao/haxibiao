import { observable, action, computed } from 'mobx';
import NetInfo from '@react-native-community/netinfo';
import { Keys, Storage } from './localStorage';
import AppJson from '!/app.json';

class AppStore {
    @observable viewportHeight: number = Device.HEIGHT;
    @observable deviceOffline: boolean = false;
    @observable connectionInfoType: Record<string, any> = {};
    @observable isFullScreen: boolean = false;
    @observable client: Record<string, any> = {};
    @observable echo: Record<string, any> = {};
    @observable modalIsShow: boolean = false;
    @observable tt_appid: string = Device.IOS ? AppJson.tt_appid_ios : AppJson.tt_appid; // 头条APPID
    @observable tx_appid: string = Device.IOS ? AppJson.tx_appid_ios : AppJson.tx_appid; // 腾讯APPID
    @observable bd_appid: string = Device.IOS ? AppJson.bd_appid_ios : AppJson.bd_appid; // 百度APPID

    @observable splash_provider: string = AppJson.splash_provider;
    @observable feed_provider: string = AppJson.feed_provider;
    @observable reward_video_provider: string = AppJson.reward_video_provider;

    @observable codeid_splash: string = Device.IOS ? AppJson.codeid_splash_ios : AppJson.codeid_splash;
    @observable codeid_splash_tencent: string = AppJson.codeid_splash_tencent;
    @observable codeid_splash_baidu: string = AppJson.codeid_splash_baidu;

    @observable codeid_feed: string = Device.IOS ? AppJson.codeid_feed_ios : AppJson.codeid_feed;
    @observable codeid_feed_tencent: string = AppJson.codeid_feed_tencent;
    @observable codeid_feed_baidu: string = AppJson.codeid_feed_baidu;

    @observable codeid_reward_video: string = Device.IOS
        ? AppJson.codeid_reward_video_ios
        : AppJson.codeid_reward_video;
    @observable codeid_reward_video_tencent: string = AppJson.codeid_reward_video_tencent; // 激励视频

    @observable codeid_draw_video: string = Device.IOS ? AppJson.codeid_draw_video_ios : AppJson.codeid_draw_video;
    @observable codeid_full_video: string = AppJson.codeid_full_video;

    @observable rewardCount: number = 0; // 激励视频的次数

    @observable enableAd: boolean = false; // 广告开关
    @observable enableWallet: boolean = true; // 钱包相关业务开关
    @observable createPostGuidance: boolean = true; // 用户引导,现在默认关闭
    @observable createUserAgreement: boolean = true; // 用户协议观看记录,默认已看

    @observable timeForLastAdvert: number = 0; // 最后一次广告播放事件
    @observable intervalForAdvert: number = 90000; // 广告间隔时间(毫秒)

    constructor() {
        NetInfo.addEventListener(this.handleConnectivityChange);
        this.recall();
    }

    @action.bound
    async recall() {
        // 现在默认关闭
        // this.createPostGuidance = await Storage.getItem(Keys.createPostGuidance);
        this.createUserAgreement = (await Storage.getItem(Keys.createUserAgreement)) || false;
        console.log('是否阅读用户：', this.createUserAgreement);
    }

    @action.bound
    handleConnectivityChange(connectionInfo: any) {
        this.connectionInfoType = connectionInfo.type;
        this.deviceOffline = connectionInfo.type === 'none';
    }

    @action.bound
    setEcho(echo: any) {
        this.echo = echo;
    }

    @action.bound
    setRewardCount(count: number) {
        this.rewardCount = count;
    }

    // 记录已查看的版本更新提示
    @action.bound
    async updateViewedVesion(viewedVersion: string) {
        await Storage.setItem(Keys.viewedVersion, viewedVersion);
    }

    changeResetVersion(version: string) {
        Storage.setItem(Keys.resetVersion, version);
    }

    @action.bound
    recordTimeForLastAdvert() {
        this.timeForLastAdvert = new Date().getTime();
    }

    @computed get adWaitingTime() {
        return this.intervalForAdvert - (new Date().getTime() - this.timeForLastAdvert);
    }

    @action.bound
    setAdDuration(duration: number) {
        this.intervalForAdvert = duration;
    }

    // @action.bound
    // showComment() {
    //     this.modalIsShow = true;
    // }
}

export default new AppStore();
