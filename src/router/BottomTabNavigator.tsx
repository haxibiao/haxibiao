import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import BottomTabBar from './BottomTabBar';
import bottomTabScreens from '!/theme/bottomTabScreens';

const Tab = createBottomTabNavigator();
export default function MainTabNavigator() {
    return (
        <Tab.Navigator initialRouteName="HomeScreen" tabBar={(props: any) => <BottomTabBar {...props} />}>
            {bottomTabScreens.map((tab: { name: any; screen: any; tabBarLabel: any; trackName: any }, index: any) => {
                return (
                    <Tab.Screen
                        key={index}
                        name={tab.name}
                        component={tab.screen}
                        options={{
                            tabBarLabel: tab.tabBarLabel,
                        }}
                        initialParams={{ trackName: tab.trackName }}
                    />
                );
            })}
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBarIcon: { width: 22, height: 22 },
});
