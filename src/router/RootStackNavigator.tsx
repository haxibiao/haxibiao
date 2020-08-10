import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import SCREENS from './routes';

type StackParamList = {
    Home: undefined;
} & {
    [P in keyof typeof SCREENS]: undefined;
};

const Stack = createStackNavigator<StackParamList>();

export default () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" headerMode="none">
                <Stack.Screen name="Home" component={BottomTabNavigator} />
                {(Object.keys(SCREENS) as (keyof typeof SCREENS)[]).map((name) => (
                    <Stack.Screen
                        key={name}
                        name={name}
                        component={SCREENS[name].component}
                        initialParams={SCREENS[name].params}
                        options={{
                            cardStyleInterpolator: ['Login', 'ToLogin'].includes(name)
                                ? CardStyleInterpolators.forVerticalIOS
                                : CardStyleInterpolators.forHorizontalIOS,
                        }}
                    />
                ))}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
