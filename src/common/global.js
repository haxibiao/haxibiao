import { Dimensions, PixelRatio, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import _ from 'lodash';
import config from './config';
import theme from './theme';
import * as Helper from './helper';

const { height, width } = Dimensions.get('window');

const Global = global || window || {};

const device = {
    WIDTH: width,
    HEIGHT: height,
    INNER_HEIGHT: height - theme.HOME_INDICATOR_HEIGHT - theme.NAVBAR_HEIGHT - theme.statusBarHeight,
    OS: Platform.OS,
    IOS: Platform.OS === 'ios',
    Android: Platform.OS === 'android',
    SystemVersion: DeviceInfo.getSystemVersion(),
    PixelRatio: PixelRatio.get(), // 获取屏幕分辨率
    PhoneNumber: DeviceInfo.getPhoneNumber(),
    UUID: DeviceInfo.getUniqueId(),
    
};
// 设备信息
Global.Device = device;
// App主题
Global.Theme = theme;
// 适配字体
Global.Font = Helper.FontSize;
// 屏幕适配
Global.PxDp = Helper.PxDp;
// helper
Global.Helper = Helper;
// App配置
Global.Config = config;
// 用户token
Global.TOKEN = null;
// lodash
Global.__ = _;
// toast
Global.Toast = () => null;
