/*
 * @flow
 * created by wyk made in 2018-12-06 10:00:20
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Platform,
    StatusBar,
    View,
    Text,
    TouchableOpacity,
    Animated,
    ViewPropTypes,
    Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { Iconfont } from '@src/components';

class NavigatorBar extends Component {
    static propTypes = {
        ...ViewPropTypes,
        showShadow: PropTypes.bool,
        isTopNavigator: PropTypes.bool, // whether the page is initialized
        navBarStyle: PropTypes.object, // wrap style
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        titleStyle: PropTypes.object,
        titleViewStyle: PropTypes.object,
        backButtonPress: PropTypes.func,
        backButtonColor: PropTypes.string,
        leftView: PropTypes.element,
        rightView: PropTypes.element,
        sideViewStyle: PropTypes.object,
        hidden: PropTypes.bool, // bar hidden
        animated: PropTypes.bool, // hide or show bar with animation
        statusBarStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
        statusBarColor: PropTypes.string,
        statusBarHidden: PropTypes.bool, // status bar hidden
    };

    static defaultProps = {
        ...View.defaultProps,
        isTopNavigator: false,
        hidden: false,
        animated: true,
        statusBarStyle: 'dark-content',
        statusBarColor: 'rgba(0,0,0,0)',
    };

    constructor(props) {
        super(props);
        this.screenWidth = Dimensions.get('window').width;
        this.state = {
            barOpacity: new Animated.Value(props.hidden ? 0 : 1),
        };
    }

    backButtonPress = () => {
        const { backButtonPress, navigation } = this.props;
        if (backButtonPress) {
            backButtonPress();
        } else {
            navigation.goBack();
        }
    };

    buildProps() {
        let { isTopNavigator, navBarStyle, title, titleStyle, titleViewStyle, sideViewStyle, ...others } = this.props;

        // build style
        navBarStyle = {
            backgroundColor: Theme.navBarBackground,
            position: 'absolute',
            left: 0,
            right: 0,
            height: PxDp(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight),
            paddingTop: PxDp(Theme.statusBarHeight),
            paddingLeft: PxDp(Theme.itemSpace),
            paddingRight: PxDp(Theme.itemSpace),
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
            top: PxDp(Theme.statusBarHeight),
            left: PxDp(Theme.itemSpace),
            right: PxDp(Theme.itemSpace),
            bottom: 0,
            opacity: this.state.barOpacity,
            flexDirection: 'row',
            alignItems: 'center',
            ...titleViewStyle,
        };

        // build leftView and rightView style
        sideViewStyle = {
            opacity: this.state.barOpacity,
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
    }

    renderLeftView = () => {
        const { isTopNavigator, leftView, backButtonColor } = this.props;
        let left;
        if (isTopNavigator || leftView) {
            left = leftView;
        } else {
            left = (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={this.backButtonPress}
                    style={{
                        flex: 1,
                        width: Theme.navBarContentHeight,
                        justifyContent: 'center',
                    }}>
                    <Iconfont name="left" color={backButtonColor || Theme.navBarMenuColor} size={PxDp(22)} />
                </TouchableOpacity>
            );
        }
        return left;
    };

    onLayout(e) {
        if (e.nativeEvent.layout.height != this.barHeight) {
            this.barHeight = e.nativeEvent.layout.height;
        }
        const { width } = Dimensions.get('window');
        if (width != this.screenWidth) {
            this.screenWidth = width;
            this.forceUpdate();
        }
        this.props.onLayout && this.props.onLayout(e);
    }

    render() {
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
        } = this.buildProps();
        return (
            <Animated.View
                style={[navBarStyle, showShadow && styles.shadow]}
                {...others}
                onLayout={e => this.onLayout(e)}
                elevation={showShadow ? 10 : 0}>
                <StatusBar
                    translucent={true}
                    backgroundColor={statusBarColor}
                    barStyle={statusBarStyle}
                    animated={animated}
                    hidden={statusBarHidden}
                />
                <Animated.View style={titleViewStyle}>{title}</Animated.View>
                <Animated.View style={sideViewStyle}>{this.renderLeftView()}</Animated.View>
                <Animated.View style={sideViewStyle}>{rightView}</Animated.View>
            </Animated.View>
        );
    }
}

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
        color: Theme.navBarTitleColor,
        flex: 1,
        fontSize: PxDp(19),
        textAlign: 'center',
    },
});

export default withNavigation(NavigatorBar);
