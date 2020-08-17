import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    SafeAreaView,
    NativeModules,
    TouchableOpacity,
    StatusBar,
    Platform,
    TextInput,
    FlatList,
} from 'react-native';
import { LivePullManager } from 'react-native-live';
import { observer } from 'mobx-react';
import LiveStore from './LiveStore';
import { Avatar } from 'react-native-widgets';
// import { GQL } from 'apollo'; //需要调用的接口为旧答妹的接口
import { appStore } from '~/store';
import { ApolloClient } from 'apollo-boost';
import { GQL } from '~/apollo';
const StatusBarHeight = StatusBar.currentHeight ?? 0; //状态栏高度
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const { width: sw, height: sh } = Dimensions.get('window');

const TOP_WIDGET_HEIGHT = 30;
const TOP_WIDGET_WIDTH = sw * 0.345;
const TOP_WIDGET_AVATAR_SIZE = 25; // 2

const TOP_WIDGET_FOLLOW_CONTAINER_SIZE = 24;
const TOP_WIDGET_FOLLOW_CONTAINER_SIZE_WIDTH = 30;
const TOP_FOLLOW_SIZE = 20;

const TOP_WIDGET_CENTER_WIDTH = TOP_WIDGET_WIDTH - TOP_WIDGET_AVATAR_SIZE - TOP_WIDGET_FOLLOW_CONTAINER_SIZE_WIDTH;
const TOP_WIDGET_CLOSE_SIZE = 30;
const TOP_WIDGET_ONLINE_WRAPPER_HEIGHT = 27;

/**
 *  topwidget 子组件 =>  关注按钮
 */
let clickinter: number;
let client: ApolloClient<unknown>;
const FollowButton = observer((props: { isFollowed: boolean; userid: string }) => {
    const [followed, setfollowed] = useState(false);

    useEffect(() => {
        client = appStore.client;
        setfollowed(props.isFollowed);
    }, [props.isFollowed]);
    function followMutate() {
        if (client) {
            //TODO: 替换关注GQL
            // client.mutate({
            //     mutation: GQL.FollowToggbleMutation,
            //     variables:{followed_type: 'users',followed_id:props.userid}
            // }).then((rs) => {
            //     console.log("关注成功",rs);
            //     if(rs.data.followToggle == null){
            //         setfollowed(false);
            //     }else{
            //         setfollowed(true);
            //     }
            // }).catch((err:any) => {
            //     console.log("关注mutation错误",err)
            // })
        }
    }

    return (
        <View
            style={{
                backgroundColor: '#ffffffee',
                borderRadius: TOP_WIDGET_FOLLOW_CONTAINER_SIZE / 2,
                height: TOP_WIDGET_FOLLOW_CONTAINER_SIZE,
                width: TOP_WIDGET_FOLLOW_CONTAINER_SIZE_WIDTH,
                justifyContent: 'center',
                alignItems: 'center',
                marginEnd: 0,
            }}>
            {followed ? (
                <TouchableOpacity onPress={followMutate}>
                    <Image
                        source={require('!/assets/images/ic_liked.png')}
                        style={{ height: TOP_FOLLOW_SIZE, width: TOP_FOLLOW_SIZE }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={followMutate}>
                    <Text style={{ fontSize: 12, color: 'red', fontWeight: 'bold' }}>关注</Text>
                </TouchableOpacity>
            )}
        </View>
    );
});

/**
 *  topwidget 子组件 =>  热度
 */
const HotDot = observer(() => {
    return <Text style={styles.HotDot} numberOfLines={1}>{`热度${LiveStore.hot}`}</Text>;
});

/**
 *  topwidget 子组件 => 当前人数
 */
const CurrentPeople = observer((props: any) => {
    useEffect(() => {
        return () => {
            /**
             *  将热度和人数值复位
             */
            LiveStore.setHot(0);
        };
    }, []);

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ minWidth: 35, maxWidth: sw * 0.4, height: 36 }}>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={LiveStore.onlinePeople}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center' }}
                    renderItem={({ item, index }) => {
                        console.log(item.user_avatar, item.user_id);
                        return (
                            <Avatar
                                uri={item.user_avatar}
                                size={TOP_WIDGET_AVATAR_SIZE * 1.1}
                                frameStyle={{ marginEnd: 2, backgroundColor: 'white' }}
                            />
                        );
                    }}
                />
            </View>
        </View>
    );
});

/**
 * 在线人数
 */
const OnlineCount = observer((props: any) => {
    const getCount = () => {
        let c = LiveStore.count_users;
        if (c >= 1000 && c < 10000) {
            return (c / 1000).toFixed(1) + 'k';
        } else if (c >= 10000) {
            return (c / 10000).toFixed(1) + 'w';
        }
        return c;
    };

    return (
        <View
            style={{
                height: TOP_WIDGET_CLOSE_SIZE,
                minWidth: TOP_WIDGET_CLOSE_SIZE,
                borderRadius: TOP_WIDGET_CLOSE_SIZE / 2,
                backgroundColor: '#00000033',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 3,
            }}>
            <Text style={{ fontSize: 12, color: 'white' }}>{getCount()}</Text>
        </View>
    );
});

/**
 * 离开直播间按钮
 */
const CloseButton = observer((props: any) => {
    useEffect(() => {
        return () => {
            //为防止用户直接使用物理按键返回，在组件销毁时也调用离开mutation
            client
                .mutate({
                    mutation: GQL.LeaveLiveMutation,
                    variables: { roomid: LiveStore.roomidForOnlinePeople },
                })
                .then((rs) => {
                    //离开成功
                    console.log('[Protect]用户离开直播间mutation调用成功', rs);
                })
                .catch((err) => {
                    //TODO: 离开接口调用失败
                    console.log('[Protect]用户离开直播间接口错误', err);
                });
            LiveStore.setuserLeft(false); //离开时设置 主播下播 为false, 隐藏下播状态图
            LivePullManager.stopPull();
            console.log('[Protect]停止拉流');
            LiveStore.clearDankamu();
            console.log('[Protect]清除弹幕数据');
        };
    }, []);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
                props.navigation.goBack();
                //销毁直播
                LivePullManager.stopPull();
                console.log('停止拉流');
                //清除弹幕
                LiveStore.clearDankamu();
                console.log('清除弹幕数据');

                //离开直播间接口调用
                client
                    .mutate({
                        mutation: GQL.LeaveLiveMutation,
                        variables: { roomid: LiveStore.roomidForOnlinePeople },
                    })
                    .then((rs) => {
                        //离开成功
                        console.log('用户离开直播间', rs);
                    })
                    .catch((err) => {
                        //TODO: 离开接口调用失败
                        console.log('用户离开直播间接口错误', err);
                    });
                LiveStore.setuserLeft(false);
            }}>
            <Image
                source={require('./res/close.png')}
                resizeMode={'contain'}
                style={{ height: TOP_WIDGET_CLOSE_SIZE, width: TOP_WIDGET_CLOSE_SIZE }}
            />
        </TouchableOpacity>
    );
});

const LiveRoomTopWidgets = (props: {
    navigation: any;
    user: { id: string; name: string; avatar: string; count_users: number; is_followed: boolean };
    loadingEnd: boolean;
}) => {
    return (
        <View
            style={[
                styles.TopWidgetContainer,
                { marginTop: StatusBarHeight + 12, zIndex: props.loadingEnd ? 22 : 10 },
            ]}>
            <View style={styles.TopLeftWidget}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        console.log('点击头像');
                        //跳转到用户详情页
                        if (props.navigation) {
                            console.log('navigation存在，进行跳转', props.navigation);
                            props.navigation.navigate('User', {
                                user: { id: props.user.id, name: props.user.name },
                            });
                        } else {
                            console.log('navigation不存在');
                        }
                    }}>
                    <Avatar uri={props.user.avatar} size={TOP_WIDGET_AVATAR_SIZE} />
                </TouchableOpacity>
                <View style={styles.hot}>
                    <Text style={styles.nameTitle} numberOfLines={1}>
                        {props?.user?.name + '什么鬼' ?? ''}
                    </Text>
                </View>
                <FollowButton isFollowed={props.user.is_followed} userid={props.user.id} />
            </View>

            <HotDot />

            <View style={styles.row}>
                <CurrentPeople count_users={props.user.count_users ?? 0} />
                <OnlineCount />
            </View>
        </View>
    );
};

export default observer(LiveRoomTopWidgets);

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
    AudienceCountWrapper: {
        paddingHorizontal: 9,
        height: TOP_WIDGET_ONLINE_WRAPPER_HEIGHT,
        backgroundColor: '#00000033',
        borderRadius: TOP_WIDGET_ONLINE_WRAPPER_HEIGHT / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 3,
    },
    nameTitle: {
        fontSize: 12,
        fontWeight: '500',
        color: 'white',
        marginBottom: 1,
        width: TOP_WIDGET_CENTER_WIDTH * 0.8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    hot: {
        width: TOP_WIDGET_CENTER_WIDTH,
        height: TOP_WIDGET_HEIGHT,
        justifyContent: 'center',
        paddingStart: 8,
    },
    HotDot: {
        fontSize: 12,
        color: 'white',
        position: 'absolute',
        left: 12,
        bottom: -25,
        backgroundColor: '#00000033',
        borderRadius: 10,
        textAlign: 'center',
        paddingHorizontal: 5,
        paddingVertical: 1,
    },
});
