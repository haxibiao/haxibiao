import { PixelRatio, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const basePx = Platform.OS === 'ios' ? 375 : 360;

export function NumberFormat(value: any) {
    const num: number = parseFloat(value);
    if (num >= 1000) {
        return Math.round(Number((num / 1000).toFixed(2)) * 10) / 10 + 'k';
    } else {
        return num || 0;
    }
}

// time Format
export function TimeFormat(second) {
    let h = 0,
        i = 0,
        s = parseInt(second);
    if (s > 60) {
        i = parseInt(s / 60);
        s = parseInt(s % 60);
    }
    // 补零
    const zero = function(v) {
        return v >> 0 < 10 ? '0' + v : v;
    };
    return [zero(h), zero(i), zero(s)].join(':');
}

// 分辨率适配
// PixelDensity等于2
// android：物理分辨率720*1080  逻辑分辨率360pt*540pt
// iPhone6：物理分辨率750*1334  逻辑分辨率375pt*667pt
export const PxDp = function(px: number): number {
    const adaptivePx = (px / basePx) * width;
    return PixelRatio.roundToNearestPixel(adaptivePx);
};

// 文字适配
export const FontSize = (size: number): number => {
    if (PixelRatio.get() === 2) {
        // iphone 5s and older Androids
        if (width < 360) {
            return size * 0.95;
        }
        // iphone 5
        if (height < 667) {
            return size;
            // iphone 6-6s
        } else if (height >= 667 && height <= 735) {
            return size * 1.15;
        }
        // older phablets
        return size * 1.25;
    }
    if (PixelRatio.get() === 3) {
        // catch Android font scaling on small machines
        // where pixel ratio / font scale ratio => 3:3
        if (width <= 360) {
            return size;
        }
        // Catch other weird android width sizings
        if (height < 667) {
            return size * 1.15;
            // catch in-between size Androids and scale font up
            // a tad but not too much
        }
        if (height >= 667 && height <= 735) {
            return size * 1.2;
        }
        // catch larger devices
        // ie iphone 6s plus / 7 plus / mi note 等等
        return size * 1.27;
    }
    if (PixelRatio.get() === 3.5) {
        // catch Android font scaling on small machines
        // where pixel ratio / font scale ratio => 3:3
        if (width <= 360) {
            return size;
            // Catch other smaller android height sizings
        }
        if (height < 667) {
            return size * 1.2;
            // catch in-between size Androids and scale font up
            // a tad but not too much
        }
        if (height >= 667 && height <= 735) {
            return size * 1.25;
        }
        // catch larger phablet devices
        return size * 1.4;
    }
    // if older device ie pixelRatio !== 2 || 3 || 3.5
    return size;
};

// 宽度百分比
export const WPercent = (widthPercent: any): number => {
    const elemWidth = parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel((width * elemWidth) / 100);
};

// 高度百分比
export const HPercent = (heightPercent: any): number => {
    const elemHeight = parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel((height * elemHeight) / 100);
};

// 网络状态
export const getNetInfoStatus = (netInfo: any): Record<string, any> => {
    const { type } = netInfo;
    return {
        isConnect: type.toUpperCase() === 'WIFI' || type.toUpperCase() === 'CELLULAR',
        isWifi: type.toUpperCase() === 'WIFI',
        isCellular: type.toUpperCase() === 'CELLULAR',
    };
};
