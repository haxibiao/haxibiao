import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

import { PageContainer, SpinnerLoading } from '@src/components';

import { ad } from '../../native';

import { appStore } from '@src/store';
import { useCountDown } from '@src/common';
import { Query, useQuery, GQL } from '@src/apollo';
import { useNavigation } from '@src/router';
import RewardPopup from './components/RewardPopup';

export default (props: any) => {
    const awaitingTime = useRef(appStore.adWaitingTime);
    const countDown = useCountDown({
        expirationTime: awaitingTime.current,
    });
    useEffect(() => {
        if (countDown.isEnd) {
            awaitingTime.current = appStore.adWaitingTime;
        }
    }, [appStore.timeForLastAdvert]);

    const { data, refetch } = useQuery(GQL.sleepTaskQuery, { fetchPolicy: 'network-only' });
    const sleepData = Helper.syncGetter('SleepTask', data);
    const id = Helper.syncGetter('id', sleepData);
    const backgroundImg = Helper.syncGetter('background_img', sleepData);
    const butTitle = Helper.syncGetter('name', sleepData);
    const navigation = useNavigation();

    // console.log('睡觉打卡', id);

    const goTask = () => {
        const thisTime = parseInt(new Date().getTime() / 1000 + '');
        const oldTime = appStore.timeShowAD;
        const newTime = oldTime + 120;

        if (newTime > thisTime) {
            // 间隔时间大于当前时间，不播放广告
            Toast.show({ content: `${newTime - thisTime} 秒后才能做任务哦！`, duration: 1500 });
            return new Promise((resolve, reject) => {
                reject(false);
            });
        } else {
            goAD();
        }
    };

    const goAD = () => {
        ad.RewardVideo.loadAd({ intervalTime: 0 }).then(() => {
            ad.RewardVideo.startAd().then(
                (result: any) => {
                    // if (JSON.parse(result).ad_click) {
                    // 点击了激励视频
                    // } else if (JSON.parse(result).video_play) {
                    // 广告播放完成
                    // } else {
                    //     Toast.show({ content: '视频未看完，打卡失败！', duration: 1500 });
                    // }
                    getReward();
                },
                (error: any) => {
                    ad.RewardVideo.checkResult(error);
                },
            );
        });
    };

    const getReward = () => {
        appStore.client
            .mutate({
                mutation: GQL.sleepRewardMutation,
                variables: {
                    id,
                },
                refetchQueries: () => [
                    {
                        query: GQL.sleepTaskQuery,
                    },
                ],
            })
            .then((data: any) => {
                // 获取奖励
                console.log('(请求获取睡觉奖励接口)', data);
                const message = Helper.syncGetter('data.SleepReward.content', data) || null;
                const gold = Helper.syncGetter('data.SleepReward.task.reward_info.gold', data) || null;
                const contribute = Helper.syncGetter('data.SleepReward.task.reward_info.contribute', data) || null;
                const reward = { message, gold, contribute };
                RewardPopup({ reward, navigation });
                // Toast.show({ content: data.data.SleepReward.content, duration: 1500 });
            })
            .catch((err: any) => {
                Toast.show({ content: err.message.replace('GraphQL error: ', '') || '服务器问题，未知问题！' });
                // console.log('睡觉err：', err);
            });
    };

    let is_night = false;
    let is_start = false;
    if (sleepData) {
        is_night = !sleepData.sleep_status;
        is_start = sleepData.task_status === 1 ? false : true;
        console.log('睡觉', sleepData);
    }

    return (
        <>
            {sleepData ? (
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
                            uri:
                                backgroundImg || 'http://cos.haxibiao.com/storage/image/1572509711n37goPKcu1F8qN32.png',
                        }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 100,
                            width: Device.WIDTH,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <TouchableOpacity
                            disabled={!countDown.isEnd || is_start}
                            style={{
                                paddingHorizontal: 35,
                                paddingVertical: 15,
                                backgroundColor: !countDown.isEnd ? '#969696' : is_start ? '#eb687766' : '#eb6877',
                                borderRadius: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={goTask}>
                            <Text
                                style={{
                                    color: !countDown.isEnd ? '#fff' : '#fdc625',
                                    textAlign: 'center',
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                }}>
                                {butTitle}
                                {countDown.isEnd ? '' : ` ${countDown.minutes}:${countDown.seconds}`}
                            </Text>
                        </TouchableOpacity>
                        <Text style={{ color: '#FFF', marginTop: 20, fontSize: 16 }}>
                            {sleepData.details ||
                                (is_night ? '每个小时可以打睡觉卡一次' : '睡觉至少15分钟才可以打起床卡')}
                        </Text>
                    </View>
                </PageContainer>
            ) : (
                <SpinnerLoading />
            )}
        </>
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
});
