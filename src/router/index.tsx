import React from 'react';
import {
    NavigationContainer,
    CommonActions,
    useNavigation,
    useRoute,
    NavigationContext,
} from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import SCREENS from './routes';
import routing from './privateRoutes';

export { useNavigation, useRoute };

const router: { [key: string]: any } = routing;

export const middlewareNavigate = (navigation: any, routeName: string, params?: object, action?: any) => {
    if (router[routeName] && !TOKEN) {
        navigation.navigate('Login');
    } else {
        navigation.navigate(routeName, { params });
    }
};

export function withNavigation(WrappedComponent: React.Component): React.Component {
    return class HP extends React.Component {
        static contextType = NavigationContext;

        render() {
            return <WrappedComponent {...this.props} navigation={this.context} />;
        }
    };
}

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
