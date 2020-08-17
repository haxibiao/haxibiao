import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    NativeModules,
    TouchableOpacity,
    StatusBar,
    FlatList,
    ScrollView,
} from 'react-native';
import { observer } from 'mobx-react';
import LiveStore from './LiveStore';
import LiveBeautyStore from './LiveBeautyStore';
import { Avatar } from 'hxf-react-native-uilib';
import { LivePushManager } from 'hxf-tencent-live';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as OnlinePeopleModal from './ShowTimeWidgetOnlinePeopleModal';
import { Overlay } from 'teaset';
// import { app } from '../../store'; //TODO: replace this import later
import { appStore, userStore } from '@src/store';
import { GQL } from '@src/apollo';

const { StatusBarManager } = NativeModules;
const { width: sw, height: sh } = Dimensions.get('window');
const TOP_WIDGET_HEIGHT = 30;
const TOP_WIDGET_WIDTH = sw * 0.3;
const TOP_WIDGET_AVATAR_SIZE = 25; // 2
const TOP_WIDGET_FOLLOW_HEIGHT = TOP_WIDGET_HEIGHT * 0.5;
const TOP_WIDGET_FOLLOW_WIDTH = TOP_WIDGET_FOLLOW_HEIGHT * 2.2;
const TOP_WIDGET_CENTER_WIDTH = TOP_WIDGET_WIDTH - TOP_WIDGET_AVATAR_SIZE - 12;
const TOP_WIDGET_CLOSE_SIZE = 28;
const TOP_WIDGET_ONLINE_WRAPPER_HEIGHT = 23;

const ModalContent = observer((props: any) => {
    const closeHandler = () => {
        hideQuitModal();
        /**
         *  停止直播，调用下播接口
         */
        LivePushManager.liveStopLivePush();
        console.log('停止推流');
        if (appStore.client) {
            appStore.client
                .mutate({
                    mutation: GQL.CloseLiveRoom,
                    variables: { roomid: LiveStore.roomidForOnlinePeople },
                })
                .then((rs: any) => {
                    //TODO: 下播成功
                    console.log('下播成功,', rs);
                })
                .catch((err: any) => {
                    //TODO: 下播接口错误
                    console.log('下播失败,', err);
                });
        }
        //返回上一级页面
        if (props.navigation) {
            props.navigation.goBack();
        }
        //重置美颜store的值
        LiveBeautyStore.setBlur(0);
        LiveBeautyStore.setWhiteness(0);
    };

    return (
        <View style={styles.quitModal}>
            <View style={styles.quitModalTitle}>
                <Text style={{ fontSize: 16, color: '#222' }}>是否结束直播 ? </Text>
            </View>
            <View style={styles.quitModalBtnWrapper}>
                <TouchableOpacity
                    onPress={() => {
                        hideQuitModal(); //关闭退出浮层
                    }}
                    activeOpacity={0.9}
                    style={styles.cancelBtn}>
                    <Text style={styles.cancelTitle}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeHandler} activeOpacity={0.9} style={styles.confirmBtn}>
                    <Text style={styles.confirmTitle}>确定</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});

let overlaykey: any = null;
const showQuitModal = (navigation: any) => {
    const view = (
        <Overlay.View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ModalContent navigation={navigation} />
        </Overlay.View>
    );
    overlaykey = Overlay.show(view);
};

const hideQuitModal = () => {
    Overlay.hide(overlaykey);
};

const HotValue = observer(() => {
    return <Text style={{ fontSize: 8, color: 'white' }}>{`当前热度${LiveStore.hot}`}</Text>;
});

const OnlinePeople = observer((props: any) => {
    const getCount = () => {
        let c = LiveStore.count_audience;
        if (c >= 1000 && c < 10000) {
            return (c / 1000).toFixed(1) + 'k';
        } else if (c >= 10000) {
            return (c / 10000).toFixed(1) + 'w';
        }
        return c;
    };

    return (
        <View style={styles.AudienceContainer}>
            <View style={{ minWidth: 35, maxWidth: sw * 0.34, height: 36 }}>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={LiveStore.onlinePeople}
                    horizontal
                    contentContainerStyle={{ alignItems: 'center' }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return (
                            <Avatar
                                size={TOP_WIDGET_AVATAR_SIZE}
                                uri={item.user_avatar}
                                frameStyle={{ marginEnd: 2 }}
                            />
                        );
                    }}
                />
            </View>

            <TouchableOpacity
                onPress={() => {
                    OnlinePeopleModal.showOnlinePeopleModal();
                }}
                style={styles.AudienceCountWrapper}>
                <Text
                    style={{
                        fontSize: 12,
                        color: 'white',
                    }}>
                    {getCount()}
                </Text>
            </TouchableOpacity>
        </View>
    );
});

const ShowTimeWidgetLiveOnWidgetTopBar = (props: { navigation: any }) => {
    useEffect(() => {
        return () => {
            LivePushManager.liveStopLivePush();
            console.log('[Safeguard]停止推流');
            if (appStore.client) {
                appStore.client
                    .mutate({
                        mutation: GQL.CloseLiveRoom,
                        variables: { roomid: LiveStore.roomidForOnlinePeople },
                    })
                    .then((rs: any) => {
                        // TODO: 下播成功
                        console.log('[Safeguard]下播成功,', rs);
                    })
                    .catch((err: any) => {
                        // TODO: 下播接口错误
                        console.log('[Safeguard]下播失败,', err);
                    });
            }

            if (LiveStore.hot !== 0) LiveStore.setHot(0);
            LiveStore.clearDankamu();

            if (LiveBeautyStore.blur !== 0) LiveBeautyStore.setBlur(0);
            if (LiveBeautyStore.whiteness !== 0) LiveBeautyStore.setWhiteness(0);
        };
    }, []);

    return (
        <View style={styles.TopWidgetContainer}>
            <View style={styles.TopLeftWidget}>
                <Avatar uri={userStore.me?.avatar ?? ''} size={TOP_WIDGET_AVATAR_SIZE} />
                <View style={styles.hot}>
                    <Text style={styles.nameTitle} numberOfLines={1}>
                        {userStore.me?.name ?? ''}
                    </Text>
                    <HotValue />
                </View>
            </View>

            <View style={styles.row}>
                <OnlinePeople />
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        showQuitModal(props.navigation);
                    }}>
                    <Image
                        source={require('./res/close.png')}
                        resizeMode={'contain'}
                        style={{ height: TOP_WIDGET_CLOSE_SIZE, width: TOP_WIDGET_CLOSE_SIZE }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default observer(ShowTimeWidgetLiveOnWidgetTopBar);

const styles = StyleSheet.create({
    TopWidgetContainer: {
        width: sw,
        height: TOP_WIDGET_HEIGHT,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    TopLeftWidget: {
        height: TOP_WIDGET_HEIGHT,
        width: TOP_WIDGET_WIDTH,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#00000033',
        borderRadius: TOP_WIDGET_HEIGHT / 2,
        overflow: 'hidden',
        paddingHorizontal: 5,
    },
    FollowWrapper: {
        height: TOP_WIDGET_FOLLOW_HEIGHT,
        width: TOP_WIDGET_FOLLOW_WIDTH,
        borderRadius: TOP_WIDGET_FOLLOW_HEIGHT / 2,
        overflow: 'hidden',
        backgroundColor: '#FE5F5F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    AudienceCountWrapper: {
        paddingHorizontal: 5,
        height: TOP_WIDGET_ONLINE_WRAPPER_HEIGHT,
        minWidth: TOP_WIDGET_ONLINE_WRAPPER_HEIGHT,
        backgroundColor: '#00000033',
        borderRadius: TOP_WIDGET_ONLINE_WRAPPER_HEIGHT / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 3,
    },
    AudienceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        right: TOP_WIDGET_CLOSE_SIZE,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    nameTitle: {
        fontSize: 12,
        fontWeight: '500',
        color: 'white',
        width: TOP_WIDGET_CENTER_WIDTH * 0.78,
    },
    hot: {
        width: TOP_WIDGET_CENTER_WIDTH,
        height: TOP_WIDGET_HEIGHT,
        justifyContent: 'center',
        paddingStart: 8,
    },
    quitModal: {
        height: sw * 0.3,
        width: sw * 0.56,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        overflow: 'hidden',
    },
    quitModalTitle: {
        height: sw * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quitModalBtnWrapper: {
        width: '100%',
        flexDirection: 'row',
        flex: 1,
    },
    cancelBtn: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderColor: '#f1f1f1',
    },
    confirmBtn: {
        width: '50%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#f1f1f1',
    },
    cancelTitle: {
        fontSize: 14,
        color: '#999',
    },
    confirmTitle: {
        fontSize: 14,
        color: 'blue',
    },
});
