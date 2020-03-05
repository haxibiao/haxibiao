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
import { PageContainer, Iconfont, Row, HxfModal, GradientView, PopOverlay, StatusView } from '@src/components';
import { middlewareNavigate, useNavigation, useNavigationParam } from '@src/router';
import StoreContext, { observer, appStore, userStore } from '@src/store';
import { GQL, useMutation, useQuery } from '@src/apollo';
import { useDetainment, downloadApk } from '@src/common';
import { ad, AppUtil } from '@src/native';

interface Props {
    taskData: any;
    setModule: Function;
    userProfile?: any;
}

export default (props: Props) => {
    const navigation = useNavigation();
    const { setModule, taskData } = props;
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
    } = taskData;

    // 任务图标获取
    const taskIcon = icon
        ? {
              uri: icon,
          }
        : require('@app/assets/images/task_gift.png');

    // 请求激励视频任务奖励接口，触发点击广告
    const [onClickRewardVideo] = useMutation(GQL.ADRewardVideoMutation, {
        variables: {
            is_click: true,
        },
        refetchQueries: () => [
            {
                query: GQL.userProfileQuery,
                variables: { id: userStore.me.id },
            },
        ],
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
        refetchQueries: () => [
            {
                query: GQL.userProfileQuery,
                variables: { id: userStore.me.id },
            },
        ],
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
        }
    };

    // 每日任务响应事件
    const dailyTask = (start: number) => {
        switch (start) {
            case 0:
                // 每日任务领取奖励
                toNovice(taskInfo ? taskInfo.router : 'null');
                break;
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
                // 获取奖励 console.log(TAG, '(请求接受任务接口)', data);
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
                refetchQueries: () => [
                    {
                        query: GQL.userProfileQuery,
                        variables: { id: userStore.me.id },
                    },
                ],
            })
            .then((data: any) => {
                // 获取奖励 console.log(TAG, '(请求领取奖励接口)', data);
                const reward = data.data.rewardTask.reward_info;
                setModule(reward);
            });
    };

    // 自定义任务路由响应
    const toComplete = (router: string) => {
        switch (router) {
            case 'GoSleep':
                // 睡觉打卡
                navigation.navigate('TaskSleep');
                break;
            case 'GoDrinkWater':
                // 喝水打卡
                navigation.navigate('TaskDrinkWater');
                break;
            case 'ToPraise':
                // 好评任务
                navigation.navigate('Praise');
                break;
            case 'TaskNewUserBook':
                // 新人教程
                navigation.navigate('TaskNewUserBook');
                break;
            case 'MotivationalVideo':
                // 激励视频任务
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
                // 编辑个人资料
                navigation.goBack();
                navigation.navigate('编辑个人资料');
                break;
            case 'accountBinding':
                // 安全中心
                navigation.goBack();
                navigation.navigate('AccountSecurity', { user: props.userProfile });
                break;
            case 'postNews':
                // 发布原创视频
                navigation.goBack();
                navigation.navigate('AskQuestion');
                break;
            case 'GoDYTutorial':
                // 采集视频教程
                navigation.goBack();
                navigation.navigate('SpiderVideo');
                break;
            case 'withdrawMoney':
                // 钱包页面
                navigation.goBack();
                navigation.navigate('Wallet');
                break;
            case 'GoSleep':
                // 睡觉打卡
                navigation.navigate('TaskSleep');
                break;
            case 'GoDrinkWater':
                // 喝水打卡
                navigation.navigate('TaskDrinkWater');
                break;
            case 'ToPraise':
                // 好评任务
                navigation.navigate('Praise');
                break;
            case 'TaskNewUserBook':
                // 新手教程
                navigation.navigate('TaskNewUserBook');
                break;
            case 'MotivationalVideo':
                // 看激励视频
                // MotivationalVideo();
                navigation.navigate('TaskRewardVideo');
                break;
            default:
                Toast.show({ content: '请前往完成任务…' });
        }
    };

    // 看激励视频
    const MotivationalVideo = () => {
        // setModule({ message: '观看视频并点击！', gold: 666, contribute: 999 });
        ad.RewardVideo.loadAd().then(() => {
            ad.RewardVideo.startAd().then(
                (result: any) => {
                    if (JSON.parse(result).ad_click) {
                        // 点击了激励视频
                        onClickRewardVideo();
                    } else if (JSON.parse(result).video_play) {
                        // 广告播放完成
                        onRewardVideo();
                    } else {
                        Toast.show({ content: '视频未看完，任务失败！', duration: 1500 });
                    }
                },
                (error: any) => {
                    ad.RewardVideo.checkResult(error);
                },
            );
        });
    };

    const TaskButton = useMemo(() => {
        if (!task_status || task_status === 2) {
            return (
                <GradientView
                    style={styles.taskButton}
                    colors={task_status === 2 ? ['#FF825C', '#FE6560'] : ['#53C4FC', '#15A9FE']}>
                    <TouchableOpacity style={styles.center} onPress={() => goTask(type)}>
                        <Text style={styles.taskButtonName}>{submit_name}</Text>
                    </TouchableOpacity>
                </GradientView>
            );
        } else {
            return (
                <View style={styles.taskButton}>
                    <Text style={styles.taskButtonName}>{submit_name}</Text>
                </View>
            );
        }
    }, [taskData]);

    return (
        <View style={styles.taskItem}>
            <View style={styles.iconWrap}>
                <Image source={taskIcon} style={styles.icon} />
            </View>
            <View style={styles.taskContent}>
                <View style={styles.taskContentTop}>
                    <Text numberOfLines={1} style={styles.taskName}>
                        {name}
                        {progress_details && (
                            <Text style={styles.taskProgress}>
                                (<Text style={[styles.taskProgress, { color: '#E0482B' }]}>{progress_details}</Text>)
                            </Text>
                        )}
                    </Text>
                </View>
                <View style={styles.taskContentBottom}>
                    <Text numberOfLines={1} style={styles.taskDetails}>
                        {details}
                    </Text>
                </View>
            </View>
            <View style={styles.taskButtonWrap}>
                <Row style={{ marginBottom: PxDp(8) }}>
                    <Text numberOfLines={1} style={styles.taskRewardInfo}>
                        +{reward_info.gold || 0}
                    </Text>
                    <Image source={require('@app/assets/images/icon_wallet_dmb.png')} style={styles.goldIcon} />
                </Row>
                {TaskButton}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    taskItem: {
        padding: PxDp(14),
        paddingHorizontal: PxDp(12),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    iconWrap: {
        height: PxDp(50),
        width: PxDp(50),
        borderRadius: PxDp(25),
        backgroundColor: '#ECEAF3',
    },
    icon: {
        height: PxDp(50),
        width: PxDp(50),
        borderRadius: PxDp(25),
    },
    taskContent: {
        paddingHorizontal: PxDp(10),
        flex: 1,
        alignSelf: 'auto',
    },
    taskContentTop: {
        marginBottom: PxDp(6),
    },
    taskName: {
        color: '#202020',
        fontSize: PxDp(17),
        fontWeight: 'bold',
    },
    taskProgress: {
        color: '#202020',
        fontSize: PxDp(12),
        fontWeight: 'bold',
    },
    taskRewardInfo: {
        color: '#E64326',
        fontSize: PxDp(14),
        fontWeight: 'bold',
    },
    taskContentBottom: {},
    taskDetails: {
        color: '#969696',
        fontSize: PxDp(14),
    },
    goldIcon: {
        height: PxDp(15),
        width: PxDp(15),
        marginLeft: PxDp(2),
    },
    taskButtonWrap: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    taskButton: {
        width: PxDp(80),
        height: PxDp(30),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: PxDp(16),
        paddingHorizontal: PxDp(10),
        backgroundColor: '#E8E8E8',
    },
    taskButtonName: {
        color: '#FFF',
        fontSize: PxDp(15),
        fontWeight: 'bold',
    },
});
