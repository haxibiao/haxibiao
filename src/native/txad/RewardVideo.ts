import { NativeModules, DeviceEventEmitter, Platform } from 'react-native';
import {
    CodeIdRewardVideo,
    CodeIdRewardVideoIOS
} from '@app/app.json';

const codeid = Platform.OS === 'ios' ? CodeIdRewardVideoIOS : CodeIdRewardVideo;

const adArgs = {
    tx_appid: '1110085230',
    tx_codeid: '7080992436522638',
};


const module = NativeModules.RewardVideoTx;

export const loadAd = (): Promise<string> => {
    return module.loadAd(adArgs);
};

export const startAd = (): Promise<string> => {
    return module.startAd(adArgs);
};

export default { startAd, loadAd, adArgs };
