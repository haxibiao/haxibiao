/*
 * @flow
 * created by wyk made in 2019-02-25 17:34:23
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Easing, TouchableOpacity, BackHandler } from 'react-native';
import { useNavigation } from '~/router';
import Video from 'react-native-video';

import VideoStatus from './VideoStatus';
import VideoControl from './VideoControl';

import { observer, Provider, inject } from 'mobx-react';
import { appStore } from '~/store';
import VideoStore from '~/store/VideoStore';
import Orientation from 'react-native-orientation';

let TestVideo = {
    width: 800,
    height: 600,
    url: 'https://1251052432.vod2.myqcloud.com/3ef5dd60vodtransgzp1251052432/1b0ce41b5285890784373984093/v.f30.mp4',
};

export default (props: any) => {
    let navigation = useNavigation();
    let { video, inScreen, style } = props;
    let videoStore = VideoStore;
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        videoStore.play();

        // let BackHandler = ReactNative.BackHandler ? ReactNative.BackHandler : ReactNative.BackAndroid;
        if (Device.Android) {
            BackHandler.addEventListener('hardwareBackPress', _backButtonPress);
        }
        //不再画面时，暂停播放
        navigation.addListener('willBlur', (payload) => {
            videoStore.pause();
        });

        return () => {
            // 离开时暂停播放
            videoStore.pause();
            // 离开固定竖屏
            Orientation.lockToPortrait();
        };
    }, []);

    const _backButtonPress = () => {
        if (appStore.isFullScreen) {
            videoStore.onFullScreen();
            return true;
        }
        return false;
    };

    let {
        videoPaused,
        play,
        status,
        orientation,
        paused,
        getVideoRef,
        controlSwitch,
        onAudioBecomingNoisy,
        onAudioFocusChanged,
        loadStart,
        onLoaded,
        onProgressChanged,
        onPlayEnd,
        onPlayError,
    } = videoStore;
    return (
        <View
            style={[
                styles.playContainer,
                style,
                appStore.isFullScreen
                    ? {
                          width: Device.WIDTH,
                          height: Device.HEIGHT,
                          marginTop: 0,
                          position: 'absolute',
                          zIndex: 10000,
                      }
                    : styles.defaultSize,
            ]}>
            {status !== 'notWifi' && (
                <Video
                    style={styles.videoStyle}
                    ref={getVideoRef}
                    source={{
                        uri: video.url,
                    }}
                    // poster={video.cover}
                    rate={1.0}
                    volume={1.0}
                    muted={false}
                    repeat={true}
                    paused={videoPaused}
                    resizeMode={'contain'}
                    disableFocus={true}
                    useTextureView={false}
                    playWhenInactive={false}
                    playInBackground={false}
                    onLoadStart={loadStart} // 当视频开始加载时的回调函数
                    onLoad={onLoaded} // 当视频加载完毕时的回调函数
                    onProgress={onProgressChanged} //每250ms调用一次，以获取视频播放的进度
                    onEnd={onPlayEnd}
                    onError={onPlayError}
                    onAudioBecomingNoisy={onAudioBecomingNoisy}
                    onAudioFocusChanged={onAudioFocusChanged}
                    ignoreSilentSwitch="obey"
                />
            )}
            {/* <TouchableOpacity activeOpacity={1} onPress={play} style={styles.controlContainer}>
                <VideoControl videoStore={videoStore} navigation={navigation} />
            </TouchableOpacity>
            <VideoStatus videoStore={videoStore} /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    playContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    defaultSize: {
        width: Device.WIDTH,
        height: Device.WIDTH * 0.65,
    },
    videoStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    controlContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});
