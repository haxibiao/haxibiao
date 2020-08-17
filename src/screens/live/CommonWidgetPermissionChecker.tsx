import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
const { width: sw, height: sh } = Dimensions.get('window');
import { Overlay } from 'teaset';
import { appStore } from '~/store';
import { observer } from 'mobx-react';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const BOXWIDTH = sw * 0.86;
const MicroIcon = require('./res/maikefeng.png');
const CameraIcon = require('./res/xiangji.png');

const GRANT = '已授权';
const CHECKING = '检查中';
const UNAVAILABLE = '该项不可用';
const BLOCK = '已禁用、请手动授予权限';
const DENY = '已拒绝';

const DEFAULT = '#333';
const GREEN = 'green';
const BAD = 'red';

const PermissionView = observer((props: any) => {
    const [camerastatus, setcamerastatus] = useState(CHECKING);
    const [microstatus, setmicrostatus] = useState(CHECKING);
    const [cameracolor, setcameracolor] = useState(DEFAULT);
    const [microcolor, setmicrocolor] = useState(DEFAULT);
    const [checkdone, setcheckdone] = useState(false);

    useEffect(() => {
        // 检查相机授权
        if (Platform.OS == 'android') {
            check(PERMISSIONS.ANDROID.CAMERA).then((result: any) => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        setcamerastatus(UNAVAILABLE);
                        setcameracolor(BAD);
                        //检查麦克风授权
                        MicroCheck();
                        break;
                    case RESULTS.GRANTED:
                        setcamerastatus(GRANT);
                        setcameracolor(GREEN);
                        //检查麦克风授权
                        MicroCheck();
                        break;
                    case RESULTS.DENIED:
                        request(PERMISSIONS.ANDROID.CAMERA)
                            .then((result: any) => {
                                if (result == RESULTS.GRANTED) {
                                    setcamerastatus(GRANT);
                                    setcameracolor(GREEN);
                                } else if (result == RESULTS.DENIED) {
                                    setcamerastatus(DENY);
                                    setcameracolor(BAD);
                                } else if (result == RESULTS.BLOCKED) {
                                    setcamerastatus(BLOCK);
                                    setcameracolor(BAD);
                                }
                            })
                            .then(
                                //检查麦克风授权
                                () => {
                                    MicroCheck();
                                },
                            );
                        break;
                    case RESULTS.BLOCKED:
                        setcamerastatus(BLOCK);
                        setcameracolor(BAD);
                        break;
                }
            });
        } else if (Platform.OS == 'ios') {
            check(PERMISSIONS.IOS.CAMERA).then((result: any) => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        setcamerastatus(UNAVAILABLE);
                        setcameracolor(BAD);
                        //检查麦克风授权
                        MicroCheck();
                        break;
                    case RESULTS.GRANTED:
                        setcamerastatus(GRANT);
                        setcameracolor(GREEN);
                        //检查麦克风授权
                        MicroCheck();
                        break;
                    case RESULTS.DENIED:
                        request(PERMISSIONS.IOS.CAMERA)
                            .then((result: any) => {
                                if (result == RESULTS.GRANTED) {
                                    setcamerastatus(GRANT);
                                    setcameracolor(GREEN);
                                } else if (result == RESULTS.DENIED) {
                                    setcamerastatus(DENY);
                                    setcameracolor(BAD);
                                } else if (result == RESULTS.BLOCKED) {
                                    setcamerastatus(BLOCK);
                                    setcameracolor(BAD);
                                }
                            })
                            .then(
                                //检查麦克风授权
                                () => {
                                    MicroCheck();
                                },
                            );
                        break;
                    case RESULTS.BLOCKED:
                        setcamerastatus(BLOCK);
                        setcameracolor(BAD);
                        break;
                }
            });
        }
    }, []);

    function MicroCheck() {
        if (Platform.OS == 'android') {
            check(PERMISSIONS.ANDROID.RECORD_AUDIO).then((result: any) => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        setmicrostatus(UNAVAILABLE);
                        setmicrocolor(BAD);
                        setcheckdone(true);
                        break;
                    case RESULTS.GRANTED:
                        setmicrostatus(GRANT);
                        setmicrocolor(GREEN);
                        setcheckdone(true);
                        appStore.AppSetSufficientPermissions(true);
                        break;
                    case RESULTS.DENIED:
                        request(PERMISSIONS.ANDROID.RECORD_AUDIO)
                            .then((result: any) => {
                                if (result == RESULTS.GRANTED) {
                                    setmicrostatus(GRANT);
                                    setmicrocolor(GREEN);
                                    appStore.AppSetSufficientPermissions(true);
                                } else if (result == RESULTS.DENIED) {
                                    setmicrostatus(DENY);
                                    setmicrocolor(BAD);
                                } else if (result == RESULTS.BLOCKED) {
                                    setmicrostatus(BLOCK);
                                    setmicrocolor(BAD);
                                }
                            })
                            .then(() => {
                                setcheckdone(true);
                                if (camerastatus == GRANT && microstatus == GRANT) {
                                    appStore.AppSetSufficientPermissions(true);
                                }
                            });
                        break;
                    case RESULTS.BLOCKED:
                        setmicrostatus(BLOCK);
                        setmicrocolor(BAD);
                        setcheckdone(true);
                        if (camerastatus == GRANT && microstatus == GRANT) {
                            appStore.AppSetSufficientPermissions(true);
                        }
                        break;
                }
            });
        } else if (Platform.OS == 'ios') {
            check(PERMISSIONS.IOS.MICROPHONE).then((result: any) => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        setmicrostatus(UNAVAILABLE);
                        setmicrocolor(BAD);
                        setcheckdone(true);
                        break;
                    case RESULTS.GRANTED:
                        setmicrostatus(GRANT);
                        setmicrocolor(GREEN);
                        setcheckdone(true);
                        appStore.AppSetSufficientPermissions(true);
                        break;
                    case RESULTS.DENIED:
                        request(PERMISSIONS.IOS.MICROPHONE)
                            .then((result: any) => {
                                if (result == RESULTS.GRANTED) {
                                    setmicrostatus(GRANT);
                                    setmicrocolor(GREEN);
                                    appStore.AppSetSufficientPermissions(true);
                                } else if (result == RESULTS.DENIED) {
                                    setmicrostatus(DENY);
                                    setmicrocolor(BAD);
                                } else if (result == RESULTS.BLOCKED) {
                                    setmicrostatus(BLOCK);
                                    setmicrocolor(BAD);
                                }
                            })
                            .then(() => {
                                setcheckdone(true);
                                if (camerastatus == GRANT && microstatus == GRANT) {
                                    appStore.AppSetSufficientPermissions(true);
                                }
                            });
                        break;
                    case RESULTS.BLOCKED:
                        setmicrostatus(BLOCK);
                        setmicrocolor(BAD);
                        setcheckdone(true);
                        if (camerastatus == GRANT && microstatus == GRANT) {
                            appStore.AppSetSufficientPermissions(true);
                        }
                        break;
                }
            });
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>直播需要打开以下权限哦~</Text>

            <View style={styles.row_item}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={CameraIcon} style={styles.camera} resizeMode="contain" />
                    <Text>摄像头</Text>
                </View>
                <Text style={{ color: cameracolor, fontSize: 16 }}>{camerastatus}</Text>
            </View>
            <View style={styles.row_item}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={MicroIcon} style={{ height: 25, width: 25, marginEnd: 5 }} resizeMode="contain" />
                    <Text>麦克风</Text>
                </View>
                <Text style={{ color: microcolor, fontSize: 16 }}>{microstatus}</Text>
            </View>

            {(checkdone || appStore.sufficient_permissions) && (
                <TouchableOpacity
                    onPress={() => {
                        hidePermissionCheck();
                    }}
                    activeOpacity={0.88}
                    style={styles.done_btn}>
                    <Text style={{ color: appStore.sufficient_permissions ? 'green' : '#222', fontSize: 16 }}>
                        {appStore.sufficient_permissions ? '关闭后、前往直播吧' : '关闭'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
});

let overlaykey: any = null;
const showPermissionCheck = () => {
    overlaykey = Overlay.show(
        <Overlay.View
            modal={true}
            animated={true}
            overlayOpacity={0.8}
            style={{ justifyContent: 'center', alignItems: 'center' }}>
            <PermissionView />
        </Overlay.View>,
    );
};
const hidePermissionCheck = () => {
    Overlay.hide(overlaykey);
};

export { showPermissionCheck, hidePermissionCheck };

const styles = StyleSheet.create({
    container: {
        width: BOXWIDTH,
        paddingHorizontal: 17,
        paddingVertical: 13,
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        justifyContent: 'space-evenly',
    },
    row_item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 30,
        marginVertical: 10,
    },
    done_btn: {
        backgroundColor: '#f1f1f1',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 17,
        color: '#222',
        width: '100%',
        textAlign: 'center',
        paddingBottom: 15,
    },
    camera: {
        height: 25,
        width: 25,
        marginEnd: 5,
    },
});
