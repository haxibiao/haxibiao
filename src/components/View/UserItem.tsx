/*
 * @flow
 * created by wyk made in 2019-01-09 10:11:47
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { withNavigation, StackActions } from 'react-navigation';

import Iconfont from '../Iconfont';
import Row from '../Basic/Row';
import Avatar from '../Basic/Avatar';
import SafeText from '../Basic/SafeText';
import FollowButton from './FollowButton';

type User = {
	id: number;
	avatar: any;
	name: string;
	followed_status: number;
	introduction?: string;
};

class UserItem extends Component {
	render() {
		const { user, style, navigation } = this.props;
		const { id = 1, avatar, name, followed_status, introduction } = user;
		const pushAction = StackActions.push({
			routeName: 'User',
			params: {
				user,
			},
		});
		return (
			<TouchableOpacity style={[styles.item, style]} onPress={() => navigation.dispatch(pushAction)}>
				<Avatar source={avatar} size={PxDp(50)} />
				<View style={styles.right}>
					<View style={styles.info}>
						<SafeText style={styles.nameText}>{name}</SafeText>
						{!!introduction && (
							<View style={{ flex: 1 }}>
								<SafeText style={styles.introduction} numberOfLines={1}>
									{introduction}
								</SafeText>
							</View>
						)}
					</View>
					<FollowButton
						id={id}
						followedStatus={followed_status}
						style={{
							width: PxDp(70),
							height: PxDp(30),
							borderRadius: PxDp(15),
						}}
					/>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	info: {
		flex: 1,
		marginRight: PxDp(Theme.itemSpace),
	},
	introduction: {
		marginTop: PxDp(8),
		fontSize: PxDp(12),
		color: '#696482',
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: PxDp(Theme.itemSpace),
	},
	labelText: { fontSize: PxDp(12), color: '#fff', marginLeft: PxDp(2), lineHeight: PxDp(14) },
	nameText: {
		fontSize: PxDp(16),
		color: Theme.defaultTextColor,
		marginRight: PxDp(2),
	},
	right: {
		flex: 1,
		paddingHorizontal: PxDp(Theme.itemSpace),
		paddingVertical: PxDp(20),
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: PxDp(1),
		borderBottomColor: Theme.borderColor,
	},
});

export default withNavigation(UserItem);
