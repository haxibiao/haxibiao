import { observable, action, computed } from 'mobx';
import NetInfo from '@react-native-community/netinfo';
import { Keys, Storage } from './localStorage';
import AppJson from '!/app.json';

class AppStore {
    /**
     **********************
     *  直播相关
     **********************
     */
    //是否有足够的权限开启直播( 麦克风，摄像头 )
    @observable public sufficient_permissions: boolean = false;

    @observable viewportHeight: number = Device.HEIGHT;
    @observable deviceOffline: boolean = false;
    @observable connectionInfoType: Record<string, any> = {};
    @observable isFullScreen: boolean = false;
    @observable client: Record<string, any> = {};
    @observable echo: Record<string, any> = {};
    @observable modalIsShow: boolean = false;
    @observable createPostGuidance: boolean = true; // 用户引导,现在默认关闭
    @observable createUserAgreement: boolean = true; // 用户协议观看记录,默认已看

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

    // 更新 sufficent_permissions
    @action.bound
    public AppSetSufficientPermissions(sufficient: boolean) {
        this.sufficient_permissions = sufficient;
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

    // @action.bound
    // showComment() {
    //     this.modalIsShow = true;
    // }
}

export default new AppStore();
