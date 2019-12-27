import React, { useState } from 'react';
import { StyleSheet, requireNativeComponent, Platform } from 'react-native';
const NativeFeedAd = requireNativeComponent('FeedAd');
import { CodeIdFeed, CodeIdFeedIOS } from '@app/app.json';
import { appStore as APP } from '@src/store';
let { FeedProvider } = APP;

const codeid = Platform.OS === 'ios' ? CodeIdFeedIOS : CodeIdFeed;

// 注意检查穿山甲运行时的Draw竖版信息流代码位id
// const codeid = Platform.OS === 'android' ? '917576575' : '931407994';

interface Props {
    adWidth: number;
    onError?: Function;
    onLoad?: Function;
    onClick?: Function;
    visible: boolean;
    visibleHandler: Function;
}

const FeedAd = (props: Props) => {
    const { adWidth = Device.WIDTH - PxDp(30), onError, onLoad, onClick } = props;
    // let [visible, setVisible] = useState(true);
    const { visible, visibleHandler } = props; // 状态交友父组件来控制，使得广告显示状态在父组件中可以实时监听
    const [height, setHeight] = useState(0); // 默认高度
    if (!visible) return null;
    return (
        <NativeFeedAd
            provider={FeedProvider}
            codeid={codeid}
            adWidth={adWidth}
            style={{ width: adWidth, height }}
            onError={(e: any) => {
                console.log('onError feed', e.nativeEvent);
                visibleHandler(false);
                onError && onError(e.nativeEvent);
            }}
            onAdClick={(e: any) => {
                console.log('onClick FeedAd ');
                onClick && onClick(e.nativeEvent);
            }}
            onAdClosed={(e: any) => {
                console.log('onAdClosed', e.nativeEvent);
                visibleHandler(false);
            }}
            onLayoutChanged={(e: any) => {
                console.log('onLayoutChanged feed', e.nativeEvent);
                if (e.nativeEvent.height) {
                    setHeight(e.nativeEvent.height);
                    onLoad && onLoad(e.nativeEvent);
                }
            }}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        height: 0,
        width: Device.WIDTH,
    },
});

export default FeedAd;
