import { NativeModules, Platform } from 'react-native';
// import { CodeIdSplash, CodeIdSplashIOS } from '@app/app.json';

const codeid = Platform.OS === 'ios' ? "" : "5090095206703228";

const adArgs = {
    tx_appid: "1110085230",
    tx_codeid: codeid,
};

const module = NativeModules.SplashTx;

export const loadSplashAd = () => {
    return module.loadSplashAd(adArgs);
};

export default { loadSplashAd };
