import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { PageContainer, HxfButton, PopOverlay } from '~components';
import { GQL, useApolloClient } from '~apollo';
import { useNavigation } from '~router';
import { userStore } from '~store';

export default function ModifyPassword() {
	const client = useApolloClient();
	const [password, onPasswordChange] = useState('');
	const [againPassword, onAgainPasswordChange] = useState('');
	const [submitting, onSubmitting] = useState(false);
	const navigation = useNavigation();

	const me = { ...userStore.me };
	let { id } = me;
	return (
		<PageContainer white title="修改密码" submitting={submitting}>
			<View style={{ marginVertical: PxDp(35), paddingHorizontal: PxDp(25) }}>
				<Text style={{ fontSize: Font(20), fontWeight: '600' }}>提交新密码</Text>
			</View>

			<View style={styles.inputWrap}>
				<TextInput
					placeholder="请输入新密码,不少于6位"
					style={{ height: PxDp(48) }}
					onChangeText={(text) => onPasswordChange(text)}
					value={password}
					secureTextEntry={true}
					maxLength={16}
				/>
			</View>
			<View style={styles.inputWrap}>
				<TextInput
					placeholder="请再次输入新密码,不少于6位"
					style={{ height: PxDp(48) }}
					onChangeText={(text) => {
						onAgainPasswordChange(text);
					}}
					value={againPassword}
					secureTextEntry={true}
					maxLength={16}
				/>
			</View>

			<HxfButton
				title="完成"
				onPress={() => {
					if (password.indexOf(' ') >= 0) {
						Toast.show({ content: '请勿输入空格' });
					} else if (password == '') {
						Toast.show({ content: '您还没有输入密码' });
					} else {
						if (password != againPassword) {
							Toast.show({ content: '两次密码输入的不一致，请重新输入' });
						} else {
							onSubmitting(true);

							// TODO: 调用更新数据接口
							client
								.mutate({
									mutation: GQL.updateUserIntroduction,
									variables: { id: id, input: { password: password } },
								})
								.then((result) => {
									console.log('更新用户数据后返回的用户信息: ', result);
									Toast.show({ content: '修改成功' });
									navigation.goBack();
								})
								.catch((error) => {
									console.log('更新用户数据接口错误  error : ', error);
									PopOverlay({
										content: '网络错误，绑定失败，请稍后重试',
										onConfirm: async () => {},
									});
								});
						}
					}
				}}
				style={styles.button}
			/>
		</PageContainer>
	);
}

const styles = StyleSheet.create({
	button: {
		height: PxDp(38),
		borderRadius: PxDp(5),
		marginHorizontal: PxDp(25),
		marginTop: PxDp(35),
		paddingVertical: 0,
		backgroundColor: Theme.primaryColor,
	},
	container: {
		backgroundColor: Theme.white || '#FFF',
		flex: 1,
	},
	inputWrap: {
		borderBottomWidth: PxDp(0.5),
		borderBottomColor: Theme.borderColor,
		marginHorizontal: PxDp(25),
		paddingHorizontal: 0,
	},
});
