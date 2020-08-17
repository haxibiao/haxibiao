import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, TextInput, Image, StatusBar } from 'react-native';
import { RoundedImage } from 'react-native-widgets';
import { LivePushManager } from 'react-native-live';
import MemoBeautySlider from './ShowTimeWidgetBeautySlider';
import { appStore, observer, userStore } from '~/store';
// import {app} from '../../store'; //TODO: replace this import later
import { GQL } from '~/apollo';
import LiveStore from './LiveStore';

const { width: sw, height: sh } = Dimensions.get('window');
const StartLiveButtonWidth = sw * 0.72;
const StartLiveButtonHeight = StartLiveButtonWidth * 0.2;
const CardWidth = sw * 0.8;
const CardHeight = CardWidth * 0.23;
const StatusBarHeight = StatusBar.currentHeight ?? 0;

const ShowTimeWidgetConfigureLayer = (props: { navigation: any; startCallback: () => void }) => {
    const [titlevalue, settitlevalue] = useState(`${userStore.me?.name ?? ''}的直播`);
    const [showBeauty, setshowbeauty] = useState(false);

    let clicked = false;

    const titleHandler = (text: string) => {
        settitlevalue(text);
    };

    const StartLiveHandler = () => {
        let client = appStore.client;
        if (!clicked) {
            clicked = true;
            if (client) {
                client
                    .mutate({
                        mutation: GQL.OpenLiveMutation,
                        variables: {
                            title: titlevalue,
                        },
                        fetchPolicy: 'no-cache',
                    })
                    .then((result: any) => {
                        console.log('1直播推流接口返回数据:  ', result);
                        let push_url = result.data?.createLiveRoom?.push_url ?? '';
                        let room_id = result.data?.createLiveRoom?.id ?? '';
                        LiveStore.setroomidForOnlinePeople(room_id);

                        console.log('推流地址: ', push_url, room_id);
                        LivePushManager.startPush(push_url);
                        props.startCallback();
                        LiveStore.pushDankamu({
                            name:
                                '小答妹: 为了营造绿色网络环境、请遵守文明准则哦。禁止发表涉及暴力、色情、歧视等言论。不遵守者一旦被查出将有封号风险。',
                            message: '',
                        });
                    })
                    .catch((err: any) => {
                        //TODO: error
                        console.log('1直播推流接口错误: ', err);
                        Toast.show({ content: '服务器内部错误、请尝试稍后再试或者联系我们~' });
                    })
                    .finally(() => {
                        clicked = false;
                    });
            }
        } else {
            // 当前 clicked 为 true ,不能点击
        }
        // props.startCallback();
    };

    return (
        <View style={[styles.body]}>
            <TouchableOpacity
                onPress={() => {
                    props.navigation.goBack();
                }}
                style={styles.closebtn}>
                <Image source={require('./res/close.png')} style={{ height: 34, width: 34 }} resizeMode="contain" />
            </TouchableOpacity>

            <View style={styles.cameraSwitch}>
                <RoundedImage uri={userStore.me?.avatar ?? ''} width={60} height={60} radius={5} />
                <View style={{ marginLeft: 12 }}>
                    <Text style={styles.liveTitle}>直播标题</Text>
                    <TextInput
                        value={titlevalue}
                        onChangeText={titleHandler}
                        onFocus={() => {
                            settitlevalue('');
                        }}
                        style={styles.input}
                        maxLength={15}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => {
                        LivePushManager.switchCamera();
                    }}
                    style={{ position: 'absolute', right: 10 }}>
                    <Image
                        source={require('./res/switch_camera.png')}
                        resizeMode="contain"
                        style={{ height: 27, width: 27, opacity: 0.86 }}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={() => {
                    setshowbeauty(!showBeauty);
                }}
                style={styles.beautyBtn}>
                <Text style={styles.beautyTitle}>美颜</Text>
                <Image source={require('./res/meiyan.png')} style={{ height: 17, width: 17 }} resizeMode="contain" />
            </TouchableOpacity>

            {showBeauty && <MemoBeautySlider />}

            <TouchableOpacity disabled={clicked} onPress={StartLiveHandler} style={styles.StartButton}>
                <Text style={styles.startTitle}>开始直播</Text>
            </TouchableOpacity>
        </View>
    );
};

export default observer(ShowTimeWidgetConfigureLayer);

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#00000001',
        width: sw,
    },
    StartButton: {
        width: StartLiveButtonWidth,
        height: StartLiveButtonHeight,
        borderRadius: StartLiveButtonHeight / 2,
        backgroundColor: Theme.secondaryColor,
        position: 'absolute',
        bottom: sh * 0.1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closebtn: {
        position: 'absolute',
        left: 20,
        top: StatusBarHeight + 16,
        zIndex: 10,
        height: 34,
        width: 34,
        backgroundColor: '#00000001',
    },
    cameraSwitch: {
        width: CardWidth,
        backgroundColor: '#00000055',
        borderRadius: 10,
        padding: 6,
        marginTop: sh * 0.15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    liveTitle: {
        color: '#ffffffaa',
        fontSize: 16,
        marginStart: 3.8,
    },
    input: {
        paddingVertical: 0,
        color: '#ffffffcc',
        fontSize: 14,
    },
    beautyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 20,
        marginTop: 20,
        backgroundColor: '#00000055',
    },
    beautyTitle: {
        fontSize: 18,
        color: 'white',
        marginEnd: 5,
    },
    startTitle: {
        fontSize: 19,
        color: '#ffffffdd',
    },
});
