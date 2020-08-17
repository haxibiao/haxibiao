/*
 * created by Bin
 */

import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, FlatList, AppState } from 'react-native';
import { Iconfont, Row, HxfModal, StatusView } from '~/components';
import { useNavigation } from '~/router';
import { observer, appStore, userStore } from '~/store';
import { GQL, useQuery } from '~/apollo';
import { useDetainment, downloadApk } from '~/utils';
import { AppUtil } from 'react-native-ad';
import TaskItem from './components/TaskItem';

const batTop = PxDp(Theme.statusBarHeight);
const bannerWidth = Device.WIDTH - PxDp(30);
const bannerHeight = (bannerWidth * 174) / 624;

export default observer(() => {
    const [taskAD, setTaskAD] = useState(true);
    const navigation = useNavigation();
    useDetainment(navigation);
    const [installDDZ, setInstallDDZ] = useState(false);

    const { login } = userStore;
    const user = userStore.me;
    const isLogin = user.token && login ? true : false;
    let userProfile = {};
    const { data: result, refetch: refetchUserProfile } = useQuery(GQL.userProfileQuery, {
        variables: { id: user.id },
        fetchPolicy: 'network-only',
    });
    const userData = Helper.syncGetter('user', result) || {};
    userProfile = Object.assign({}, user, {
        ...userData,
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
    const { data: userTasks, refetch: refetchUserTask } = useQuery(GQL.userTasksQuery, { fetchPolicy: 'network-only' });
    const userTasksData = Helper.syncGetter('tasks', userTasks);

    const { data: dailyTasks, refetch: refetchDailyTask } = useQuery(GQL.dailyTasksQuery, {
        fetchPolicy: 'network-only',
    });
    const dailyTasksData = Helper.syncGetter('tasks', dailyTasks);

    const { data: customData, refetch: refetchCustomTask } = useQuery(GQL.customTasksQuery, {
        fetchPolicy: 'network-only',
    });
    const customTasksData = Helper.syncGetter('tasks', customData);

    const download = () => {
        if (installDDZ) {
            AppUtil.OpenApk('com.dongdezhuan');
        } else {
            downloadApk();
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
        const navWillFocusListener = navigation.addListener('willFocus', () => {
            refetchUserProfile();
            refetchUserTask();
            refetchDailyTask();
            refetchCustomTask();
        });
        return () => {
            AppState.removeEventListener('change', stateChangeHandle);
            navWillFocusListener.remove();
        };
    }, [stateChangeHandle]);

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
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
                        source={require('!/assets/images/wallet_back.png')}
                    />
                    <Image
                        source={require('!/assets/images/create_wallet_guide.gif')}
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
                                    source={require('!/assets/images/icon_wallet_rmb.png')}
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
                    <View style={{ margin: PxDp(15), marginBottom: PxDp(0) }}>
                        <TouchableOpacity onPress={download}>
                            <Image
                                style={{
                                    width: bannerWidth,
                                    height: bannerHeight,
                                    resizeMode: 'cover',
                                }}
                                source={require('!/assets/images/task_ad_bar1.png')}
                            />
                        </TouchableOpacity>

                        <View style={{ position: 'absolute', top: 5, right: 5 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    // 关闭任务入口
                                    setTaskAD(false);
                                }}>
                                <Iconfont name="guanbi1" size={PxDp(16)} color={'#969696'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {isLogin ? (
                    <>
                        {dailyTasksData && dailyTasksData.length > 0 && (
                            <FlatList
                                style={styles.taskListWrap}
                                contentContainerStyle={styles.taskListContent}
                                data={dailyTasksData}
                                ListHeaderComponent={() => <Text style={styles.listHeader}>日常任务</Text>}
                                keyExtractor={(item: any, index: any) => item.id.toString() || index.toString()}
                                renderItem={({ item }) => (
                                    <TaskItem
                                        taskData={item}
                                        setModule={(reward: any) => {
                                            setSucModule(!sucModule);
                                            setSucReward(reward || sucReward);
                                        }}
                                    />
                                )}
                                ItemSeparatorComponent={() => <View style={styles.taskItemSeparator} />}
                            />
                        )}

                        {userTasksData && userTasksData.length > 0 && (
                            <FlatList
                                style={styles.taskListWrap}
                                contentContainerStyle={styles.taskListContent}
                                data={userTasksData}
                                ListHeaderComponent={() => <Text style={styles.listHeader}>新人任务</Text>}
                                keyExtractor={(item: any, index: any) => item.id.toString() || index.toString()}
                                renderItem={({ item }) => (
                                    <TaskItem
                                        taskData={item}
                                        setModule={(reward: any) => {
                                            setSucModule(!sucModule);
                                            setSucReward(reward || sucReward);
                                        }}
                                        userProfile={userProfile}
                                    />
                                )}
                                ItemSeparatorComponent={() => <View style={styles.taskItemSeparator} />}
                            />
                        )}

                        {customTasksData && customTasksData.length > 0 && (
                            <FlatList
                                style={[styles.taskListWrap]}
                                contentContainerStyle={styles.taskListContent}
                                data={customTasksData}
                                ListHeaderComponent={() => <Text style={styles.listHeader}>奖励任务</Text>}
                                keyExtractor={(item: any, index: any) => item.id.toString() || index.toString()}
                                renderItem={({ item }) => (
                                    <TaskItem
                                        taskData={item}
                                        setModule={(reward: any) => {
                                            setSucModule(!sucModule);
                                            setSucReward(reward || sucReward);
                                        }}
                                    />
                                )}
                                ItemSeparatorComponent={() => <View style={styles.taskItemSeparator} />}
                            />
                        )}
                    </>
                ) : (
                    <StatusView.EmptyView
                        title="精彩的东西往往需要去登陆！"
                        imageSource={require('!/assets/images/default_empty.png')}
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
                            source={require('!/assets/images/icon_wallet_rmb.png')}
                            style={{ width: PxDp(50), height: PxDp(50) }}
                        />
                        <View style={styles.SuccessModuleTextBack}>
                            <Text numberOfLines={1}>{sucReward.message || '完成任务获得奖励！'}</Text>
                            <Text numberOfLines={1}>
                                {(sucReward.gold ? Config.goldAlias + ' +' + sucReward.gold : '') +
                                    (sucReward.gold && sucReward.contribute ? '，' : '') +
                                    (sucReward.contribute ? `${Config.limitAlias} +` + sucReward.contribute : '')}
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
                                    tabPage: 2,
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
    container: {
        flexGrow: 1,
        backgroundColor: '#F5F6FB',
        paddingBottom: PxDp(Theme.BOTTOM_HEIGHT),
    },
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
    listHeader: {
        color: '#202020',
        margin: PxDp(15),
        marginBottom: PxDp(5),
        fontSize: PxDp(18),
        fontWeight: 'bold',
        backgroundColor: '#ffffff',
    },
    taskListWrap: {
        marginBottom: PxDp(20),
        marginHorizontal: PxDp(15),
    },
    taskListContent: {
        flexGrow: 1,
        borderRadius: PxDp(10),
        overflow: 'hidden',
        backgroundColor: '#ffffff',
    },
    taskItemSeparator: {
        height: PxDp(1),
        backgroundColor: '#F5F6FB',
    },
});
