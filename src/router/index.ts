/*
 * @flow
 */

import { NavigationActions, withNavigation } from 'react-navigation';
import routing from './routing';
export * from 'react-navigation-hooks';
export { default as RootStackNavigator } from './RootStackNavigator';

let rootNavigation: any = null;

let router: { [key: string]: any };
router = routing;

export function setRootNavigation(navigation: any) {
    rootNavigation = navigation;
}

export const middlewareNavigate = (routeName: string, params?: object, action?: any) => {
    const authAction = NavigationActions.navigate({
        routeName: 'Login',
    });
    const navigateAction = NavigationActions.navigate({
        routeName,
        params,
        action,
    });
    if (router[routeName] && router[routeName].auth && !TOKEN) {
        rootNavigation.dispatch(authAction);
    } else {
        rootNavigation.dispatch(navigateAction);
    }
};
