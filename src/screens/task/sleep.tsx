import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

import { PageContainer, SpinnerLoading } from '@src/components';

import { ttad } from '../../native';

import { appStore } from '@src/store';
import { Query, useQuery, GQL } from '@src/apollo';

const testData = {
    id: 10,
    status: 1,
    name: 'SleepMorning',
    task_status: -1,
    reward_info: {
        gold: 43,
        contribute: 2,
    },
    start_at: '2019-12-03 06:00:00',
};

export default (props: any) => {
    const { data, refetch } = useQuery(GQL.sleepTaskQuery,{fetchPolicy: 'network-only'});
    let sleepData = Helper.syncGetter('SleepTask', data);

    console.log('睡觉打卡', data);

    const goTask = () => {
        ttad.RewardVideo.loadAd().then(() => {
            ttad.RewardVideo.startAd().then(result => {
                if (JSON.parse(result).ad_click) {
                    // 点击了激励视频
                    getReward();
                    Toast.show({ content: '打卡成功！', duration: 1500 });
                } else if (JSON.parse(result).video_play) {
                    // 广告播放完成
                    getReward();
                    Toast.show({ content: '打卡成功！', duration: 1500 });
                } else {
                    Toast.show({ content: '视频未看完，打卡失败！', duration: 1500 });
                }
            });
        });
    };


    const getReward = () => {
        appStore.client
            .mutate({
                mutation: GQL.drinkWaterRewardMutation,
            })
            .then((data: any) => {
                // 获取奖励
                // console.log(TAG,"(请求获取奖励接口)",data);
                Toast.show({ content: data.data.DrinkWaterReward.content, duration: 1500 });
            });
    };

    let is_night = false;
    let is_satrt = false;
    if (sleepData) {
        is_night = !sleepData.sleep_status;
        is_satrt = sleepData.task_status === 1 ? false : true;
    }

    return (
        <>
            {sleepData ? (
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
                            uri: is_night
                                ? 'http://cos.haxibiao.com/storage/image/1572509711n37goPKcu1F8qN32.png'
                                : 'http://cos.haxibiao.com/storage/image/1574747648Vxb8VoAUCR64aZ96.png',
                        }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 100,
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <TouchableOpacity
                            disabled={is_satrt}
                            style={{
                                paddingHorizontal: 35,
                                paddingVertical: 15,
                                backgroundColor: is_satrt ? '#eb687766' : '#eb6877',
                                borderRadius: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={goTask}>
                            <Text style={{ color: '#fdc625', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>
                                {is_night ? '睡觉' : '起床'}
                            </Text>
                        </TouchableOpacity>
                        <Text style={{ color: '#FFF', marginTop: 20, fontSize: 16 }}>
                            {sleepData.details || is_night ? '晚上 8 点可以打睡觉卡' : '早上 8 点可以打起床卡'}
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
