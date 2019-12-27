import { NativeModules, Platform } from 'react-native';
import { TTAppID, TTAppIDIOS } from '@app/app.json';
import { appStore as APP } from '@src/store';

//这里决策这个APP需要init的sdk...

export const init = () => {
    let { AdManager } = NativeModules;
    let appid = '';

    //如果设置了头条的
    if (APP.tt_appid) {
        appid = APP.tt_appid;
        AdManager.init({ appid });
    }

    //如果设置了腾讯的
    if (APP.tx_appid) {
        appid = APP.tx_appid;
        AdManager.initTx({ appid });
    }

    //如果设置了百度的
    if (APP.bd_appid) {
        appid = APP.bd_appid;
        AdManager.initBd({ appid });
    }

    if (appid === '') {
        //如果没有，默认用json里的
        appid = Platform.OS === 'ios' ? TTAppIDIOS : TTAppID;
        AdManager.init({ appid });
    }

};

export default { init };
