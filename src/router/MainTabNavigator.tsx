import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

import HomeScreen from '~/screens/home';
import FindScreen from '~/screens/find';
import NotificationScreen from '~/screens/notification';
import MyHomeScreen from '~/screens/my';

import { BottomTabBar } from './BottomTabBar';

const routerConfig = {
    首页: {
        screen: HomeScreen,
        navigationOptions: () => TabOptions('首页'),
    },
    发现: {
        screen: FindScreen,
        navigationOptions: () => TabOptions('发现'),
    },
    通知: {
        screen: NotificationScreen,
        navigationOptions: () => TabOptions('通知'),
    },
    个人: {
        screen: MyHomeScreen,
        navigationOptions: () => TabOptions('个人'),
    },
};

export default createBottomTabNavigator(routerConfig, {
    initialRouteName: '首页',
    tabBarComponent: BottomTabBar,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    lazy: false,
    backBehavior: 'none',
    swipeEnabled: true,
    tabBarOptions: {
        safeAreaInset: {
            bottom: 'always',
            top: 'never',
        },
        showLabel: false,
    },
    navigationOptions: ({ navigation }) => {
        const { routes } = navigation.state;
        const params = routes ? routes[navigation.state.index].params : null;

        const headerTitle = params ? params.title : '';

        const headerTitleStyle = {
            color: 'white',
            flex: 1,
            textAlign: 'center',
        };
        const headerBackTitle = null;
        const headerTintColor = 'white';
        const headerStyle = {
            backgroundColor: Theme.navBarBackground,
            shadowColor: 'transparent',
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderBottomColor: 'transparent',
            elevation: 0,
        };
        const header = null;
        return {
            swipeEnabled: true,
            headerTitle,
            headerStyle,
            headerTitleStyle,
            headerBackTitle,
            headerTintColor,
            header,
        };
    },
});

const TabOptions = (routeName) => {
    const title = routeName;
    const tabBarIcon = ({ focused }: { focused: boolean }) => {
        let source;
        let name;
        let a;
        switch (routeName) {
            case '首页':
                source = focused
                    ? require('~/assets/images/init_main_focus.png')
                    : require('~/assets/images/init_main.png');
                a = focused ? true : false;
                name = '首页';
                break;
            case '发现':
                source = focused
                    ? require('~/assets/images/init_discover_focus.png')
                    : require('~/assets/images/init_discover.png');
                a = focused ? true : false;
                name = '发现';
                break;
            case '通知':
                source = focused
                    ? require('~/assets/images/init-notification-focus.png')
                    : require('~/assets/images/init-notification.png');
                name = '通知';
                a = focused ? true : false;
                break;
            case '个人':
                source = focused
                    ? require('~/assets/images/init_personal_focus.png')
                    : require('~/assets/images/init_personal.png');
                name = '个人';
                a = focused ? true : false;
                break;
        }
        return (
            <View style={styles.top}>
                <Image source={source} style={styles.image} />
                <Text
                    style={{ width: PxDp(20), height: PxDp(14), fontSize: Font(8), color: a ? '#1777FF' : '#989898' }}>
                    {name}
                </Text>
            </View>
        );
    };
    const tabBarVisible = true;
    return { title, tabBarVisible, tabBarIcon };
};
const styles = StyleSheet.create({
    top: {
        width: PxDp(75),
        height: PxDp(49),
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: PxDp(20),
        height: PxDp(20),
        marginBottom: PxDp(5),
    },
});
