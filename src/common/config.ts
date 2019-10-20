import { Platform } from 'react-native';
// import DeviceInfo from 'react-native-device-info';
import Config from 'react-native-config';
import {
    AppID,
    DisplayName as AppName,
    AppSlogan,
    Build,
    ServerRoot,
    UploadServer,
    Version,
    AppVersionNumber,
    AndroidOnline,
    iOSOnline
} from '@app/app.json';

let AppStore = Config && Config.APP_STORE ? Config.APP_STORE : 'haxibiao'; //应用商店名称

// let AppVersionNumber = DeviceInfo.getVersion().split('');
// AppVersionNumber.splice(3, 1);
// AppVersionNumber = parseFloat(AppVersionNumber.join('')); //app vesrsion 数值

export default {
    ServerRoot,
    UploadServer,
    AppName,
    AppVersion: `${Version}.${Build}`,
    AppID,
    AppSlogan,
    Version,
    Build,
    AppStore,
    AppVersionNumber,
    AndroidOnline,
    iOSOnline,
    goldAlias: '智慧点',
    qqGroup: '692035916',
};
