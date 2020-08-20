import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import BottomTabBar from './BottomTabBar';
import bottomTabScreens from '!/theme/bottomTabScreens';
import { adStore } from '../store';

const Tab = createBottomTabNavigator();
export default function MainTabNavigator() {
    return (
        <Tab.Navigator initialRouteName="HomeScreen" tabBar={(props: any) => <BottomTabBar {...props} />}>
            {bottomTabScreens.map((tab: { name: any; screen: any; tabBarLabel: any; trackName: any }, index: any) => {
                //通知任务根据网赚钱包开关二选一
                if (tab.name === 'Notification' && adStore.enableWallet) {
                    return null;
                }
                if (tab.name === 'Task' && !adStore.enableWallet) {
                    return null;
                }
                return (
                    <Tab.Screen
                        key={index}
                        name={tab.name}
                        component={tab.screen}
                        options={{
                            tabBarLabel: tab.tabBarLabel,
                        }}
                        initialParams={{
                            trackName: tab.trackName,
                        }}
                    />
                );
            })}
        </Tab.Navigator>
    );
}
