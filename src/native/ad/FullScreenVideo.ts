import { NativeModules, Platform } from 'react-native';
import {
    CodeIdFullVideo,
    CodeIdFullVideoIOS
} from '@app/app.json';
import { appStore } from '@src/store';

//全屏视频

let codeid = '';

//后端加载的配置
let { codeid_full_video } = appStore;
if (codeid_full_video != '') {
    codeid = codeid_full_video;
}
if (codeid === '') {
    //默认最后的情况用json里的
    codeid = Platform.OS === 'ios' ? CodeIdFullVideoIOS : CodeIdFullVideo;
}

const module = NativeModules.FullScreenVideo;
export const loadAd = (): Promise<string> => {
    return module.loadAd({ codeid });
};
export const startAd = () => {
    return module.startAd({ codeid });
};

export default { loadAd, startAd };
