import React, { useState } from 'react';
import { StyleSheet, requireNativeComponent, Platform } from 'react-native';
const NativeBannerAd = requireNativeComponent('BannerAd');
import {
    CodeIdBanner,
    CodeIdBannerIOS
} from '@app/app.json';
import { appStore as APP } from '@src/store';
let { banner_provider } = APP;
const codeid = Platform.OS === 'ios' ? CodeIdBannerIOS : CodeIdBanner;

type Props = {
    adWidth: number,
    onError?: Function,
    onLoad?: Function,
};

const BannerAd = (props: Props) => {
    let { adWidth = Device.WIDTH - 30, onError, onLoad } = props;
    let [visible, setVisible] = useState(true);
    let [height, setHeight] = useState(0); //默认高度
    return (
        visible && (
            <NativeBannerAd
                provider={banner_provider}
                codeid={codeid}
                adWidth={adWidth}
                style={{ ...styles.container, height }}
                onError={e => {
                    console.log('onError', e.nativeEvent);
                    onError && onError(e.nativeEvent);
                    setVisible(false);
                }}
                onAdClosed={e => {
                    console.log('onAdClosed', e.nativeEvent);
                    setVisible(false);
                }}
                onLayoutChanged={e => {
                    console.log('onLayoutChanged', e.nativeEvent);
                    if (e.nativeEvent.height) {
                        setHeight(e.nativeEvent.height);
                        onLoad && onLoad(e.nativeEvent);
                    }
                }}
            />
        )
    );
};

const styles = StyleSheet.create({
    container: {
        width: Device.WIDTH,
        height: 0,
    },
});

export default BannerAd;
