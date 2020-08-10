/*
 * @flow
 * created by wyk made in 2019-07-01 11:23:17
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator,
} from 'react-native';
import Iconfont from '../Iconfont';
import { observer } from '~/store';

export default observer((props: any) => {
    let { status, replay, continueToPlay } = props.videoStore;
    switch (status) {
        case 'error':
            return (
                <View style={styles.videoStatus}>
                    <TouchableWithoutFeedback onPress={replay}>
                        <View style={styles.error}>
                            <Iconfont name="shuaxin1" size={PxDp(25)} color="#fff" />
                            <Text style={styles.statusText}>好像迷路啦，请检查网络或者重试</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            );
        case 'notWifi':
            return (
                <View style={styles.videoStatus}>
                    <TouchableOpacity style={styles.playButton} onPress={continueToPlay}>
                        <Iconfont name="zanting" size={PxDp(25)} color="#fff" />
                        <Text style={styles.continueText}>继续播放</Text>
                    </TouchableOpacity>
                    <Text style={styles.statusText}>您正在使用非WiFi网络，播放将产生流量费用</Text>
                </View>
            );

        case 'loading':
            return (
                <View style={styles.videoStatus}>
                    <ActivityIndicator color={'#fff'} size={'large'} />
                </View>
            );

        case 'finished':
            return (
                <View style={styles.videoStatus}>
                    <TouchableWithoutFeedback onPress={replay}>
                        <View style={styles.replay}>
                            <Iconfont name="shuaxin1" size={PxDp(25)} color="#fff" />
                            <Text style={styles.refreshText}>重播</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            );

        default:
            return null;
    }
});

const styles = StyleSheet.create({
    videoStatus: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    replay: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: PxDp(40),
        paddingHorizontal: PxDp(16),
        borderWidth: PxDp(1),
        borderRadius: PxDp(20),
        borderColor: '#fff',
    },
    playButton: {
        marginBottom: PxDp(10),
        paddingVertical: PxDp(8),
        paddingHorizontal: PxDp(16),
        backgroundColor: '#666666',
        borderRadius: PxDp(6),
        flexDirection: 'row',
        alignItems: 'center',
    },
    continueText: {
        marginLeft: PxDp(10),
        fontSize: PxDp(13),
        color: '#fff',
    },
    statusText: {
        marginTop: PxDp(10),
        fontSize: PxDp(14),
        color: '#fff',
    },
    refreshText: {
        marginLeft: PxDp(15),
        fontSize: PxDp(14),
        color: '#fff',
    },
});
