import { useNavigation, useRoute } from '@react-navigation/native';
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
