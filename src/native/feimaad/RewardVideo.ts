import { NativeModules, DeviceEventEmitter, Platform } from 'react-native';
import {
    CodeIdRewardVideo,
    CodeIdRewardVideoIOS
} from '@app/app.json';

const codeid = Platform.OS === 'ios' ? CodeIdRewardVideoIOS : CodeIdRewardVideo;

//这个飞马 激励视频 是一个杭州的小公司，目前先简单测试

//TODO: 替换json或者后端json里的
const adArgs = {
    appid: '2079',
    codeid: '3119',
};


const module = NativeModules.RewardVideoFeiMa;

export const loadAd = (): Promise<string> => {
    return module.loadAd(adArgs);
};

export const startAd = (): Promise<string> => {
    return module.startAd(adArgs);
};

export default { startAd, loadAd, adArgs };
