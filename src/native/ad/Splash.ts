import { NativeModules, Platform } from 'react-native';
import { CodeIdSplash, CodeIdSplashIOS } from '@app/app.json';
import { appStore as APP } from '@src/store';

//开屏广告
export const loadSplashAd = () => {
    let codeid = '';

    //后端加载的配置
    let { codeidSplash, SplashProvider } = APP;
    if (codeidSplash != '') {
        codeid = codeidSplash;
    }

    if (codeid === '') {
        //默认最后的情况用json里的
        codeid = Platform.OS === 'ios' ? CodeIdSplashIOS : CodeIdSplash;
    }

    // let adArgs = { provider: '腾讯', codeid: '2020496591997995' };
    let adArgs = { provider: SplashProvider, codeid };
    return NativeModules.Splash.loadSplashAd(adArgs);
};

export default { loadSplashAd };
