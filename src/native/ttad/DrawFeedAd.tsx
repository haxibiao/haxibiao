import React, { useState } from 'react';
import { StyleSheet, requireNativeComponent, Platform } from 'react-native';
const NativeDrawFeedAd = requireNativeComponent('DrawFeedAd');
import {
    CodeIdDrawFeed,
    CodeIdDrawFeedIOS
} from '@app/app.json';

const codeid = Platform.OS === 'ios' ? CodeIdDrawFeedIOS : CodeIdDrawFeed;

interface Props {
    onError?: Function,
    onLoad?: Function,
    onAdClick?: Function,
}

// 注意检查穿山甲运行时的Draw竖版信息流代码位id
// const codeid = Platform.OS === 'android' ? '917576134' : '931407500';

const DrawFeedAd = (props: Props) => {
    const { onError, onLoad, onAdClick } = props;
    const [visible, setVisible] = useState(true);
    return (
        visible && (
            <NativeDrawFeedAd
                codeid={codeid}
                style={{ ...styles.container }}
                onAdError={(e: any) => {
                    console.log('onError feed', e.nativeEvent);
                    setVisible(false);
                    onError && onError(e.nativeEvent);
                }}
                onAdClick={onAdClick}
                onAdShow={(e:any) => {
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
