import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { SafeText } from '~components';
import { observer, appStore } from '~store';
import { ad } from 'react-native-ad';
import { useNavigation } from '~router';
import Player from './Player';
import SideBar from './SideBar';
import VideoStore from '../VideoStore';
import AdRewardProgress from './AdRewardProgress';
import LinearGradient from 'react-native-linear-gradient';

import { GQL } from '~apollo';

export default observer((props: any) => {
	const { media, index } = props;
	const navigation = useNavigation();
	const [adShow, setAdShow] = useState(true);

	AdRewardProgress(media.isAdPosition && index === VideoStore.viewableItemIndex);

	const renderCategories = useMemo(() => {
		if (Array.isArray(media.categories) && media.categories.length > 0) {
			return media.categories.map((category: any) => (
				<Text
					key={category.id}
					style={styles.categoryName}
					onPress={() => navigation.navigate('Category', { category })}>
					{`#${category.name} `}
				</Text>
			));
		} else {
			return null;
		}
	}, []);

	if (media.isAdPosition && adShow && appStore.enableAd) {
		if (index !== VideoStore.viewableItemIndex) {
			return (
				<View style={{ height: appStore.viewportHeight }}>
					{media.cover && (
						<View style={styles.cover}>
							<Image
								style={styles.curtain}
								source={{ uri: media.cover }}
								resizeMode="cover"
								blurRadius={4}
							/>
							<View style={styles.mask} />
						</View>
					)}
				</View>
			);
		}
		return (
			<View style={{ height: appStore.viewportHeight }}>
				<ad.DrawFeedAd
					onError={(error: any) => {
						// 广告 error 有几率导致闪退点
						setAdShow(false);
					}}
					onAdClick={() => {
						const drawFeedAdId = media.id.toString();

						if (VideoStore.getReward.indexOf(drawFeedAdId) === -1) {
							VideoStore.addGetRewardId(drawFeedAdId);
							appStore.client
								.mutate({
									mutation: GQL.clickVideoAD,
								})
								.then((data: any) => {
									const { amount, message } = Helper.syncGetter('data.clickAD', data);
									Toast.show({
										content: message || `+${amount || 0} 用户行为${Config.limitAlias}`,
										duration: 1500,
									});
								});
						}
					}}
				/>
				{VideoStore.getReward.length < 1 && (
					<View
						style={{
							bottom: Theme.HOME_INDICATOR_HEIGHT + PxDp(75),
							position: 'absolute',
							right: PxDp(Theme.itemSpace),
							flexDirection: 'row',
							alignItems: 'center',
						}}>
						<Image
							source={require('~assets/images/click_tips.png')}
							style={{ width: (20 * 208) / 118, height: 20 }}
						/>
						<Text
							style={{
								color: '#C0CBD4',
								fontSize: PxDp(12),
								marginHorizontal: PxDp(10),
							}}>
							戳一戳
						</Text>
					</View>
				)}
			</View>
		);
	}

	return (
		<View style={{ height: appStore.viewportHeight }}>
			{media.cover && (
				<View style={styles.cover}>
					<Image style={styles.curtain} source={{ uri: media.cover }} resizeMode="cover" blurRadius={4} />
					<View style={styles.mask} />
				</View>
			)}
			<Player media={media} index={index} />
			<LinearGradient
				style={styles.shadowContainer}
				pointerEvents={'none'}
				start={{ x: 0, y: 1 }}
				end={{ x: 0, y: 0 }}
				colors={['rgba(000,000,000,0.5)', 'rgba(000,000,000,0.2)', 'rgba(000,000,000,0.0)']}
			/>
			<View style={styles.videoContent}>
				<View>
					<Text style={styles.name}>@{Helper.syncGetter('user.name', media)}</Text>
				</View>
				<View>
					<Text style={styles.body} numberOfLines={3}>
						{renderCategories}
						{media.body}
					</Text>
				</View>
			</View>
			<View style={styles.videoSideBar}>
				<SideBar media={media} />
			</View>
		</View>
	);
});

const styles = StyleSheet.create({
	body: { color: 'rgba(255,255,255,0.9)', fontSize: Font(15), paddingTop: PxDp(10) },
	cover: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	curtain: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: undefined,
		height: undefined,
	},
	categoryName: {
		fontWeight: 'bold',
	},
	mask: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.1)',
	},
	name: { color: 'rgba(255,255,255,0.9)', fontSize: Font(16), fontWeight: 'bold' },
	videoContent: {
		position: 'absolute',
		bottom: PxDp(Theme.BOTTOM_HEIGHT + 20),
		left: PxDp(Theme.itemSpace),
		right: PxDp(90),
	},
	videoSideBar: {
		position: 'absolute',
		bottom: PxDp(Theme.BOTTOM_HEIGHT + 20),
		right: PxDp(Theme.itemSpace),
	},
	shadowContainer: {
		position: 'absolute',
		top: Device.HEIGHT / 2,
		bottom: 0,
		padding: PxDp(4),
		width: '100%',
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
	},
});
