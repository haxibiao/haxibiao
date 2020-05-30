import React from 'react';
import { View, Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

import HomeScreen from '@src/screens/home';
import FindScreen from '@src/screens/find';
import TaskScreen from '@src/screens/task';
import NotificationScreen from '@src/screens/notification';
import MyHomeScreen from '@src/screens/my';

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
    资产: {
        screen: TaskScreen,
        navigationOptions: () => TabOptions('资产'),
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

const TabOptions = routeName => {
    const title = routeName;
    const tabBarIcon = ({ focused }: { focused: boolean; }) => {
        let source;
        switch (routeName) {
            case '首页':
                source = focused
                    ? require('@app/assets/images/init-main-focus.png')
                    : require('@app/assets/images/init-main.png');
                break;
            case '发现':
                source = focused
                    ? require('@app/assets/images/init-discover-focus.png')
                    : require('@app/assets/images/init-discover.png');
                break;
            case '通知':
                source = focused
                    ? require('@app/assets/images/init-notification-focus.png')
                    : require('@app/assets/images/init-notification.png');
                break;
            case '资产':
                source = focused
                    ? require('@app/assets/images/init-wallet-focus.png')
                    : require('@app/assets/images/init-wallet.png');
                break;
            case '个人':
                source = focused
                    ? require('@app/assets/images/init-personal-focus.png')
                    : require('@app/assets/images/init-personal.png');
                break;
        }
        return <Image source={source} style={{ width: PxDp(42), height: PxDp(42) }} />;
    };
    const tabBarVisible = true;
    return { title, tabBarVisible, tabBarIcon };
};
