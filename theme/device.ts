import { Platform, Dimensions, StatusBar, PixelRatio } from 'react-native';
import DeviceInfo from 'react-native-device-info';

let HAS_NOTCH: boolean = DeviceInfo.hasNotch();
let HAS_HOME_INDICATOR = false;
let HOME_INDICATOR_HEIGHT = 0;

const deviceID = DeviceInfo.getDeviceId();
if (['iPhone12,1', 'iPhone12,3', 'iPhone12,5'].includes(deviceID)) {
    HAS_NOTCH = true;
    HOME_INDICATOR_HEIGHT = 20;
}

if (Platform.OS === 'ios' && HAS_NOTCH) {
    HAS_HOME_INDICATOR = true;
    HOME_INDICATOR_HEIGHT = 20;
}

const { height, width } = Dimensions.get('window');
const NAVBAR_HEIGHT = 44;

const getStatusBarHeight = () => {
    if (Platform.OS === 'ios') {
        return getIsLandscape() ? 0 : HAS_NOTCH ? 34 : 20;
    } else if (Platform.OS === 'android') {
        return StatusBar.currentHeight as number;
    }
    return getIsLandscape() ? 0 : 20;
};

const getIsLandscape = (): boolean => {
    return Dimensions.get('window').width > Dimensions.get('window').height;
};

//兼容global Device
export const Device = {
    WIDTH: width,
    HEIGHT: height,
    INNER_HEIGHT: height - HOME_INDICATOR_HEIGHT - NAVBAR_HEIGHT - getStatusBarHeight(),
    OS: Platform.OS,
    IOS: Platform.OS === 'ios',
    Android: Platform.OS === 'android',
    SystemVersion: DeviceInfo.getSystemVersion(),
    PixelRatio: PixelRatio.get(), // 获取屏幕分辨率
    PhoneNumber: DeviceInfo.getPhoneNumber(),
    UUID: DeviceInfo.getUniqueId(),
};

//兼容theme中的
export default {
    HAS_NOTCH,
    HAS_HOME_INDICATOR,
    HOME_INDICATOR_HEIGHT,
    NAVBAR_HEIGHT,
    BOTTOM_HEIGHT: HAS_HOME_INDICATOR ? 70 : 50,
    itemSpace: 14,
    minimumPixel: 1 / PixelRatio.get(), // 最小线宽

    isLandscape: getIsLandscape(),
    statusBarHeight: getStatusBarHeight(),
};
