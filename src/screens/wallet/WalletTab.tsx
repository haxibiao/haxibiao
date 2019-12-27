/*
 * @flow
 * created by Bin
 */

import React, { Component, useCallback, useContext, useState, useRef, useMemo, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Image,
    FlatList,
    TouchableWithoutFeedback,
    AppState,
    NativeModules,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import { PageContainer, Iconfont, Row, HxfModal, HxfButton, PopOverlay, StatusView } from '@src/components';
import StoreContext, { observer } from '@src/store';
import { middlewareNavigate, useNavigation, useNavigationParam } from '@src/router';
import { GQL, useMutation, useQuery } from '@src/apollo';
import { appStore, userStore } from '@src/store';
import { Center } from 'src/components';
import { ad, AppUtil } from '@src/native';
import RNFetchBlob from 'rn-fetch-blob';
import ProgressOverlay from '@src/components/Popup/ProgressOverlay';

const batTop = PxDp(Theme.statusBarHeight);

type Props = {
    taskData: any;
    setModule: Function;
};

const testData = [
    {
        id: 15,
        name: '今日视频发布满15个',
        details: '视频发布满15个',
        type: 1,
        submit_name: '未完成',
        task_class: '每日任务',
        task_status: 0,
        progress_details: '0 / 15',
        reward_info: {
            gold: 10,
            contribute: 1,
        },
        taskInfo: {
            method: 'publicArticleTask',
            router: '',
        },
    },
    {
        id: 16,
        name: '绑定手机号',
        details: '绑定手机号',
        type: 0,
        submit_name: '完成',
        task_class: '新人任务',
        task_status: 3,
        progress_details: '完成',
        reward_info: {
            gold: 50,
            contribute: null,
        },
        taskInfo: {
            method: 'checkUserIsUpdatePassAndPhone',
            router: 'accountBinding',
        },
    },
    {
        id: 17,
        name: '修改性别和生日',
        details: '修改性别和生日',
        type: 0,
        submit_name: '未完成',
        task_class: '新人任务',
        task_status: 0,
        progress_details: '未完成',
        reward_info: {
            gold: 10,
            contribute: null,
        },
        taskInfo: {
            method: 'checkUserIsUpdateGenderAndBirthday',
            router: 'editInformation',
        },
    },
    {
        id: 19,
        name: '应用商店好评',
        details: '应用商店好评',
        type: 2,
        submit_name: '进入',
        task_class: '自定义任务',
        task_status: null,
        progress_details: '进入',
        reward_info: {
            gold: 100,
            contribute: 3,
        },
        taskInfo: {
            method: 'toPraise',
            router: 'ToPraise',
        },
    },
];

const TaskItme = (props: Props) => {
    // console.log(TAG,taskData);

    const navigation = useNavigation();
    const setModule = props.setModule;
    const {
        id,
        icon,
        name,
        details,
        submit_name,
        type,
        task_status,
        progress_details,
        reward_info,
        taskInfo,
    } = props.taskData;

    // 任务图标获取
    const taskimg = icon ? { uri: icon } : require('@app/assets/images/task_gift.png');

    // 请求激励视频任务奖励接口，触发点击广告
    const [onClickRewardVideo] = useMutation(GQL.ADRewardVideoMutation, {
        variables: {
            is_click: true,
        },
        onCompleted: (data: any) => {
            setModule(data.playADVideo);
        },
        onError: (error: any) => {
            Toast.show({ content: '服务器响应失败！', duration: 1000 });
        },
    });

    // 请求激励视频任务奖励接口，看完视频
    const [onRewardVideo] = useMutation(GQL.ADRewardVideoMutation, {
        variables: {
            is_click: false,
        },
        onCompleted: (data: any) => {
            setModule(data.playADVideo);
        },
        onError: (error: any) => {
            Toast.show({ content: '服务器响应失败！', duration: 1000 });
        },
    });

    // 任务按钮点击事件
    const goTask = (types: number) => {
        switch (types) {
            case 0:
                // 新手任务
                noviceTask(task_status);
                break;
            case 1:
                // 每日任务
                dailyTask(task_status);
                break;
            case 2:
                // 自定义任务
                toComplete(taskInfo ? taskInfo.router : 'null');
                break;
            default:
                Toast.show({ content: '请检查更新 APP ，目前版本不支持该任务类型！' });
        }
    };

    // 新手任务响应事件
    const noviceTask = (start: number) => {
        switch (start) {
            case null:
                // 新手任务未领取
                getTaskMutation(id);
                break;
            case 0:
                // 新手任务未完成
                toNovice(taskInfo ? taskInfo.router : 'null');
                break;
            case 2:
                // 新手任务领取奖励
                getRewardMutation(id);
                break;
            case 3:
                // 新手任务已完成
                Toast.show({ content: '任务已完成！' });
                break;
            default:
                Toast.show({ content: '请检查更新 APP ，目前版本不支持该任务操作！' });
        }
    };

    // 每日任务响应事件
    const dailyTask = (start: number) => {
        switch (start) {
            case 2:
                // 每日任务领取奖励
                getRewardMutation(id);
                break;
            case 3:
                // 新手任务已完成
                Toast.show({ content: '任务已完成！' });
                break;
            default:
                Toast.show({ content: '请检查更新 APP ，目前版本不支持该任务操作！' });
        }
    };

    // 新手任务领取任务方法
    const getTaskMutation = (taskId: number) => {
        appStore.client
            .mutate({
                mutation: GQL.receiveTaskMutation,
                variables: {
                    id: taskId,
                },
            })
            .then((data: any) => {
                // 获取奖励
                // console.log(TAG, '(请求接受任务接口)', data);
                Toast.show({ content: '任务领取成功！', duration: 1500 });
            });
    };

    // 新手，每日任务领取奖励方法
    const getRewardMutation = (taskId: number) => {
        appStore.client
            .mutate({
                mutation: GQL.rewardTaskMutation,
                variables: {
                    id: taskId,
                },
            })
            .then((data: any) => {
                // 获取奖励
                // console.log(TAG, '(请求领取奖励接口)', data);
                const reward = data.data.rewardTask.reward_info;
                setModule(reward);
            });
    };

    // 自定义任务路由响应
    const toComplete = (router: string) => {
        switch (router) {
            case 'GoSleep':
                navigation.navigate('TaskSleepScreen');
                break;
            case 'GoDrinkWater':
                navigation.navigate('TaskDrinkWaterScreen');
                break;
            case 'ToPraise':
                navigation.navigate('Praise');
                break;
            case 'MotivationalVideo':
                // MotivationalVideo();
                navigation.navigate('TaskRewardVideo');
                break;
            default:
                Toast.show({ content: '请检查更新 APP ，目前版本不支持该任务！' });
        }
    };

    // 新手任务未完成路由
    const toNovice = (router: string) => {
        switch (router) {
            case 'editInformation':
                navigation.goBack();
                navigation.navigate('编辑个人资料');
                break;
            case 'accountBinding':
                navigation.goBack();
                navigation.navigate('AccountSecurity');
                break;
            case 'postNews':
                navigation.goBack();
                navigation.navigate('AskQuestion');
                break;
            case 'withdrawMoney':
                navigation.goBack();
                navigation.navigate('Wallet');
                break;
            default:
                Toast.show({ content: '请前往完成任务…' });
        }
    };

    // 看激励视频
    const MotivationalVideo = () => {
        // setModule({ message: '观看视频并点击！', gold: 666, contribute: 999 });
        ad.RewardVideo.loadAd().then(() => {
            ad.RewardVideo.startAd().then((result: any) => {
                if (JSON.parse(result).ad_click) {
                    // 点击了激励视频
                    onClickRewardVideo();
                } else if (JSON.parse(result).video_play) {
                    // 广告播放完成
                    onRewardVideo();
                } else {
                    Toast.show({ content: '视频未看完，任务失败！', duration: 1500 });
                }
            });
        });
    };

    return (
        <Row style={{ paddingHorizontal: 20, paddingVertical: 5, marginBottom: 10 }}>
            <View style={{ backgroundColor: '#CCC9', borderRadius: 10 }}>
                <Image source={taskimg} style={{ height: PxDp(40), width: PxDp(50), marginHorizontal: 10 }} />
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#CCC6',
                        borderBottomStartRadius: 10,
                        borderBottomEndRadius: 10,
                        paddingVertical: 2,
                    }}>
                    <Text numberOfLines={1} style={{ textAlign: 'center', color: '#FFF', fontSize: PxDp(10) }}>
                        +{reward_info.gold || 0}
                    </Text>
                </View>
            </View>
            <View style={{ paddingHorizontal: 10, flex: 1, justifyContent: 'center' }}>
                <Text
                    numberOfLines={1}
                    style={{ color: '#000', fontSize: PxDp(16), fontWeight: 'bold', marginBottom: PxDp(5) }}>
                    {name}
                </Text>
                <Text numberOfLines={2} style={{ color: '#AAA' }}>
                    {details}
                </Text>
            </View>
            {type === 1 && task_status === 0 ? (
                <View
                    style={{
                        width: PxDp(80),
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: PxDp(10),
                        paddingHorizontal: PxDp(15),
                    }}>
                    <Text>{progress_details}</Text>
                </View>
            ) : !task_status || task_status === 2 ? (
                <TouchableOpacity
                    style={{
                        width: PxDp(80),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 100,
                        backgroundColor: Theme.secondaryColor,
                        paddingVertical: PxDp(10),
                        paddingHorizontal: PxDp(15),
                    }}
                    onPress={() => goTask(type)}>
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{submit_name}</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    disabled={true}
                    style={{
                        width: PxDp(80),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 100,
                        borderColor: Theme.secondaryColor,
                        borderWidth: 1,
                        paddingVertical: PxDp(10),
                        paddingHorizontal: PxDp(15),
                    }}>
                    <Text style={{ color: Theme.secondaryColor, fontWeight: 'bold' }}>{submit_name}</Text>
                </TouchableOpacity>
            )}
        </Row>
    );
};

export default observer((props: any) => {
    const [taskAD, setTaskAD] = useState(true);
    const navigation = useNavigation();
    const [installDDZ, setInstallDDZ] = useState(false);

    const { login } = userStore;
    const store = useContext(StoreContext);
    const user = Helper.syncGetter('userStore.me', store);
    const isLogin = user.token && login ? true : false;
    let userProfile = {};
    const { data: result, refetch } = useQuery(GQL.userProfileQuery, {
        variables: { id: user.id || 0 },
    });
    const userData = Helper.syncGetter('user', result) || {};
    userProfile = Object.assign({}, userData, {
        ...user,
        reward: userData.reward,
        gold: userData.gold,
        count_articles: userData.count_articles,
        count_followings: userData.count_followings,
        count_followers: userData.count_followers,
    });

    const authNavigator = useCallback(
        (route, params) => {
            if (isLogin) {
                navigation.navigate(route, params);
            } else {
                navigation.navigate('Login');
            }
        },
        [isLogin],
    );

    const [sucModule, setSucModule] = useState(false);
    const [sucReward, setSucReward] = useState({ message: null, gold: null, contribute: null });
    const { data: userTasks, refetch: userRefetch } = useQuery(GQL.userTasksQuery, { fetchPolicy: 'network-only' });
    const userTasksData = Helper.syncGetter('tasks', userTasks);

    const { data: dailyTasks, refetch: dailyRefetch } = useQuery(GQL.dailyTasksQuery, { fetchPolicy: 'network-only' });
    const dailyTasksData = Helper.syncGetter('tasks', dailyTasks);

    const { data: customData, refetch: customRefetch } = useQuery(GQL.customTasksQuery, {
        fetchPolicy: 'network-only',
    });
    const customTasksData = Helper.syncGetter('tasks', customData);

    const handleDownload = () => {
        ProgressOverlay.show('正在下载懂得赚...');
        const android = RNFetchBlob.android;
        const dirs = RNFetchBlob.fs.dirs;
        RNFetchBlob.config({
            path: dirs.DownloadDir + '/' + 'dongdezhuan' + '.apk',
            fileCache: true,
            appendExt: 'apk',
        })
            .fetch('GET', 'https://dongdezhuan-1254284941.cos.ap-guangzhou.myqcloud.com/android/dongdezhuanBeta.apk')
            .progress((received, total) => {
                ProgressOverlay.progress((received / total) * 100);
            })
            .then(res => {
                if (Platform.OS === 'android') {
                    RNFetchBlob.fs.scanFile([{ path: res.path(), mime: 'application/vnd.android.package-archive' }]);
                }
                console.log('The file saved to ', res.path());
                ProgressOverlay.hide();
                android.actionViewIntent(res.path(), 'application/vnd.android.package-archive');
            })
            .catch(error => {
                ProgressOverlay.hide();
                Toast.show({
                    content: '下载失败',
                });
            });
    };

    const checkPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                handleDownload();
            } else {
                Toast.show({
                    content: '安装失败，未获取下载安全权限，请重试',
                    duration: 2000,
                });
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const download = () => {
        if (installDDZ) {
            AppUtil.OpenApk('com.dongdezhuan');
        } else {
            checkPermission();
        }
    };

    const stateChangeHandle = (event: any) => {
        if (event === 'active') {
            AppUtil.CheckApkExist('com.dongdezhuan', (data: any) => {
                if (data) {
                    setInstallDDZ(true);
                }
            });
        }
    };

    useEffect(() => {
        AppState.addEventListener('change', stateChangeHandle);
        return () => {
            AppState.removeEventListener('change', stateChangeHandle);
        };
    }, [stateChangeHandle]);

    return (
        <>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ backgroundColor: Theme.primaryColor }}>
                    <Image
                        style={{
                            position: 'absolute',
                            top: 0,
                            flex: 1,
                            bottom: 0,
                            right: 0,
                            left: 0,
                            resizeMode: 'cover',
                            height: '100%',
                            width: '100%',
                        }}
                        source={require('@app/assets/images/wallet_back.png')}
                    />
                    <Image
                        source={require('@app/assets/images/create_wallet_guide.gif')}
                        style={{
                            position: 'absolute',
                            top: 25,
                            flex: 1,
                            right: 25,
                            zIndex: 10,
                            resizeMode: 'cover',
                            height: PxDp(40),
                            width: PxDp(85),
                        }}
                    />
                    <View style={{ alignContent: 'center', alignItems: 'center', marginTop: batTop }}>
                        <Text style={{ fontSize: PxDp(20), color: '#FFF' }}>现金余额</Text>
                    </View>
                    <Row style={{ paddingVertical: PxDp(20) }}>
                        <TouchableOpacity
                            style={{ flex: 1, alignContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                authNavigator('WithdrawHistory', {
                                    wallet_id: Helper.syncGetter('wallet.id', userProfile),
                                });
                            }}>
                            <Row>
                                <Image
                                    source={require('@app/assets/images/icon_wallet_rmb.png')}
                                    style={styles.walletItemIcon}
                                />
                                <Text style={{ color: '#FFF' }}>{Config.goldAlias}</Text>

                                <Text
                                    style={{
                                        borderWidth: PxDp(1),
                                        borderColor: '#FFF6',
                                        backgroundColor: '#FFF2',
                                        borderRadius: 10,
                                        marginLeft: 5,
                                        color: '#FFF',
                                        textAlign: 'center',
                                        paddingHorizontal: 6,
                                    }}>
                                    明细
                                </Text>
                            </Row>
                            <Text style={{ fontSize: PxDp(35), color: '#FFF', fontWeight: 'bold' }}>
                                {Helper.syncGetter('gold', userProfile) || 0}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flex: 1, alignContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                authNavigator('Wallet', { user: userProfile });
                            }}>
                            <Row>
                                <Text style={{ color: '#FFF' }}>现金余额（元）</Text>
                                <Iconfont name="right" size={PxDp(11)} color={'#FFF'} />
                            </Row>
                            <Text style={{ fontSize: PxDp(35), color: '#FFF', fontWeight: 'bold' }}>
                                {Helper.syncGetter('reward', userProfile) || 0}
                            </Text>
                        </TouchableOpacity>
                    </Row>
                    <View style={{ alignContent: 'center', alignItems: 'center', paddingBottom: PxDp(15) }}>
                        <Text style={{ color: '#FFF', marginBottom: PxDp(5), fontWeight: 'bold' }}>
                            预计今日转换
                            <Text style={{ color: '#F6DB4A' }}>
                                汇率：{user.exchangeRate || '600'} {Config.goldAlias} / 1元
                            </Text>
                        </Text>
                        <Text style={{ color: '#FFFC' }}>
                            <Iconfont name="bangzhu" size={PxDp(12)} color={'#FFFA'} /> {Config.goldAlias}
                            将于每天凌晨自动兑换为余额
                        </Text>
                    </View>
                </View>

                {taskAD && appStore.enableWallet && (
                    <View style={{ marginTop: PxDp(10) }}>
                        <TouchableOpacity onPress={download}>
                            <Image
                                style={{
                                    width: '90%',
                                    height: PxDp(80),
                                    resizeMode: 'stretch',
                                    marginHorizontal: '5%',
                                }}
                                source={require('@app/assets/images/task_ad_bar1.png')}
                            />
                        </TouchableOpacity>

                        <View style={{ flex: 1, alignItems: 'flex-end', position: 'absolute', top: 0, right: 20 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    // 关闭任务入口
                                    setTaskAD(false);
                                }}>
                                <Iconfont name="guanbi1" size={PxDp(15)} color={Theme.subTextColor} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {isLogin ? (
                    <View style={{ paddingBottom: PxDp(55) }}>
                        <View style={{ borderBottomWidth: 10, borderBottomColor: '#F8F8F8', paddingBottom: 10 }}>
                            <Text
                                style={{
                                    paddingHorizontal: PxDp(15),
                                    paddingVertical: PxDp(15),
                                    fontSize: PxDp(16),
                                    fontWeight: 'bold',
                                }}>
                                奖励任务
                            </Text>
                            <FlatList
                                style={{}}
                                data={customTasksData}
                                keyExtractor={(item: any, index: any) => item.id.toString() || index.toString()}
                                renderItem={({ item, index }) => (
                                    <TaskItme
                                        taskData={item}
                                        setModule={(reward: any) => {
                                            setSucModule(!sucModule);
                                            setSucReward(reward || sucReward);
                                        }}
                                    />
                                )}
                            />
                        </View>
                        <View style={{ borderBottomWidth: 10, borderBottomColor: '#F8F8F8', paddingBottom: 10 }}>
                            <Text
                                style={{
                                    paddingHorizontal: PxDp(15),
                                    paddingVertical: PxDp(15),
                                    fontSize: PxDp(16),
                                    fontWeight: 'bold',
                                }}>
                                新人任务
                            </Text>
                            <FlatList
                                style={{}}
                                data={userTasksData}
                                keyExtractor={(item: any, index: any) => item.id.toString() || index.toString()}
                                renderItem={({ item, index }) => (
                                    <TaskItme
                                        taskData={item}
                                        setModule={(reward: any) => {
                                            setSucModule(!sucModule);
                                            setSucReward(reward || sucReward);
                                        }}
                                    />
                                )}
                            />
                        </View>
                        <View style={{ borderBottomWidth: 10, borderBottomColor: '#F8F8F8', paddingBottom: 10 }}>
                            <Text
                                style={{
                                    paddingHorizontal: PxDp(15),
                                    paddingVertical: PxDp(15),
                                    fontSize: PxDp(16),
                                    fontWeight: 'bold',
                                }}>
                                日常任务
                            </Text>
                            <FlatList
                                style={{}}
                                data={dailyTasksData}
                                keyExtractor={(item: any, index: any) => item.id.toString() || index.toString()}
                                renderItem={({ item, index }) => (
                                    <TaskItme
                                        taskData={item}
                                        setModule={(reward: any) => {
                                            setSucModule(!sucModule);
                                            setSucReward(reward || sucReward);
                                        }}
                                    />
                                )}
                            />
                        </View>
                    </View>
                ) : (
                    <StatusView.EmptyView
                        title="精彩的东西往往需要去登陆！"
                        imageSource={require('@app/assets/images/default_empty.png')}
                    />
                )}
            </ScrollView>
            {sucModule && (
                <HxfModal
                    visible={sucModule}
                    handleVisible={() => {
                        setSucModule(!sucModule);
                    }}>
                    <Row>
                        <Image
                            source={require('@app/assets/images/icon_wallet_rmb.png')}
                            style={{ width: PxDp(50), height: PxDp(50) }}
                        />
                        <View style={styles.SuccessModuleTextBack}>
                            <Text numberOfLines={1}>{sucReward.message || '完成任务获得奖励！'}</Text>
                            <Text numberOfLines={1}>
                                {(sucReward.gold ? Config.goldAlias + ' +' + sucReward.gold : '') +
                                    (sucReward.gold && sucReward.contribute ? '，' : '') +
                                    (sucReward.contribute ? '贡献值 +' + sucReward.contribute : '')}
                            </Text>
                        </View>
                    </Row>

                    <Row style={styles.SuccessModuleButtonBack}>
                        <TouchableOpacity
                            style={styles.SuccessModuleButton}
                            onPress={() => {
                                // console.log("测试",userStore.me.wallet.id);
                                setSucModule(!sucModule);
                                navigation.navigate('WithdrawHistory', {
                                    wallet_id: Helper.syncGetter('wallet.id', userStore.me),
                                });
                            }}>
                            <Text style={styles.SuccessModuleButtonTitle}>我的账单</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.SuccessModuleButton}
                            onPress={() => {
                                setSucModule(!sucModule);
                            }}>
                            <Text style={styles.SuccessModuleButtonTitle}>关闭浮层</Text>
                        </TouchableOpacity>
                    </Row>
                </HxfModal>
            )}
        </>
    );
});

const styles = StyleSheet.create({
    walletItemIcon: {
        borderRadius: PxDp(10),
        height: PxDp(20),
        marginRight: PxDp(10),
        width: PxDp(20),
    },
    SuccessModuleBack: {
        width: Device.WIDTH,
        height: Device.HEIGHT,
        backgroundColor: '#66666699',
        position: 'absolute',
        zIndex: 66,
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        justifyContent: 'center',
        alignContent: 'center',
    },
    SuccessModule: {
        marginHorizontal: '15%',
        backgroundColor: '#FFF',
        position: 'absolute',
        zIndex: 68,
        top: '42%',
        padding: PxDp(20),
        borderRadius: PxDp(10),
    },
    SuccessModuleTextBack: {
        width: Device.WIDTH - (Device.WIDTH * 0.3 + PxDp(90)),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
    SuccessModuleButtonBack: {
        paddingTop: PxDp(20),
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    SuccessModuleButton: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    SuccessModuleButtonTitle: {
        fontWeight: 'bold',
    },
});
