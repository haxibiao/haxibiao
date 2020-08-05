import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '~screens/home';
import FindScreen from '~screens/find';
import NotificationScreen from '~screens/notification';
import MyHomeScreen from '~screens/my';

import {BottomTabBar} from './BottomTabBar';

const Tab = createBottomTabNavigator();
export default function MainTabNavigator() {
    return (
        <Tab.Navigator initialRouteName="HomeScreen" tabBar={(props: any) => <BottomTabBar {...props} />}>
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    tabBarLabel: '首页',
                }}
            />
            <Tab.Screen
                name="FindScreen"
                component={FindScreen}
                options={{
                    tabBarLabel: '发现',
                }}
            />
            <Tab.Screen
                name="Notification"
                component={NotificationScreen}
                options={{
                    tabBarLabel: '通知',
                }}
            />
            <Tab.Screen
                name="MyHomeScreen"
                component={MyHomeScreen}
                options={{
                    tabBarLabel: '个人',
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBarIcon: { width: 22, height:22 },
});
