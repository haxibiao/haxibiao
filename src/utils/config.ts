import { Platform } from 'react-native';
// import DeviceInfo from 'react-native-device-info';
import Config from 'react-native-config';
import {
    name as Name,
    AppID,
    DisplayName as AppName,
    AppSlogan,
    Build,
    ServerRoot,
    UploadServer,
    Version,
    AppVersionNumber,
    AndroidOnline,
    iOSOnline,
    goldAlias,
    limitAlias,
    qqGroup,
    appStoreUrl,
    WechatAppId,
} from '!/app.json';

let AppStore = Config && Config.APP_STORE ? Config.APP_STORE : 'haxibiao'; //应用商店名称

// let AppVersionNumber = DeviceInfo.getVersion().split('');
// AppVersionNumber.splice(3, 1);
// AppVersionNumber = parseFloat(AppVersionNumber.join('')); //app vesrsion 数值

export default {
    ServerRoot,
    UploadServer,
    Name,
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
    goldAlias: goldAlias || '金币',
    limitAlias: limitAlias || '活跃值',
    qqGroup: qqGroup || '692035916',
    iosAppStoreUrl: appStoreUrl || 'itms-apps://itunes.apple.com/app/id1434767781',
    WechatAppId,
};
