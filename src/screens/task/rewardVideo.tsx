import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

import { PageContainer, SpinnerLoading, HxfModal, Row } from '@src/components';

import { ad } from '@native';
import { Overlay } from 'teaset';

import { useCountDown } from '@src/common';
import { useNavigation } from '@src/router';
import { appStore, userStore } from '@src/store';
import { Query, useQuery, GQL, useMutation } from '@src/apollo';

import RewardPopup from './components/RewardPopup';

export default (props: any) => {
    const awaitingTime = useRef(appStore.adWaitingTime);
    const navigation = useNavigation();
    const countDown = useCountDown({
        expirationTime: awaitingTime.current,
    });

    useEffect(() => {
        if (countDown.isEnd) {
            awaitingTime.current = appStore.adWaitingTime;
        }
    }, [appStore.timeForLastAdvert]);

    const { data, refetch } = useQuery(GQL.rewardVideoQuery, { fetchPolicy: 'network-only' });
    const ruleText = Helper.syncGetter('queryDetail', data);

    function setModule(mReward: any) {
        const reward = mReward || { message: null, gold: null, contribute: null };
        RewardPopup({ reward, navigation });
    }

    // 看激励视频
    const MotivationalVideo = () => {
        // setModule({ message: '观看视频并点击！', gold: 666, contribute: 999 });
        ad.RewardVideo.loadAd().then(() => {
            ad.RewardVideo.startAd().then(
                (result: any) => {
                    let json = JSON.parse(result);
                    if (json.ad_click) {
                        // 点击了激励视频
                        onClickRewardVideo();
                    } else if (json.video_play) {
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
            recordTime = Date.now();
            setModule(data.playADVideo);
        },
        onError: (error: any) => {
            Toast.show({ content: '服务器响应失败！' + error, duration: 1000 });
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
            recordTime = Date.now();
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
                    backgroundColor: '#0001',
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
                        `${Config.limitAlias}获取方式：\n1.每小时看完睡觉和起床视频(+2${Config.limitAlias})\n2.看视频任务(限30次)(需下载)(+3${Config.limitAlias})\n3.刷视频时，查看视频广告(+1${Config.limitAlias})\n4.动态广场，查看广告动态(+1${Config.limitAlias})`}
                </Text>
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: PxDp(22),
                        backgroundColor: countDown.isEnd ? Theme.secondaryColor : '#969696',
                        width: PxDp(140),
                        height: PxDp(44),
                    }}
                    disabled={!countDown.isEnd}
                    onPress={() => {
                        MotivationalVideo();
                    }}>
                    <Text style={{ color: '#FFF', fontSize: PxDp(15), fontWeight: 'bold' }}>
                        {countDown.isEnd ? '立即获取奖励' : `还需等待 ${countDown.minutes}:${countDown.seconds}`}
                    </Text>
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
    countDown: {
        color: Theme.watermelon,
        fontSize: PxDp(20),
        fontWeight: 'bold',
        marginTop: PxDp(10),
    },
});
