import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

import { PageContainer, SpinnerLoading, HxfModal, Row } from '@src/components';

import { ad } from '@src/native';
import { Overlay } from 'teaset';

import { useNavigation } from '@src/router';
import { appStore } from '@src/store';
import { Query, useQuery, GQL, useMutation } from '@src/apollo';

export default (props: any) => {
    const { data, refetch } = useQuery(GQL.rewardVideoQuery, { fetchPolicy: 'network-only' });
    const ruleText = Helper.syncGetter('queryDetail', data);

    const navigation = useNavigation();

    let overlayRef: any;
    const overlayView = (sucReward: any) => (
        <Overlay.View
            visible={false}
            style={{ justifyContent: 'center', alignItems: 'center' }}
            ref={(ref: any) => {
                overlayRef = ref;
            }}>
            <View style={styles.SuccessModule}>
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

                <View>
                    <ad.FeedAd
                        adWidth={Device.WIDTH * 0.75}
                        visibleHandler={true}
                        visible={true}
                        onClick={() => {
                            overlayRef.close();
                            appStore.client
                                .mutate({
                                    mutation: GQL.clickFeedAD,
                                })
                                .then((data: any) => {
                                    const { amount, message } = Helper.syncGetter('data.clickFeedAD2', data);
                                    Toast.show({
                                        content: message || `+${amount || 0} 用户行为贡献`,
                                        duration: 1500,
                                    });
                                });
                        }}
                    />
                </View>

                <Row style={styles.SuccessModuleButtonBack}>
                    <TouchableOpacity
                        style={styles.SuccessModuleButton}
                        onPress={() => {
                            // console.log("测试",userStore.me.wallet.id);
                            overlayRef.close();
                            navigation.navigate('WithdrawHistory', {
                                wallet_id: Helper.syncGetter('wallet.id', 0),
                            });
                        }}>
                        <Text style={styles.SuccessModuleButtonTitle}>我的账单</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.SuccessModuleButton}
                        onPress={() => {
                            overlayRef.close();
                        }}>
                        <Text style={styles.SuccessModuleButtonTitle}>关闭浮层</Text>
                    </TouchableOpacity>
                </Row>
            </View>
        </Overlay.View>
    );

    function setModule(reward: any) {
        Overlay.show(overlayView(reward || { message: null, gold: null, contribute: null }));
    }

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

    return (
        <PageContainer hiddenNavBar={true}>
            <Image
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                }}
                source={{
                    uri: 'http://cos.haxibiao.com/images/kanshipin2.png',
                }}
            />
            <View
                style={{
                    position: 'absolute',
                    bottom: 20,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text
                    style={{ color: '#666', marginTop: 20, fontSize: 16, marginBottom: 30, paddingHorizontal: 20 }}
                    numberOfLines={7}>
                    {ruleText ||
                        `贡献值获取方式：\n1.完成早晚两次睡觉打卡可获得2点贡献奖励\n2.完成看视频任务并下载可获得3点贡献值奖励\n3.在首页刷视频时点击广告可以获得1点贡献值奖励\n4.在动态广场看到广告时点击可获得1点贡献值奖励`}
                </Text>
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 100,
                        backgroundColor: Theme.secondaryColor,
                        paddingVertical: PxDp(15),
                        paddingHorizontal: PxDp(30),
                    }}
                    onPress={() => {
                        MotivationalVideo();
                    }}>
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>立即观看视频，获取奖励</Text>
                </TouchableOpacity>
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: '#fff',
        flexGrow: 1,
        paddingTop: Device.WIDTH * 0.75,
    },
    profileView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: Device.WIDTH,
        height: Device.WIDTH * 0.75,
        overflow: 'hidden',
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
