import { NativeModules, Platform } from 'react-native';
import {
    CodeIdFullVideo,
    CodeIdFullVideoIOS
} from '@app/app.json';

const codeid = Platform.OS === 'ios' ? CodeIdFullVideoIOS : CodeIdFullVideo;

const adArgs = {
    tt_appid: '', //不需要外部传入了
    tt_codeid: codeid,
};

const module = NativeModules.FullScreenVideo;

export const loadFullScreenVideoAd = (): Promise<string> => {
    return module.loadAd(adArgs);
};

export const startFullScreenVideoAd = () => {
    return module.startAd(adArgs);
};

export default { loadFullScreenVideoAd, startFullScreenVideoAd };
