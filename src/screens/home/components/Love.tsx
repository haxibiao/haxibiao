import React, { useRef, useEffect } from 'react';
import { StyleSheet, Animated } from 'react-native';

const Love = () => {
	const animation = useRef(new Animated.Value(0));

	useEffect(() => {
		Animated.stagger(400, [
			Animated.spring(animation.current, {
				toValue: 1,
				duration: 400,
			}),
			Animated.timing(animation.current, {
				toValue: 2,
				duration: 800,
			}),
		]).start();
	}, []);

	const scale = animation.current.interpolate({
		inputRange: [0, 1, 2],
		outputRange: [0, 1, 1.5],
	});

	const opacity = animation.current.interpolate({
		inputRange: [0, 1, 2],
		outputRange: [0, 1, 0],
	});

	const translateY = animation.current.interpolate({
		inputRange: [0, 1, 2],
		outputRange: [0, 0, -PxDp(120)],
	});

	return (
		<Animated.Image
			style={[styles.love, { opacity, transform: [{ scale }, { translateY }] }]}
			source={require('~assets/images/ic_liked.png')}
		/>
	);
};

const styles = StyleSheet.create({
	love: {
		position: 'absolute',
		top: 200,
		left: 200,
		right: 0,
		bottom: 0,
		height: PxDp(120),
		width: PxDp(120),
	},
});

export default Love;
