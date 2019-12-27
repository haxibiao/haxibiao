import { NativeModules, DeviceEventEmitter, Platform } from 'react-native';
import {
    CodeIdRewardVideo,
    CodeIdRewardVideoIOS
} from '@app/app.json';
import { appStore } from '@src/store';
import AdManager from './AdManager';

//激励视频

let codeid = '';

const module = NativeModules.RewardVideo;

export const loadAd = () => {
    //刷新一遍AD配置
    fetchAdConfig();

    //后端加载的配置
    let { codeidRewardVideo, RewardVideoProvider } = appStore;
    if (codeidRewardVideo != '') {
        codeid = codeidRewardVideo;
    }

    if (codeid === '') {
        //默认最后的情况用json里的
        codeid = Platform.OS === 'ios' ? CodeIdRewardVideoIOS : CodeIdRewardVideo;
    }
    return module.loadAd({ provider: RewardVideoProvider, codeid });
};

export const startAd = () => {
    //后端加载的配置
    let { codeidRewardVideo, RewardVideoProvider } = appStore;
    if (codeidRewardVideo != '') {
        codeid = codeidRewardVideo;
    }

    if (codeid === '') {
        //默认最后的情况用json里的
        codeid = Platform.OS === 'ios' ? CodeIdRewardVideoIOS : CodeIdRewardVideo;
    }
    console.log('reward video startad:', { provider: RewardVideoProvider, codeid });
    return module.startAd({ provider: RewardVideoProvider, codeid });
};

const fetchAdConfig = () => {
    fetch(Config.ServerRoot + '/api/ad-config?os=' + Platform.OS + "&store=" + Config.AppStore, {
        headers: {
            os: Platform.OS,
            store: Config.AppStore
        },
    })
        .then(response => response.json())
        .then(result => {
            //1.保存AD配置(appid,codeid等)
            console.log('ad config', result);
            appStore.setConfig(result);

            //2.再init一遍(允许这时候切换AD配置)
            AdManager.init();
        })
        .catch(err => {
            console.log('fetchAdConfig err', err);
        });
};

export default { loadAd, startAd, fetchAdConfig };
