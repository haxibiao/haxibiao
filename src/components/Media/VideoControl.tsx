/*
 * @flow
 * created by wyk made in 2019-07-01 11:22:45
 */
'use strict';

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Iconfont from '../Iconfont';
import { appStore, observer } from '~/store';
import Slider from '@react-native-community/slider';

export default observer((props: any) => {
    let {
        sliderMoveing,
        sliderValue,
        showControl,
        currentTime,
        duration,
        paused,
        onSliderValueChanged,
        onSlidingComplete,
        playButtonHandler,
        onFullScreen,
    } = props.playerStore;
    let { isFullScreen } = appStore;

    if (!showControl) {
        return null;
    }

    console.log('isFullScreen', isFullScreen);
    return (
        <View style={styles.videoControl}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={isFullScreen ? onFullScreen : () => props.navigation.goBack()}
                style={styles.headerControl}>
                <Iconfont name="zuojiantou" size={pixel(22)} color="#fff" />
            </TouchableOpacity>

            <TouchableWithoutFeedback style={styles.pauseMark} onPress={playButtonHandler}>
                <View style={{ padding: pixel(20) }}>
                    <Iconfont name={paused ? 'bofang1' : 'zanting'} size={pixel(40)} color="#fff" />
                </View>
            </TouchableWithoutFeedback>
            <View style={styles.bottomControl}>
                <Text style={styles.timeText}>{Helper.TimeFormat(sliderMoveing ? sliderValue : currentTime)}</Text>
                <Slider
                    style={{ flex: 1, marginHorizontal: pixel(10) }}
                    maximumTrackTintColor="rgba(225,225,225,0.5)" //滑块右侧轨道的颜色
                    minimumTrackTintColor={'#fff'} //滑块左侧轨道的颜色
                    thumbTintColor="#fff"
                    value={sliderMoveing ? sliderValue : currentTime}
                    minimumValue={0}
                    maximumValue={Number(duration)}
                    onValueChange={onSliderValueChanged}
                    onSlidingComplete={onSlidingComplete}
                />
                <Text style={styles.timeText}>{Helper.TimeFormat(duration)}</Text>
                <TouchableOpacity activeOpacity={1} onPress={onFullScreen} style={styles.layoutButton}>
                    <Iconfont
                        name={appStore.isFullScreen ? 'cancel-full-screen' : 'quanping'}
                        size={pixel(20)}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    videoControl: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerControl: {
        position: 'absolute',
        top: pixel(15),
        left: pixel(15),
        width: pixel(40),
        height: pixel(40),
        justifyContent: 'center',
    },
    pauseMark: {
        width: pixel(60),
        height: pixel(60),
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomControl: {
        position: 'absolute',
        left: pixel(20),
        right: pixel(20),
        bottom: pixel(10),
        flexDirection: 'row',
        alignItems: 'center',
    },
    layoutButton: {
        marginLeft: pixel(10),
        width: pixel(40),
        height: pixel(40),
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeText: {
        fontSize: pixel(12),
        color: '#fff',
    },
});
