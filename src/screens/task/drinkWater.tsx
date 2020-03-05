import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList } from 'react-native';

import WaterCup from './components/WaterCup';
import { PageContainer, Row, SpinnerLoading } from '@src/components';

import { ad } from '../../native';

import { appStore, userStore } from '@src/store';
import { Query, useQuery, GQL } from '@src/apollo';

const TAG = '喝水打卡：';

interface Props {
    waterData: any;
    update: any;
}
const width = Device.WIDTH;
const height = Device.HEIGHT;

const date = new Date();
const hour = date.getHours().toString();
const year = date.getFullYear().toString();
const month = (date.getMonth() + 1).toString();
const day = date.getDate().toString();

const DrinkButton = (props: Props) => {
    const { id, task_status, start_time, task_progress } = props.waterData;
    const back_color = task_status === 3 ? '#89E46D' : task_status === 1 ? '#4B7DC9' : '#4B7DC9';
    const cap_img =
        task_status === 3 ? require('@app/assets/images/captwo.png') : require('@app/assets/images/capone.png');
    const sub_text =
        task_status === 3 ? '✔' : task_status === 1 ? '打卡' : task_status === -1 ? '补喝' : start_time + '后';

    const checkIn = () => {
        appStore.client
            .mutate({
                mutation: GQL.drinkWaterMutation,
                variables: {
                    id,
                },
            })
            .then((data: any) => {
                // 打卡成功
                // console.log(TAG,"(打卡或补卡成功回调数据)",data);
                if (data.data.DrinkWater[0].task_progress === 1) {
                    // 获取
                    getReward();
                }
                props.update();
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

    const replacementCard = () => {
        ad.RewardVideo.loadAd().then(() => {
            ad.RewardVideo.startAd().then(
                (result: any) => {
                    if (JSON.parse(result).ad_click) {
                        // 点击了激励视频
                        checkIn();
                        Toast.show({ content: '补卡成功！', duration: 1500 });
                    } else if (JSON.parse(result).video_play) {
                        // 广告播放完成
                        checkIn();
                        Toast.show({ content: '补卡成功！', duration: 1500 });
                    } else {
                        Toast.show({ content: '视频未看完，补卡失败！', duration: 1500 });
                    }
                },
                (error: any) => {
                    ad.RewardVideo.checkResult(error);
                },
            );
        });
    };

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: back_color }]}
            disabled={task_status === 3 || task_status === 0 ? true : false}
            onPress={() => {
                if (task_status === 1) {
                    checkIn();
                } else {
                    replacementCard();
                }
            }}>
            <Text style={styles.buttonText}>{sub_text}</Text>
            <Image
                style={{
                    width: PxDp(25),
                    height: PxDp(33),
                    position: 'absolute',
                    bottom: -1,
                    right: -28,
                }}
                source={cap_img}
            />
            {/* <Text style={styles.buttonTextSub}>{start_time}</Text> */}
        </TouchableOpacity>
    );
};

export default (props: any) => {
    const time = year + '年' + month + '月' + day + '日';
    const [value, setValue] = useState(0);
    const { data, refetch } = useQuery(GQL.drinkWaterListQuery, { fetchPolicy: 'network-only' });
    const back_img =
        hour > 6 || hour < 18 ? require('@app/assets/images/he_back.png') : require('@app/assets/images/he_back.png');
    const top_img =
        (hour > 6) & (hour < 18) ? require('@app/assets/images/taiyang.png') : require('@app/assets/images/heyue.png');
    const hi_text = (hour > 6) & (hour < 18) ? (hour < 12 ? 'HI,上午好' : 'HI,下午好') : 'HI,晚上好';
    let listData = Helper.syncGetter('DrinkWaterTasks', data);
    // console.log("userStore from store : ",userStore.me)

    const upListData = () => {
        refetch().then((data: any) => {
            listData = Helper.syncGetter('data.DrinkWaterTasks', data);
            console.log(TAG, '(更新数据)', listData);
        });
    };

    useEffect(() => {
        setValue(listData ? listData[0].task_progress * 100 : 0);
    });

    return (
        <>
            {listData ? (
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
                        source={back_img}
                    />
                    <Image
                        style={{
                            width: height * 0.23,
                            height: height * 0.23,
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            resizeMode: 'stretch',
                        }}
                        source={top_img}
                    />
                    <View
                        style={{
                            width: 300,
                            position: 'absolute',
                            top: 80,
                            left: 20,
                        }}>
                        <Text style={{ fontSize: 40, color: '#FFFFFF', marginBottom: 10 }}>{hi_text}</Text>
                        <Text style={{ fontSize: 20, color: '#F8F8F8' }}>{time}</Text>
                    </View>
                    <Row
                        style={{
                            flex: 1,
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 25,
                        }}>
                        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text
                                style={{
                                    fontSize: 40,
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    fontWeight: 'bold',
                                }}>
                                {value + '%'}
                            </Text>
                            <WaterCup value={value} />
                        </View>

                        <View style={{ flex: 0.5, marginTop: height * 0.25 }}>
                            <FlatList
                                data={listData}
                                keyExtractor={(item, index) => item.id.toString() || index.toString()}
                                renderItem={({ item, index }) => <DrinkButton waterData={item} update={upListData} />}
                            />
                        </View>
                    </Row>
                    {/* <Image
                        style={{
                            width: 80,
                            height:541,
                            position: 'absolute',
                            top: 175,
                            right: -10,
                            resizeMode : 'stretch',
                        }}
                    
                        source={require('@app/assets/images/chizi.png')}
                    /> */}
                    <Image
                        style={{
                            width: 100,
                            height: height * 0.78,
                            position: 'absolute',
                            top: height * 0.19,
                            right: -15,
                            resizeMode: 'stretch',
                        }}
                        source={require('@app/assets/images/chizi.png')}
                    />

                    <Text
                        style={{
                            fontSize: 16,
                            color: '#FZE9FF',
                            position: 'absolute',
                            bottom: 30,
                            left: 20,
                            right: 20,
                        }}>
                        每天八杯水，健康好生活。
                    </Text>
                </PageContainer>
            ) : (
                <SpinnerLoading />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        marginRight: PxDp(60),
        marginLeft: 15,
        marginVertical: height * 0.02,
        paddingVertical: height * 0.007,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#EFF3FA',
        textAlign: 'center',
        fontSize: height * 0.02,
        fontWeight: 'bold',
    },
});
