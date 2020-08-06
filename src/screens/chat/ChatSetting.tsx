import React, { Component, useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeText, Row, Badge, Avatar, PageContainer, TouchFeedback, Iconfont, HxfRadio } from '~components';
import { middlewareNavigate } from '~router';

const ChatSetting = (props) => {
	const { navigation } = props;
	const user = props.route.params?.user ?? {};
	const [contentType, setContentType] = useState(false);

	const changeContentType = useCallback(() => {
		setContentType(!contentType);
	}, []);

	console.log('user', user);
	return (
		<PageContainer title={'聊天信息'}>
			<TouchFeedback style={styles.itemStyle} onPress={() => navigation.navigate('User', { user })}>
				<Row>
					<Avatar source={user.avatar} size={PxDp(50)} />
					<View style={{ marginLeft: PxDp(10) }}>
						<Text style={{ fontSize: Font(15), color: Theme.navBarTitleColor || '#666' }}>{user.name}</Text>
						<Text style={{ fontSize: Font(13), color: Theme.secondaryTextColor }}>
							{user.introduction || '本宝宝暂时还没想到个性签名~'}
						</Text>
					</View>
				</Row>
				<Iconfont name="right" color={Theme.navBarMenuColor} size={PxDp(18)} />
			</TouchFeedback>
			<TouchFeedback style={styles.itemStyle}>
				<Text style={{ fontSize: Font(15), color: Theme.navBarTitleColor || '#666' }}>屏蔽消息</Text>
				<HxfRadio onChange={changeContentType} mode="switch" />
			</TouchFeedback>
			<TouchFeedback
				style={styles.itemStyle}
				onPress={() =>
					Toast.show({
						content: '举报成功',
					})
				}>
				<Text style={{ fontSize: Font(15), color: Theme.navBarTitleColor || '#666' }}>举报</Text>
				<Iconfont name="right" color={Theme.navBarMenuColor} size={PxDp(18)} />
			</TouchFeedback>
		</PageContainer>
	);
};

const styles = StyleSheet.create({
	itemStyle: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: PxDp(15),
		paddingVertical: PxDp(15),
		borderBottomColor: Theme.navBarSeparatorColor,
		borderBottomWidth: PxDp(0.5),
	},
	radioText: {
		fontSize: Font(15),
		color: Theme.watermelon,
	},
});

export default ChatSetting;
