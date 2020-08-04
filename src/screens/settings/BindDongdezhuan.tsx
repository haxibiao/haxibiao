import React, { Component, useState } from 'react';
import { StyleSheet, Text, ScrollView, View, TextInput, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, HxfButton, HxfTextInput } from '~components';
import { userStore } from '~store';
import { GQL, useQuery, useMutation } from '~apollo';
import { useNavigation } from '~router';
import { downloadApk } from '~utils';

export default function BindDongdezhuan() {
	const navigation = useNavigation();
	const [account, onChangeNumber] = useState('');
	const [password, onPasswordChange] = useState('');
	const me = userStore.me;

	const [bindDongdezhuan] = useMutation(GQL.bindDongdezhuan, {
		variables: { account, password },
		refetchQueries: () => [
			{
				query: GQL.userProfileQuery,
				variables: { id: me.id },
			},
		],
		onError: (error) => {
			console.log('error :', error);
			Toast.show({
				content: error.message.replace('GraphQL error: ', '') || '手机号绑定失败',
			});
		},
		onCompleted: (mutationResult) => {
			console.log('mutationResult :', mutationResult);
			Toast.show({
				content: '懂得赚绑定成功',
			});
			navigation.goBack();
		},
	});

	return (
		<PageContainer title="绑定懂得赚" white>
			<View style={styles.container}>
				<View style={styles.itemWrapper}>
					<Text style={styles.title}>输入懂得赚账号与密码</Text>
				</View>
				<View style={styles.inputWrapper}>
					<HxfTextInput
						style={styles.inputStyle}
						placeholderTextColor={Theme.slateGray1}
						onChangeText={onChangeNumber}
						maxLength={11}
						placeholder="请输入手机号"
						keyboardType="numeric"
					/>
				</View>
				<View style={styles.inputWrapper}>
					<HxfTextInput
						style={styles.inputStyle}
						placeholderTextColor={Theme.slateGray1}
						onChangeText={onPasswordChange}
						maxLength={16}
						placeholder="请设置密码"
						secureTextEntry={true}
					/>
				</View>
				<View style={styles.btnWrap}>
					<HxfButton
						title={'提交'}
						gradient={true}
						style={{ height: PxDp(40) }}
						disabled={!(password && account)}
						onPress={bindDongdezhuan}
					/>
				</View>
				<TouchFeedback
					onPress={() => downloadApk()}
					style={{
						alignItems: 'flex-end',
						marginTop: PxDp(10),
						marginHorizontal: PxDp(Theme.itemSpace * 2),
					}}>
					<Text style={{ color: Theme.link, fontSize: PxDp(13), textDecorationLine: 'underline' }}>
						下载懂得赚
					</Text>
				</TouchFeedback>
			</View>
		</PageContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		backgroundColor: '#fff',
	},
	itemWrapper: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		alignSelf: 'flex-start',
		height: 43,
		marginTop: 50,
		marginStart: 26,
		marginBottom: 46,
	},
	inputStyle: {
		fontSize: PxDp(16),
		height: PxDp(40),
		borderBottomWidth: Theme.minimumPixel,
		borderBottomColor: Theme.borderColor,
	},
	card: {
		width: '100%',
		backgroundColor: '#fff',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	title: {
		color: Theme.defaultTextColor,
		fontSize: 26,
		fontWeight: '400',
	},
	inputWrapper: {
		marginHorizontal: PxDp(Theme.itemSpace * 2),
		marginBottom: PxDp(Theme.itemSpace),
	},
	btnWrap: {
		marginTop: PxDp(Theme.itemSpace),
		marginHorizontal: PxDp(Theme.itemSpace * 2),
	},
});
