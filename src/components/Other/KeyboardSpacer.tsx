/*
 * @flow
 * created by wyk made in 2019-03-18 22:28:33
 */

import React, { Component } from 'react';
import { StyleSheet, Platform, View, Keyboard, LayoutAnimation, StatusBar, Dimensions } from 'react-native';
import { appStore } from '~store';
import DeviceInfo from 'react-native-device-info';

type Props = {
	topInsets?: number;
};

class KeyboardSpacer extends Component<Props> {
	static defaultProps = {
		topInsets: 0,
	};

	constructor(props: Props) {
		super(props);
		this.showListener = null;
		this.hideListener = null;
		this.state = {
			keyboardHeight: 0,
		};
	}

	componentDidMount() {
		if (!this.showListener) {
			const name = Device.IOS ? 'keyboardWillShow' : 'keyboardDidShow';
			this.showListener = Keyboard.addListener(name, (e) => this.onKeyboardShow(e));
		}
		if (!this.hideListener) {
			const name = Device.IOS ? 'keyboardWillHide' : 'keyboardDidHide';
			this.hideListener = Keyboard.addListener(name, () => this.onKeyboardHide());
		}
	}

	componentWillUnmount() {
		if (this.showListener) {
			this.showListener.remove();
			this.showListener = null;
		}
		if (this.hideListener) {
			this.hideListener.remove();
			this.hideListener = null;
		}
	}

	componentWillUpdate(props, state) {
		if (state.keyboardHeight !== this.state.keyboardHeight) {
			LayoutAnimation.configureNext({
				duration: 500,
				create: {
					duration: 300,
					type: LayoutAnimation.Types.easeInEaseOut,
					property: LayoutAnimation.Properties.opacity,
				},
				update: {
					type: LayoutAnimation.Types.spring,
					springDamping: 200,
				},
			});
		}
	}

	onKeyboardShow(e) {
		let FixTopInsets = 0;
		if (['Redmi', 'Xiaomi', 'HUAWEI'].includes(DeviceInfo.getBrand())) {
			FixTopInsets = appStore.viewportHeight - Dimensions.get('window').height || 0;
		}
		if (
			DeviceInfo.getBrand() === 'meizu' &&
			DeviceInfo.getSystemVersion() >= 8 &&
			Math.floor(Dimensions.get('window').height) === Math.floor(Dimensions.get('screen').height)
		) {
			FixTopInsets = -16;
		}
		if (!e || !e.endCoordinates || !e.endCoordinates.height) return;
		let height = e.endCoordinates.height + (this.props.topInsets || 0);
		height += FixTopInsets;
		this.setState({ keyboardHeight: height });
	}

	onKeyboardHide() {
		this.setState({ keyboardHeight: 0 });
	}

	render() {
		return <View style={[styles.keyboardSpace, { height: this.state.keyboardHeight }]} />;
	}
}

const styles = StyleSheet.create({
	keyboardSpace: {
		backgroundColor: 'rgba(0, 0, 0, 0)',
		bottom: 0,
		left: 0,
		right: 0,
	},
});

export default KeyboardSpacer;

// console.log(
//     DeviceInfo.getBrand(),
//     Dimensions.get('window').height,
//     Dimensions.get('screen').height,
//     StatusBar.currentHeight,
// );

// xm
// 737.4545454545455 784.7272727272727 32.3636360168457
// Layout 737.4545288085938
// Keyboard 277.81817626953125
// 隐藏刘海+虚拟按键

// 737.8181818181819 817.4545454545455 32.3636360168457
// Layout 770.1818237304688 33
// Keyboard 245.4545440673828  -32
// 打开刘海+虚拟按键

// 737.8181818181819 817.4545454545455 32.3636360168457
// Layout 817.4545288085938 47
// Keyboard 220 -25

// Dimensions.get('screen').height*2-Dimensions.get('window').height-StatusBar.currentHeight-appStore.viewportHeight

// mz
// 744 744 30
// onLayout 744
// onKeyboardShow 291

// 696 744 30
// onLayout 696
// onKeyboardShow 275
