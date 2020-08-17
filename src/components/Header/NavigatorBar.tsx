/*
 * @flow
 * created by wyk made in 2018-12-06 10:00:20
 */

import React, { Component } from 'react';
import { StyleSheet, Platform, StatusBar, View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '~/router';
import Iconfont from '../Iconfont';

export default (props: any) => {
    let navigation = useNavigation();
    const defaultProps = {
        isTopNavigator: false,
        hidden: false,
        animated: true,
        statusBarStyle: 'dark-content',
        statusBarColor: 'rgba(0,0,0,0)',
    };

    let screenWidth = Dimensions.get('window').width;
    //state
    let barOpacity = new Animated.Value(props.hidden ? 0 : 1);

    const backButtonPress = () => {
        if (props.backButtonPress) {
            props.backButtonPress();
        } else {
            navigation.goBack();
        }
    };

    const buildProps = () => {
        let { isTopNavigator, navBarStyle, title, titleStyle, titleViewStyle, sideViewStyle, ...others } = props;

        // build style
        navBarStyle = {
            backgroundColor: Theme.navBarBackground,
            position: 'absolute',
            left: 0,
            right: 0,
            height: pixel(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight),
            paddingTop: pixel(Theme.statusBarHeight),
            paddingLeft: pixel(Theme.itemSpace),
            paddingRight: pixel(Theme.itemSpace),
            borderBottomWidth: Theme.minimumPixel,
            borderBottomColor: Theme.navBarSeparatorColor,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...navBarStyle,
        };

        // build titleViewStyle
        titleViewStyle = {
            position: 'absolute',
            top: pixel(Theme.statusBarHeight),
            left: pixel(Theme.itemSpace),
            right: pixel(Theme.itemSpace),
            bottom: 0,
            opacity: barOpacity,
            flexDirection: 'row',
            alignItems: 'center',
            ...titleViewStyle,
        };

        // build leftView and rightView style
        sideViewStyle = {
            opacity: barOpacity,
            alignSelf: 'stretch',
            justifyContent: 'center',
            ...sideViewStyle,
        };

        if (isTopNavigator) {
            titleStyle = {
                fontWeight: 'bold',
                textAlign: 'left',
                ...titleStyle,
            };
        }

        // convert string title to NavigatorBar.Title
        if (typeof title === 'string') {
            title = (
                <Text style={[styles.titleText, titleStyle]} numberOfLines={1}>
                    {title}
                </Text>
            );
        }

        return {
            isTopNavigator,
            navBarStyle,
            title,
            titleViewStyle,
            sideViewStyle,
            ...others,
        };
    };

    const renderLeftView = () => {
        const { isTopNavigator, leftView, backButtonColor } = props;
        let left;
        if (isTopNavigator || leftView) {
            left = leftView;
        } else {
            left = (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={backButtonPress}
                    style={{
                        flex: 1,
                        width: Theme.navBarContentHeight,
                        justifyContent: 'center',
                    }}>
                    <Iconfont name="zuojiantou" color={'#333'} size={pixel(22)} />
                </TouchableOpacity>
            );
        }
        return left;
    };

    const onLayout = (e: any) => {
        // if (e.nativeEvent.layout.height != barHeight) {
        //     barHeight = e.nativeEvent.layout.height;
        // }
        // const { width } = Dimensions.get('window');
        // if (width != screenWidth) {
        //     screenWidth = width;
        //     forceUpdate();
        // }
        props.onLayout && props.onLayout(e);
    };

    const {
        navBarStyle,
        animated,
        statusBarStyle,
        statusBarColor,
        statusBarHidden,
        title,
        titleViewStyle,
        sideViewStyle,
        rightView,
        showShadow,
        ...others
    } = buildProps();
    return (
        <Animated.View
            style={[navBarStyle, showShadow && styles.shadow]}
            {...others}
            onLayout={(e) => onLayout(e)}
            elevation={showShadow ? 10 : 0}>
            <StatusBar
                translucent={true}
                backgroundColor={statusBarColor}
                barStyle={statusBarStyle}
                animated={animated}
                hidden={statusBarHidden}
            />
            <Animated.View style={titleViewStyle}>{title}</Animated.View>
            <Animated.View style={sideViewStyle}>{renderLeftView()}</Animated.View>
            <Animated.View style={sideViewStyle}>{rightView}</Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#b4b4b4',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 1,
    },
    titleText: {
        color: '#666',
        flex: 1,
        fontSize: pixel(19),
        textAlign: 'center',
    },
});
