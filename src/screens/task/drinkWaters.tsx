import React, { useRef, useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList } from 'react-native';

import WaterCup from './components/WaterCup.back';
import { PageContainer, Row, SpinnerLoading } from '~components';

import { ad } from 'react-native-ad';

import { useCountDown } from '~utils';
import { appStore, userStore } from '~store';
import { Query, useQuery, GQL } from '~apollo';

import { useNavigation } from '~router';
import RewardPopup from './components/RewardPopup';
const TAG = '喝水打卡：';

interface Props {
	waterData: any;
	update: any;
}

const DrinkButton = (props: Props) => {
	const navigation = useNavigation();
	const { id, task_status, start_time, task_progress } = props.waterData;

	const disabled = task_status === 3 || task_status !== 1 ? props.disabled : false;
	const back_color =
		task_status === 3 ? '#20b39c' : task_status === 1 ? '#eb6866' : props.disabled ? '#969696' : '#eb686699';
	const sub_text = task_status === 3 ? '完成' : task_status === 1 ? '打卡' : task_status === -1 ? '补卡' : '未到';

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
			})
			.catch((err: any) => {
				Toast.show({ content: err.message.replace('GraphQL error: ', '') || '服务器问题，未知问题！' });
				// console.log('睡觉err：', err);
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
				const message = Helper.syncGetter('data.SleepReward.content', data) || null;
				const gold = Helper.syncGetter('data.SleepReward.task.reward_info.gold', data) || null;
				const contribute = Helper.syncGetter('data.SleepReward.task.reward_info.contribute', data) || null;
				const reward = { message, gold, contribute };
				RewardPopup({ reward, navigation });
				// Toast.show({ content: data.data.DrinkWaterReward.content, duration: 1500 });
			})
			.catch((err: any) => {
				Toast.show({ content: err.message.replace('GraphQL error: ', '') || '服务器问题，未知问题！' });
				// console.log('睡觉err：', err);
			});
	};

	const replacementCard = () => {
		ad.RewardVideo.loadAd().then(() => {
			ad.RewardVideo.startAd().then(
				(result) => {
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
			disabled={disabled}
			onPress={() => {
				if (task_status === 1) {
					checkIn();
				} else {
					replacementCard();
				}
			}}>
			<Text
				style={[
					styles.buttonText,
					{ color: task_status !== 3 && task_status !== 1 && disabled ? '#ffffff' : '#fdc625' },
				]}>
				{sub_text}
			</Text>
			<Text style={styles.buttonTextSub}>{start_time}</Text>
		</TouchableOpacity>
	);
};

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

	const [value, setValue] = useState(0);
	const { data, refetch } = useQuery(GQL.drinkWaterListQuery, { fetchPolicy: 'network-only' });
	const listData = useMemo(() => {
		const drinkWaterTasks = Helper.syncGetter('DrinkWaterTasks', data);
		if (Array.isArray(drinkWaterTasks)) {
			return [...drinkWaterTasks];
		}
	}, [countDown.isEnd, data]);
	// console.log("userStore from store : ",userStore.me)

	useEffect(() => {
		setValue(listData ? listData[0].task_progress * 100 : 0);
	}, [listData]);

	return (
		<>
			{listData ? (
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
							uri: 'http://cos.haxibiao.com/storage/image/1575186475WmfxdUOXpJAHxqkk.png',
						}}
					/>

					<Row
						style={{
							flex: 1,
							width: '100%',
							justifyContent: 'center',
							alignItems: 'center',
							paddingHorizontal: 25,
						}}>
						<View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
							<Text
								style={{
									fontSize: 40,
									marginBottom: 10,
									textAlign: 'center',
									justifyContent: 'center',
									alignContent: 'center',
									fontWeight: 'bold',
								}}>
								{value + '%'}
							</Text>
							<WaterCup value={value} />
							{!countDown.isEnd && (
								<Text
									style={{
										fontSize: 20,
										marginTop: 10,
										textAlign: 'center',
										justifyContent: 'center',
										alignContent: 'center',
										fontWeight: 'bold',
									}}>
									{`补卡需要等待 ${countDown.minutes}:${countDown.seconds}`}
								</Text>
							)}
						</View>

						<View style={{ flex: 0.2, paddingTop: 100 }}>
							<FlatList
								data={listData}
								keyExtractor={(item, index) => item.id.toString() || index.toString()}
								renderItem={({ item, index }) => (
									<DrinkButton waterData={item} update={refetch} disabled={!countDown.isEnd} />
								)}
							/>
						</View>
					</Row>
				</PageContainer>
			) : (
				<SpinnerLoading />
			)}
		</>
	);
};

const styles = StyleSheet.create({
	button: {
		marginVertical: 5,
		paddingVertical: 5,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		textAlign: 'center',
		fontSize: 20,
		fontWeight: 'bold',
	},
	buttonTextSub: {
		fontSize: 12,
		color: '#FFF',
		paddingTop: 2,
	},
});
