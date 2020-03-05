import { NativeModules, DeviceEventEmitter, Platform } from 'react-native';
import { CodeIdRewardVideo, CodeIdRewardVideoIOS, CodeIdFullVideo, CodeIdFullVideoIOS } from '@app/app.json';
import { appStore, userStore } from '@src/store';
import AdManager from './AdManager';
import { track } from '@src/common';

// 激励视频

let codeid = '';
let codeidFull = '';

const module = NativeModules.RewardVideo;
const moduleFullVideo = NativeModules.FullScreenVideo;

// 后端全屏视频的配置
const { codeid_full_video } = appStore;
if (codeid_full_video !== '') {
    codeidFull = codeid_full_video;
}

if (codeidFull === '') {
    // 默认最后的情况用json里的
    codeidFull = Platform.OS === 'ios' ? CodeIdFullVideoIOS : CodeIdFullVideo;
}

// 加载所有激励视频紧急备用
export const loadAllAd = () => {
    return module.loadAllAd();
};

interface Props {
    intervalTime: number;
}

export const loadAd = (props?: Props) => {
    appStore.setRewardCount(appStore.rewardCount + 1);
    // 每3个激励视频混入1个全屏视频填充间隔
    if (appStore.rewardCount % 3 === 0) {
        // 这个时候加载的应该是全屏视频，加载错了，降低展示率，影响CPM
        return moduleFullVideo.loadAd({ codeid: codeidFull });
    }

    // 刷新一遍AD配置
    fetchAdConfig();

    // 后端加载的配置
    const { codeid_reward_video, reward_video_provider } = appStore;
    if (codeid_reward_video !== '') {
        codeid = codeid_reward_video;
    }

    if (codeid === '') {
        // 默认最后的情况用json里的
        codeid = Platform.OS === 'ios' ? CodeIdRewardVideoIOS : CodeIdRewardVideo;
    }
    return module.loadAd({ provider: reward_video_provider, codeid });
};

export const startAd = () => {
    // 开始播放广告 并记录广告播放时间
    appStore.recordTimeForLastAdvert();
    // 后端加载的配置
    const { codeid_reward_video, reward_video_provider } = appStore;
    if (codeid_reward_video !== '') {
        codeid = codeid_reward_video;
    }
    if (codeid === '') {
        // 默认最后的情况用json里的
        codeid = Platform.OS === 'ios' ? CodeIdRewardVideoIOS : CodeIdRewardVideo;
    }

    // 每3个激励视频混入1个全屏视频，填充间隔
    if (appStore.rewardCount % 3 === 0) {
        return moduleFullVideo.startAd({ codeid: codeidFull });
    }
    return module.startAd({ provider: reward_video_provider, codeid });
};

const fetchAdConfig = () => {
    const { token } = userStore.me;
    const uri =
        Config.ServerRoot + '/api/ad-config?api_token=' + token + '&os=' + Platform.OS + '&store=' + Config.AppStore;
    console.log('adconfig uri:', uri);
    fetch(uri, {
        headers: {
            os: Platform.OS,
            store: Config.AppStore,
        },
    })
        .then(response => response.json())
        .then(result => {
            // 1.保存AD配置(appid,codeid等)
            console.log('ad config', result);
            appStore.setConfig(result);

            // 2.再init一遍(允许这时候切换AD配置)
            AdManager.init();
        })
        .catch(err => {
            console.log('fetchAdConfig err', err);
        });
};

export const checkResult = (result: any): boolean => {
    const errMsg = result.toString();
    if (errMsg) {
        //102006	没有匹配到合适的广告。禁止重试，否则可能触发系统策略导致流量收益下降
        let content = errMsg;
        let action = '其他异常';
        if (errMsg.indexOf('102006') !== -1) {
            // me.hideAdOneDay();
            content = '暂无匹配您的激励视频';
            action = '腾讯激励视频无广告';
        }
        Toast.show({
            content,
        });
        track({
            data: {
                category: '激励视频',
                action,
                value: errMsg,
            },
        }); // 数据上报
        // console.log('checkResult 数据上报');
        return false;
    }
    return true;
};

export default { loadAllAd, loadAd, startAd, fetchAdConfig, checkResult };
