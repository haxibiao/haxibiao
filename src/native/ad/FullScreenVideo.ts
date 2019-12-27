import { NativeModules, Platform } from 'react-native';
import {
    CodeIdFullVideo,
    CodeIdFullVideoIOS
} from '@app/app.json';
import { appStore as APP } from '@src/store';

//全屏视频

let codeid = '';

//后端加载的配置
let { codeidRewardVideo, RewardVideoProvider } = APP;
if (codeidRewardVideo != '') {
    codeid = codeidRewardVideo;
}

if (codeid === '') {
    //默认最后的情况用json里的
    codeid = Platform.OS === 'ios' ? CodeIdFullVideoIOS : CodeIdFullVideo;
}

const module = NativeModules.FullScreenVideo;
export const loadFullScreenVideoAd = (): Promise<string> => {
    return module.loadAd({ provider: RewardVideoProvider, codeid });
};
export const startFullScreenVideoAd = () => {
    return module.startAd({ provider: RewardVideoProvider, codeid });
};

export default { loadFullScreenVideoAd, startFullScreenVideoAd };
