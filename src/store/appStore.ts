import { observable, action, computed } from 'mobx';
import NetInfo from '@react-native-community/netinfo';
import { act } from 'react-test-renderer';

import { Keys, Storage } from './localStorage';

class App {
    @observable viewportHeight: number = Device.HEIGHT;
    @observable deviceOffline: boolean = false;
    @observable connectionInfoType: Record<string, any> = {};
    @observable isFullScreen: boolean = false;
    @observable client: Record<string, any> = {};
    @observable echo: Record<string, any> = {};
    @observable modalIsShow: boolean = false;
    @observable tt_appid: string = ''; // 头条APPID
    @observable tx_appid: string = ''; // 腾讯APPID
    @observable bd_appid: string = ''; // 百度APPID

    @observable splash_provider: string = ''; // 开屏类型
    @observable feed_provider: string = ''; // 信息流类型
    @observable reward_video_provider: string = ''; // 激励视频类型

    @observable codeid_splash: string = ''; // 开屏
    @observable codeid_splash_toutiao: string = ''; // 开屏
    @observable codeid_splash_tencent: string = ''; // 开屏
    @observable codeid_splash_baidu: string = ''; // 开屏

    @observable codeid_feed: string = ''; // 信息流
    @observable codeid_feed_toutiao: string = ''; // 信息流
    @observable codeid_feed_tencent: string = ''; // 信息流
    @observable codeid_feed_baidu: string = ''; // 信息流

    @observable codeid_reward_video: string = ''; // 激励视频
    @observable codeid_reward_video_toutiao: string = ''; // 激励视频
    @observable codeid_reward_video_tencent: string = ''; // 激励视频

    @observable codeid_draw_video: string = ''; // 竖屏视频
    @observable codeid_full_video: string = ''; // 全屏视频
    @observable rewardCount: number = 0; // 激励视频的次数

    @observable enableAd: boolean = false; // 广告开关
    @observable enableWallet: boolean = false; // 钱包相关业务开关
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
        this.createUserAgreement = await Storage.getItem(Keys.createUserAgreement) || false;
        console.log('是否阅读用户：',this.createUserAgreement);
        
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

    @action.bound
    setConfig(config: any) {
        this.enableAd = config.ad !== 'off';
        this.enableWallet = config.wallet !== 'off';

        // 广告 APPID
        this.tt_appid = config.tt_appid ? config.tt_appid : '';
        this.tx_appid = config.tx_appid ? config.tx_appid : '';
        this.bd_appid = config.bd_appid ? config.bd_appid : '';

        // 广告 各种广告当前联盟配置
        this.splash_provider = config.splash_provider ? config.splash_provider : '';
        this.feed_provider = config.feed_provider ? config.feed_provider : '';
        this.reward_video_provider = config.reward_video_provider ? config.reward_video_provider : '';

        // 广告 代码位配置
        this.codeid_splash = config.codeid_splash ? config.codeid_splash : '';
        this.codeid_splash_tencent = config.codeid_splash_tencent ? config.codeid_splash_tencent : '';
        this.codeid_splash_baidu = config.codeid_splash_baidu ? config.codeid_splash_baidu : '';
        this.codeid_feed = config.codeid_feed ? config.codeid_feed : '';
        this.codeid_feed_tencent = config.codeid_feed_tencent ? config.codeid_feed_tencent : '';
        this.codeid_feed_baidu = config.codeid_feed_baidu ? config.codeid_feed_baidu : '';
        this.codeid_draw_video = config.codeid_draw_video ? config.codeid_draw_video : '';
        this.codeid_reward_video = config.codeid_reward_video ? config.codeid_reward_video : '';
        this.codeid_reward_video_tencent = config.codeid_reward_video_tencent ? config.codeid_reward_video_tencent : '';
        this.codeid_full_video = config.codeid_full_video ? config.codeid_full_video : '';
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
    setAdDuration(duration:number) {
        this.intervalForAdvert = duration;
    }
}

export default new App();
