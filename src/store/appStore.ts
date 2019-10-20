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
    @observable enableAd: boolean = false; // 广告开关
    @observable enableWallet: boolean = false; // 钱包相关业务开关

    constructor() {
        NetInfo.addEventListener(this.handleConnectivityChange);
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
        if (config.ad === 'off') {
            this.enableAd = false;
        } else {
            this.enableAd = true;
        }

        if (config.wallet === 'off') {
            this.enableWallet = false;
        } else {
            console.log('asdasd setConfig');
            this.enableWallet = true;
        }
    }

    // 记录已查看的版本更新提示
    @action.bound
    async updateViewedVesion(viewedVersion) {
        await Storage.setItem(Keys.viewedVersion, viewedVersion);
    }
}

export default new App();
