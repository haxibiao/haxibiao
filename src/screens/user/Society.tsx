/*
 * @flow
 * created by wyk made in 2019-03-22 14:00:05
 */
import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, ScrollTabBar } from '~/components';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Following from './society/Following';
import Follower from './society/Follower';

class Society extends Component {
    render() {
        let { navigation, route } = this.props;
        let user = route.params?.user ?? {};
        let follower = route.params?.follower;
        return (
            <PageContainer hiddenNavBar contentViewStyle={{ marginTop: Theme.statusBarHeight }}>
                <ScrollableTabView
                    initialPage={follower ? 1 : 0}
                    renderTabBar={(props) => <ScrollTabBar {...props} tabUnderlineWidth={pixel(50)} />}>
                    <Following tabLabel="关注" navigation={navigation} user={user} />
                    <Follower tabLabel="粉丝" navigation={navigation} user={user} />
                </ScrollableTabView>
                <View style={styles.backButton}>
                    <TouchFeedback activeOpacity={1} onPress={() => navigation.goBack()}>
                        <Iconfont name="zuojiantou" color={Theme.defaultTextColor} size={pixel(21)} />
                    </TouchFeedback>
                </View>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Theme.NAVBAR_HEIGHT,
        height: Theme.NAVBAR_HEIGHT,
        justifyContent: 'center',
        paddingLeft: pixel(Theme.itemSpace),
    },
});

export default Society;
