/*
 * @flow
 * created by wyk made in 2019-04-01 17:53:01
 */

import React, { useState, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Animated, Easing } from 'react-native';
import { TouchFeedback, Iconfont } from '~/components';
import { DeviceEventEmitter } from 'react-native';
// import { appStore, observer } from '~/store';
import Comments from './Comments';

export default forwardRef((props: any, ref) => {
    let offset = new Animated.Value(0);
    const [visible, setVisible] = useState(props.visible ? true : false);

    const _slideUp = useCallback(() => {
        // appStore.modalIsShow = true;
        Animated.timing(offset, {
            useNativeDriver: true,
            easing: Easing.linear,
            duration: 200,
            toValue: 1,
        }).start();
    }, [offset]);

    useEffect(() => {
        //监听展开评论点击事件 - 方案2： 当外部组件拿不到ref时，只好丢事件
        DeviceEventEmitter.once(
            'showComment',
            (args) => {
                console.log('DeviceEventEmitter setVisible ...args', args);
                setVisible(true);
            },
            null,
        );

        if (visible) {
            _slideUp();
        }
        return () => {};
    }, [_slideUp, visible]);

    // 显示动画 - 外部展开评论时调用 - 方案1
    useImperativeHandle(ref, () => ({
        slideUp() {
            setVisible(true);
        },
    }));

    // 隐藏动画
    const slideDown = () => {
        Animated.timing(offset, {
            useNativeDriver: true,
            easing: Easing.linear,
            duration: 200,
            toValue: 0,
        }).start(() => {
            setVisible(false);
            // appStore.modalIsShow = false;
        });
    };

    const { media } = props;
    const translateY = offset.interpolate({
        inputRange: [0, 1],
        outputRange: [(Device.HEIGHT * 2) / 3, 0],
        extrapolate: 'clamp',
    });

    console.log('comment overlay visible', visible);

    if (!visible || !media) {
        return <View />;
    }
    console.log('comment overlay render media ', media);
    return (
        <View style={styles.container}>
            <View style={styles.modalLayout}>
                <TouchableOpacity style={styles.mask} onPress={slideDown} activeOpacity={1} />
                <Animated.View
                    style={{
                        transform: [
                            {
                                translateY,
                            },
                        ],
                    }}>
                    <View style={styles.contentContainer}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>
                                <Text style={styles.countCommentsText}>
                                    {Helper.syncGetter('count_comments', media)}
                                </Text>
                                {Helper.syncGetter('count_comments', media) > 0 ? '条评论' : '评论'}
                            </Text>
                            <TouchFeedback style={styles.close} onPress={slideDown}>
                                <Iconfont name="guanbi1" size={PxDp(20)} color={Theme.defaultTextColor} />
                            </TouchFeedback>
                        </View>
                        <Comments media={media} commentAbleId={media.id} commentAbleType="articles" />
                    </View>
                </Animated.View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    close: {
        alignItems: 'center',
        bottom: 0,
        height: PxDp(44),
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        top: 0,
        width: PxDp(44),
    },
    container: {
        ...StyleSheet.absoluteFill,
        zIndex: 1000,
    },
    contentContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: PxDp(12),
        borderTopRightRadius: PxDp(12),
        height: (Device.HEIGHT * 2) / 3,
        overflow: 'hidden',
        paddingBottom: PxDp(Theme.HOME_INDICATOR_HEIGHT),
    },
    countCommentsText: {
        fontSize: PxDp(16),
    },
    header: {
        alignItems: 'center',
        height: PxDp(44),
        justifyContent: 'center',
    },
    headerText: {
        color: Theme.defaultTextColor,
        fontSize: PxDp(15),
        fontWeight: 'bold',
    },
    mask: {
        ...StyleSheet.absoluteFill,
    },
    modalLayout: {
        flex: 1,
        justifyContent: 'flex-end',
    },
});
