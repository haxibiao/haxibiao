import { observable, action, runInAction } from 'mobx';
import NetInfo from '@react-native-community/netinfo';
import { act } from 'react-test-renderer';

import { Keys, Storage } from './localStorage';

class App {
    @observable viewportHeight: number = Device.HEIGHT;
    @observable deviceOffline: boolean;
    @observable connectionInfoType: string;
    @observable isFullScreen: boolean = false;
    @observable client: Object = {};
    @observable echo: Object = {};
    @observable modalIsShow: boolean = false;
    @observable tt_appid: string = ''; //头条APPID
    @observable tx_appid: string = ''; //腾讯APPID
    @observable bd_appid: string = ''; //百度APPID

    @observable SplashProvider: string = ''; //开屏类型
    @observable BannerProvider: string = ''; //Banner类型
    @observable FeedProvider: string = ''; //信息流类型
    @observable DrawVideoProvider: string = ''; //竖屏视频类型
    @observable RewardVideoProvider: string = ''; //激励视频类型

    @observable codeidSplash: string = ''; //开屏
    @observable codeidBanner: string = ''; //Banner
    @observable codeidFeed: string = ''; //信息流
    @observable codeidDrawVideo: string = ''; //竖屏视频
    @observable codeidRewardVideo: string = ''; //激励视频
    @observable codeidFullVideo: string = ''; //全屏视频

    @observable enableAd: boolean = false; // 广告开关
    @observable enableWallet: boolean = false; // 钱包相关业务开关
    @observable createPostGuidance: boolean = true; // 用户引导,现在默认关闭

    constructor() {
        NetInfo.addEventListener(this.handleConnectivityChange);
        this.recall();
    }

    @action.bound
    async recall() {
        // 现在默认关闭
        // this.createPostGuidance = await Storage.getItem(Keys.createPostGuidance);
    }

    @action.bound
    handleConnectivityChange(connectionInfo) {
        this.connectionInfoType = connectionInfo.type;
        this.deviceOffline = connectionInfo.type === 'none';
    }

    @action.bound
    setEcho(echo) {
        this.echo = echo;
    }

    @action.bound
    setConfig(config) {
        this.enableAd = config.ad !== 'off';
        this.enableWallet = config.wallet !== 'off';

        //广告 APPID
        this.tt_appid = config.tt_appid ? config.tt_appid : '';
        this.tx_appid = config.tx_appid ? config.tx_appid : '';
        this.bd_appid = config.bd_appid ? config.bd_appid : '';

        //广告 各种广告当前联盟配置
        this.SplashProvider = config.splash_prodiver ? config.splash_prodiver : '';
        this.BannerProvider = config.banner_prodiver ? config.banner_prodiver : '';
        this.FeedProvider = config.feed_prodiver ? config.feed_prodiver : '';
        this.DrawVideoProvider = config.draw_video_prodiver ? config.draw_video_prodiver : '';
        this.RewardVideoProvider = config.reward_video_prodiver ? config.reward_video_prodiver : '';

        //广告 代码位配置
        this.codeidSplash = config.codeid_splash ? config.codeid_splash : '';
        this.codeidBanner = config.codeid_banner ? config.codeid_banner : '';
        this.codeidFeed = config.codeid_feed ? config.codeid_feed : '';
        this.codeidDrawVideo = config.codeid_draw_video ? config.codeid_draw_video : '';
        this.codeidRewardVideo = config.codeid_reward_video ? config.codeid_reward_video : '';
        this.codeidFullVideo = config.codeid_full_video ? config.codeid_full_video : '';
    }

    // 记录已查看的版本更新提示
    @action.bound
    async updateViewedVesion(viewedVersion) {
        await Storage.setItem(Keys.viewedVersion, viewedVersion);
    }

    changeResetVersion(version: string) {
        Storage.setItem(Keys.resetVersion, version);
    }
}

export default new App();
