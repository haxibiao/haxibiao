import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, NativeModules, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';
import { appStore } from '@src/store';
import { GQL as NewGQL } from '@src/apollo';
import { ApolloClient } from 'apollo-boost';
import LiveStore from './LiveStore';
import { LivePullManager } from 'hxf-tencent-live';
import * as Dankamu from './DankamuInputModal';

const { width: sw, height: sh } = Dimensions.get('window');
const { StatusBarManager } = NativeModules;

const BOTTOM_INPUT_WIDTH = sw * 0.45;
const BOTTOM_INPUT_MINHEIGHT = 32;
const TOP_WIDGET_CLOSE_SIZE = 32;

var client: ApolloClient<unknown>;

/**
 * 离开直播间按钮
 */
const CloseButton = observer((props: any) => {
    useEffect(() => {
        return () => {
            // 为防止用户直接使用物理按键返回，在组件销毁时也调用离开mutation
            client
                .mutate({
                    mutation: NewGQL.LeaveLiveRoom,
                    variables: { roomid: LiveStore.roomidForOnlinePeople },
                })
                .then(rs => {
                    // 离开成功
                    console.log('[Protect]用户离开直播间mutation调用成功', rs);
                })
                .catch(err => {
                    // TODO: 离开接口调用失败
                    console.log('[Protect]用户离开直播间接口错误', err);
                });
            LiveStore.setStreamerLeft(false); // 离开时设置 主播下播 为false, 隐藏下播状态图
            LivePullManager.liveStopPull();
            console.log('[Protect]停止拉流');
            LiveStore.clearDankamu();
            console.log('[Protect]清除弹幕数据');
        };
    }, []);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
                // 销毁直播
                LivePullManager.liveStopPull();
                console.log('停止拉流');
                // 清除弹幕
                LiveStore.clearDankamu();
                console.log('清除弹幕数据');

                // 离开直播间接口调用
                client
                    .mutate({
                        mutation: NewGQL.LeaveLiveRoom,
                        variables: { roomid: LiveStore.roomidForOnlinePeople },
                    })
                    .then(rs => {
                        // 离开成功
                        console.log('用户离开直播间', rs);
                    })
                    .catch(err => {
                        // TODO: 离开接口调用失败
                        console.log('用户离开直播间接口错误', err);
                    });
                LiveStore.setStreamerLeft(false);
                props.navigation.goBack();
            }}>
            <Image
                source={require('./res/close.png')}
                resizeMode={'contain'}
                style={{ height: TOP_WIDGET_CLOSE_SIZE, width: TOP_WIDGET_CLOSE_SIZE }}
            />
        </TouchableOpacity>
    );
});

const LiveRoomBottomWidgets = (props: { navigation: any }) => {
    useEffect(() => {
        client = appStore.client;
    }, [appStore.client]);

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingEnd: 12 }}>
            <TouchableOpacity
                activeOpacity={1.0}
                style={styles.inputWrapper}
                onPress={() => {
                    Dankamu.showInput();
                }}>
                <Text style={styles.input}>{'说点什么'}</Text>
            </TouchableOpacity>
            <CloseButton navigation={props.navigation} />
        </View>
    );
};
export default observer(LiveRoomBottomWidgets);

const styles = StyleSheet.create({
    input: {
        color: '#ffffffcc',
        marginStart: 10,
    },
    inputWrapper: {
        minHeight: BOTTOM_INPUT_MINHEIGHT,
        width: BOTTOM_INPUT_WIDTH,
        borderRadius: 8,
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#00000066',
        marginStart: 15,
    },
});
