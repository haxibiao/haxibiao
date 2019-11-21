/*
 * @flow
 */

import React, { Component } from 'react';
import { View, StyleSheet, Text, StatusBar } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import NavigatorBar from '../Header/NavigatorBar';
import KeyboardSpacer from '../Other/KeyboardSpacer';
import SubmitLoading from '../View/SubmitLoading';
import SpinnerLoading from '../View/SpinnerLoading';
import StatusView from '../StatusView';

type Props = {
    store?: Object, // redux screen state
    navBar?: any, // 导航条
    refetch?: Function,
    error?: boolean,
    loading?: boolean,
    submitting?: boolean,
    submitTips?: string,
    empty?: boolean,
    EmptyView?: any,
    loadingSpinner?: any,
    children?: any,
    autoKeyboardInsets?: boolean, // 键盘占位
    topInsets?: number,
    safeView?: boolean, // iOS底部导航条
    style?: any, // 外层View样式
    contentViewStyle?: any, // 包裹层View样式

    hiddenNavBar?: boolean,

    onLayout: Function,
    onWillFocus: Function,
    onDidFocus: Function,
    onWillBlur: Function,
    onDidBlur: Function,

    ...NavigatorBar.Props,
};

class PageContainer extends Component<Props> {
    static defaultProps = {
        safeView: false,
        hiddenNavBar: false,
        autoKeyboardInsets: true,
        submitTips: '提交中...',
        topInsets: -Theme.HOME_INDICATOR_HEIGHT,
    };

    renderContent() {
        const { error, loading, empty, loadingSpinner, EmptyView, children, refetch } = this.props;
        if (error) return <StatusView.ErrorView onPress={refetch} error={error} />;
        if (loading) return loadingSpinner || <SpinnerLoading />;
        if (empty) return EmptyView || <StatusView.EmptyView />;
        return children;
    }

    renderNavBar() {
        const { navBar, ...navBarProps } = this.props;
        let navView = null;
        if (typeof navBar === 'undefined') {
            navView = <NavigatorBar {...navBarProps} />;
        } else {
            navView = navBar;
        }
        return navView;
    }

    render() {
        const {
            style,
            contentViewStyle,
            hiddenNavBar,
            autoKeyboardInsets,
            topInsets,
            onWillFocus,
            onDidFocus,
            onWillBlur,
            onDidBlur,
            submitting,
            submitTips,
            safeView,
            ...props
        } = this.props;
        const marginTop = !hiddenNavBar ? PxDp(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight) : 0;
        const marginBottom = safeView ? Theme.HOME_INDICATOR_HEIGHT : 0;
        return (
            <View style={[styles.container, style]} {...props}>
                {hiddenNavBar ? (
                    <StatusBar translucent={true} backgroundColor="rgba(0,0,0,0)" barStyle="light-content" />
                ) : (
                    this.renderNavBar()
                )}
                <View style={[styles.contentView, { marginTop, marginBottom }, contentViewStyle]}>
                    {this.renderContent()}
                </View>
                {autoKeyboardInsets && <KeyboardSpacer topInsets={topInsets} />}
                <NavigationEvents
                    onWillFocus={onWillFocus}
                    onDidFocus={onDidFocus}
                    onWillBlur={onWillBlur}
                    onDidBlur={onDidBlur}
                />
                <SubmitLoading isVisible={submitting} content={submitTips} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentView: {
        flex: 1,
    },
});

export default PageContainer;
