import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Image, Text, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Avatar, GridImage, Iconfont, Row, PlaceholderImage, SafeText } from '~components';
import StoreContext, { observer, useObservable } from '~store';
import { StackActions } from '@react-navigation/native';

export interface Props {
	feedback: any;
	navigation: any;
}

const COVER_WIDTH = Device.WIDTH - PxDp(Theme.itemSpace) * 2;

const FeedbackItem: React.FC<Props> = observer((props: Props) => {
	const { feedback, navigation } = props;
	const { user, content, status_msg, images, created_at, hot, count_comment } = feedback;
	const renderCover = useMemo(() => {
		if (Array.isArray(images) && images.length > 0) {
			return (
				<View style={styles.contentBottom}>
					<GridImage images={images} />
				</View>
			);
		}
	}, []);

	const pushAction = useMemo(() => {
		return StackActions.push({
			routeName: 'FeedbackDetail',
			params: {
				feedback,
			},
		});
	}, [feedback]);

	return (
		<TouchableWithoutFeedback onPress={() => (navigation ? navigation.dispatch(pushAction) : null)}>
			<View style={styles.feedbackContainer}>
				<View style={styles.headerWrapper}>
					<View style={styles.userInfo}>
						<Avatar source={user.avatar} size={PxDp(38)} />
						<SafeText style={styles.nameText}>{user.name}</SafeText>
					</View>
				</View>
				<View style={styles.contentTop}>
					<Text style={styles.bodyText}>{content}</Text>
				</View>
				{renderCover}
				<View style={styles.bottomPartWrapper}>
					<Row style={styles.metaList}>
						<Text style={styles.timeAgoText} numberOfLines={1}>
							{created_at}
						</Text>
						<Row>
							<Iconfont name="remen1" size={PxDp(14)} color={Theme.slateGray1} />
							<Text style={[styles.metaText, { marginRight: PxDp(10) }]} numberOfLines={1}>
								{hot}
							</Text>
							<Iconfont name="liuyanfill" size={PxDp(14)} color={Theme.slateGray1} />
							<Text style={styles.metaText} numberOfLines={1}>
								{count_comment || 0}
							</Text>
						</Row>
					</Row>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
});

export default FeedbackItem;

const styles = StyleSheet.create({
	bodyText: { color: Theme.defaultTextColor, fontSize: PxDp(16), letterSpacing: 0.8 },
	bottomPartWrapper: {
		marginTop: PxDp(10),
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	contentBottom: {
		marginTop: PxDp(12),
	},
	contentTop: {
		marginTop: PxDp(12),
	},
	feedbackContainer: {
		paddingHorizontal: PxDp(Theme.itemSpace),
		marginVertical: PxDp(Theme.itemSpace),
	},
	headerWrapper: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
	},
	info: {
		justifyContent: 'space-between',
		marginLeft: PxDp(Theme.itemSpace),
	},
	landscape: {
		width: COVER_WIDTH,
		height: (COVER_WIDTH * 9) / 16,
		borderRadius: PxDp(6),
	},
	metaList: {
		flex: 1,
		justifyContent: 'space-between',
	},
	metaText: {
		marginLeft: PxDp(5),
		fontSize: PxDp(11),
		color: Theme.slateGray2,
	},
	nameText: { fontSize: PxDp(14), color: Theme.defaultTextColor, marginLeft: PxDp(5) },
	portrait: {
		width: COVER_WIDTH * 0.5,
		height: COVER_WIDTH * 0.8,
		borderRadius: PxDp(6),
	},
	rewardText: {
		marginLeft: PxDp(5),
		fontSize: PxDp(11),
		color: Theme.watermelon,
	},
	statusLabel: {
		flexDirection: 'row',
		alignItems: 'center',
		height: PxDp(24),
		borderRadius: PxDp(12),
		paddingHorizontal: PxDp(9),
		backgroundColor: Theme.groundColour,
	},
	statusText: {
		fontSize: PxDp(11),
		color: Theme.subTextColor,
	},
	timeAgoText: { fontSize: PxDp(12), color: Theme.slateGray1, fontWeight: '300' },
	userInfo: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: PxDp(Theme.itemSpace),
	},
});
