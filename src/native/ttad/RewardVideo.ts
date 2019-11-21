import { NativeModules, DeviceEventEmitter, Platform } from 'react-native';
import {
    CodeIdRewarVideo,
    CodeIdRewarVideoIOS
} from '@app/app.json';

const codeid = Platform.OS === 'ios' ? CodeIdRewarVideoIOS : CodeIdRewarVideo;

const adArgs = {
    tt_appid: '', //不需要传入了
    tt_codeid: codeid,
    rewardname: '精力',
    rewardamount: 6,
    uid: Date.now(),
};


const module = NativeModules.RewardVideo;

export const loadAd = (): Promise<string> => {
    return module.loadAd(adArgs);
};

export const startAd = (): Promise<string> => {
    return module.startAd(adArgs);
};

export default { startAd, loadAd, adArgs };
