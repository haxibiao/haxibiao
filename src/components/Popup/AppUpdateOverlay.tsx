'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	NativeModules,
	Dimensions,
	PermissionsAndroid,
	Platform,
} from 'react-native';

import Iconfont from '../Iconfont';
import { Overlay } from 'teaset';
import DownLoadApk from '~screens/wallet/components/DownLoadApk';
import { appStore } from '~store';

const { height, width } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;

let OverlayKey: any = null;

interface Props {
	versionData: object;
	onlineVersion: string;
}

export const show = (props: Props) => {
	const { versionData, onlineVersion } = props;
	const overlayView = (
		<Overlay.View animated>
			<View style={styles.container}>
				<View style={styles.content}>
					{!versionData.is_force && (
						<TouchableOpacity
							style={styles.operation}
							onPress={() => {
								hide();
								appStore.updateViewedVesion(onlineVersion);
							}}>
							<Iconfont name={'close'} color={Theme.grey} size={20} />
						</TouchableOpacity>
					)}
					<View style={[styles.header, { paddingTop: versionData.is_force ? PxDp(25) : PxDp(15) }]}>
						<Text style={styles.modalRemindContent}>检测到新版本</Text>
					</View>
					<View style={styles.center}>
						<Text style={styles.centerTitle}>建议在WLAN环境下进行升级</Text>
						<Text style={styles.centerTitle}>版本：{versionData.version}</Text>
						<Text style={styles.centerTitle}>大小：{versionData.size}</Text>
						<Text style={styles.centerTitle}>更新说明：</Text>
						<Text style={styles.centerInfo}>{versionData.description}</Text>
					</View>
					<View style={{ alignItems: 'center', paddingVertical: PxDp(15) }}>
						<DownLoadApk packageName={'appUpdate'} url={versionData.apk} />
					</View>
				</View>
			</View>
		</Overlay.View>
	);
	OverlayKey = Overlay.show(overlayView);
};
const hide = () => {
	Overlay.hide(OverlayKey);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		backgroundColor: 'rgba(255,255,255,0)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		width: SCREEN_WIDTH - PxDp(60),
		borderRadius: PxDp(15),
		backgroundColor: 'white',
		padding: 0,
	},
	header: {
		justifyContent: 'center',
	},
	headerText: {
		color: Theme.grey,
		fontSize: PxDp(13),
		textAlign: 'center',
		paddingTop: PxDp(3),
	},
	center: {
		paddingTop: PxDp(15),
		paddingBottom: PxDp(20),
		paddingHorizontal: PxDp(20),
	},
	centerTitle: {
		fontSize: PxDp(14),
		color: Theme.primaryFont,
		paddingTop: PxDp(10),
		lineHeight: PxDp(22),
	},
	centerInfo: {
		fontSize: PxDp(14),
		color: Theme.primaryFont,
		lineHeight: PxDp(22),
	},
	modalRemindContent: {
		fontSize: PxDp(18),
		color: Theme.black,
		paddingHorizontal: PxDp(15),
		textAlign: 'center',
		lineHeight: PxDp(20),
		fontWeight: '500',
	},
	modalFooter: {
		borderTopColor: Theme.tintGray,
		flexDirection: 'row',
	},
	operation: {
		paddingTop: PxDp(10),
		paddingHorizontal: PxDp(15),
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	operationText: {
		fontSize: PxDp(15),
		fontWeight: '400',
		color: Theme.grey,
	},
});

export default { show, hide };
