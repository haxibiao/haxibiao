import React, { useState } from 'react';
import { StyleSheet, requireNativeComponent, Platform } from 'react-native';
const NativeDrawFeedAd = requireNativeComponent('DrawFeedAd');
import {
    DrawFeedUseExpress,
    CodeIdDrawFeed,
    CodeIdDrawFeedIOS
} from '@app/app.json';
import { appStore } from '@src/store';

// 默认很多是用旧的native方式申请的drawfeed 代码位...
const isExpress = DrawFeedUseExpress ? DrawFeedUseExpress : "false"; 

interface Props {
    onError?: Function,
    onLoad?: Function,
    onAdClick?: Function,
}

const DrawFeedAd = (props: Props) => {
    let { codeid_draw_video, draw_video_provider } = appStore;
    if (codeid_draw_video == '') {
        codeid_draw_video = Platform.OS === 'ios' ? CodeIdDrawFeedIOS : CodeIdDrawFeed;
    }

    const { onError, onLoad, onAdClick } = props;
    const [visible, setVisible] = useState(true);
    return (
        visible && (
            <NativeDrawFeedAd
                provider={draw_video_provider}
                is_express={isExpress}
                codeid={codeid_draw_video}
                style={{ ...styles.container }}
                onAdError={(e: any) => {
                    console.log('onError feed', e.nativeEvent);
                    setVisible(false);
                    onError && onError(e.nativeEvent);
                }}
                onAdClick={onAdClick}
                onAdShow={(e: any) => {
                    console.log('onAdShow', e.nativeEvent);
                }}
            />
        )
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Device.WIDTH,
    },
});

export default DrawFeedAd;
