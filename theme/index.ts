import { Platform, Dimensions, StatusBar, PixelRatio } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import colors from './colors';

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

export default {
    ...colors,
    HAS_NOTCH,
    HAS_HOME_INDICATOR,
    HOME_INDICATOR_HEIGHT,
    NAVBAR_HEIGHT: 44,
    BOTTOM_HEIGHT: HAS_HOME_INDICATOR ? 70 : 50,
    itemSpace: 14,
    minimumPixel: 1 / PixelRatio.get(), // 最小线宽

    get isLandscape(): boolean {
        return Dimensions.get('window').width > Dimensions.get('window').height;
    },

    get statusBarHeight(): number {
        if (Platform.OS === 'ios') {
            return this.isLandscape ? 0 : HAS_NOTCH ? 34 : 20;
        } else if (Platform.OS === 'android') {
            return StatusBar.currentHeight as number;
        }
        return this.isLandscape ? 0 : 20;
    },
};
