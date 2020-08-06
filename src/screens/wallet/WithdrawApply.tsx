import React from 'react';
import { StyleSheet, View, Image, Text, Dimensions, Button, TouchableOpacity } from 'react-native';
import { PageContainer, HxfButton } from '~components';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function WithdrawApply(props) {
	const created_at = props.route.params?.created_at ?? {}; // 提现记录创建时间
	const amount = props.route.params?.amount ?? {}; // 单次提现额度
	return (
		<PageContainer title="提现申请">
			<View style={styles.container}>
				<Image source={require('~assets/images/money.png')} style={styles.image} resizeMode="contain" />
				<View style={styles.content}>
					<Text style={styles.header}>提现申请已提交</Text>
					<View style={styles.center}>
						<Text style={styles.money}>{amount}</Text>
						<Text style={{ fontSize: Font(10), color: Theme.secondaryColor, paddingTop: PxDp(32) }}>
							{' '}
							元
						</Text>
					</View>
					<View
						style={{
							width: SCREEN_WIDTH,
							height: 60,
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<Text style={styles.text}>预计3~5个工作日内到账</Text>
					</View>
					<HxfButton
						title="知道了"
						gradient={true}
						style={styles.button}
						onPress={() => props.navigation.goBack()}
					/>
				</View>
			</View>
		</PageContainer>
	);
}

const styles = StyleSheet.create({
	button: {
		marginTop: PxDp(20),
		alignItems: 'center',
		borderRadius: PxDp(22),
		height: PxDp(44),
		justifyContent: 'center',
		width: PxDp(220),
	},
	center: {
		flexDirection: 'row',
		marginTop: PxDp(20),
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: 'rgba(255,255,255,1)',
	},
	content: {
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		paddingHorizontal: 23,
	},
	header: {
		color: Theme.defaultTextColor,
		fontSize: Font(22),
	},
	image: {
		height: SCREEN_WIDTH * 0.5,
		marginTop: 40,
		width: SCREEN_WIDTH * 0.35,
	},
	money: {
		color: Theme.secondaryColor,
		fontSize: Font(43),
	},
	text: {
		color: '#363636',
		fontSize: Font(13),
	},
});
