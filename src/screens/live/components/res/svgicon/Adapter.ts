import { PixelRatio } from 'react-native';
import DeviceInfo from 'react-native-device-info';

/**
 * iPhone 全屏机型，底部危险区域高度为 34px
 * */
export class Adapter {
    static shared: Adapter = new Adapter();

    BottomUnsafeAreaPadding: number = 0; //底部导航危险区域高度

    constructor() {
        this.init();
    }

    private init() {
        let hasNotch = DeviceInfo.hasNotch();
        this.BottomUnsafeAreaPadding = hasNotch ? 34 : 0;
    }

    // 默认是采用dp , 这里将dp转换成px

    px(want_dp: number) {
        return PixelRatio.getPixelSizeForLayoutSize(want_dp);
    }
    // 将px转成dp

    dp(want_px: number) {
        let fontscale = PixelRatio.getFontScale();
        let out = (1.0 / fontscale) * want_px;
        return out;
    }
}
