/*
 * @flow
 * created by wyk made in 2019-01-07 10:51:29
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FollowButton, TouchFeedback, Iconfont, Row } from '~/components';
import { userStore, observer } from '~/store';

let styles = {
    container: {
        position: 'absolute',
        bottom: 0,
        paddingTop: pixel(20),
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT || pixel(20),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: Helper.WPercent(36),
        height: Helper.WPercent(12),
        borderRadius: Helper.WPercent(6),
    },
    titleStyle: {
        fontSize: pixel(16),
        color: '#fff',
    },
};

const BottomBar = observer((props) => {
    const { user, style = {}, navigation } = props;
    console.log('====================================');
    console.log('user', user);
    console.log('====================================');
    return (
        <LinearGradient
            style={[styles.container, style]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}>
            <FollowButton
                id={user.id}
                followedStatus={user.followed_status}
                style={styles.button}
                titleStyle={styles.titleStyle}
            />
            <TouchFeedback
                style={[styles.button, { backgroundColor: Theme.watermelon }]}
                onPress={() => {
                    if (TOKEN) {
                        navigation.navigate('Chat', {
                            chat: {
                                withUser: { ...user },
                            },
                        });
                    } else {
                        navigation.navigate('Login');
                    }
                }}>
                <Text style={styles.titleStyle} numberOfLines={1}>
                    聊天
                </Text>
            </TouchFeedback>
        </LinearGradient>
    );
});

export default BottomBar;
