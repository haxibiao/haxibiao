import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Linking, TouchableWithoutFeedback } from 'react-native';

import WaterCup from './components/WaterCup';
import { PageContainer, Row, SpinnerLoading } from '@src/components';

import { ttad } from '@src/native';

import { appStore, userStore } from '@src/store';
import { Query, useQuery, useMutation, GQL } from '@src/apollo';
import { FlatList } from 'react-native-gesture-handler';

import { useNavigation } from '@src/router';

const TAG = '-----------------------------------\n任务页面：';

type Props = {
    taskData: any;
    setModule: Function;
};

const TaskItme = (props: Props) => {
    // console.log(TAG,taskData);

    const navigation = useNavigation();
    const setModule = props.setModule;
    const {
        id,
        name,
        details,
        submit_name,
        type,
        task_status,
        progress_details,
        reward_info,
        taskInfo,
    } = props.taskData;

    // 请求激励视频任务奖励接口，触发点击广告
    const [onClickRewardVideo] = useMutation(GQL.ADRewardVideoMutation, {
        variables: {
            is_click: true,
        },
        onCompleted: (data:any) => {
            setModule(data.playADVideo);
        },
        onError: (error:any) => {
            Toast.show({ content: '服务器响应失败！', duration: 1000 });
        },
    });

    // 请求激励视频任务奖励接口，看完视频
    const [onRewardVideo] = useMutation(GQL.ADRewardVideoMutation, {
        variables: {
            is_click: false,
        },
        onCompleted: (data:any) => {
            setModule(data.playADVideo);
        },
        onError: (error:any) => {
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
                toComplete( taskInfo ? taskInfo.router : 'null');
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
                let reward = data.data.rewardTask.reward_info;
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
            case 'ToComment':
                Linking.openURL(
                    Device.IOS
                        ? 'itms-apps://itunes.apple.com/app/id1434767781'
                        : 'market://details?id=' + Config.AppID,
                );
                break;
            case 'MotivationalVideo':
                MotivationalVideo();
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
        ttad.RewardVideo.loadAd().then(() => {
            ttad.RewardVideo.startAd().then((result: any) => {

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
        <Row style={{ paddingHorizontal: 20, paddingVertical: 5, marginBottom: 5 }}>
            <View style={{ backgroundColor: '#EEE', borderRadius: 10 }}>
                <Image
                    source={require('@src/assets/images/icon_wallet_rmb.png')}
                    style={{ height: PxDp(40), width: PxDp(50), marginHorizontal: 10 }}
                />
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#CCC',
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
                        backgroundColor: '#F6DB4A',
                        paddingVertical: PxDp(10),
                        paddingHorizontal: PxDp(15),
                    }}
                    onPress={() => goTask(type)}>
                    <Text style={{ color: '#000', fontWeight: 'bold' }}>{submit_name}</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    disabled={true}
                    style={{
                        width: PxDp(80),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 100,
                        backgroundColor: '#F6DB4A55',
                        paddingVertical: PxDp(10),
                        paddingHorizontal: PxDp(15),
                    }}>
                    <Text style={{ color: '#000', fontWeight: 'bold' }}>{submit_name}</Text>
                </TouchableOpacity>
            )}
        </Row>
    );
};

export default (props: any) => {
    const navigation = useNavigation();
    const [sucModule, setSucModule] = useState(false);
    const [sucReward, setSucReward] = useState({ message: null, gold: null, contribute: null });
    const { data, refetch } = useQuery(GQL.tasksQuery, { fetchPolicy: 'network-only' });
    let listData = Helper.syncGetter('tasks', data);

    return (
        <>
            {listData ? (
                <>
                    <PageContainer title="任务中心">
                        <FlatList
                            style={{ paddingVertical: 10, minHeight: '100%' }}
                            data={listData}
                            keyExtractor={(item, index) => item.id.toString() || index.toString()}
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
                    </PageContainer>

                    {sucModule && (
                        <>
                            <View style={styles.SuccessModule}>
                                <Row>
                                    <Image
                                        source={require('@src/assets/images/icon_wallet_rmb.png')}
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
                                    <TouchableOpacity style={styles.SuccessModuleButton} onPress={()=>{
                                        // console.log("测试",userStore.me.wallet.id);
                                        navigation.goBack();
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
                            </View>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    setSucModule(!sucModule);
                                }}>
                                <View style={styles.SuccessModuleBack} />
                            </TouchableWithoutFeedback>
                        </>
                    )}
                </>
            ) : (
                <SpinnerLoading />
            )}
        </>
    );
};

const styles = StyleSheet.create({
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
