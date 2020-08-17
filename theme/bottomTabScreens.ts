import HomeScreen from '~/screens/home';
import FindScreen from '~/screens/find';
import NotificationScreen from '~/screens/notification';
import MyHomeScreen from '~/screens/my';

//5个主tab的配置
export default [
    {
        name: 'Home',
        screen: HomeScreen,
        tabBarLabel: '首页',
        trackName: '首页',
    },
    {
        name: 'Find',
        screen: FindScreen,
        tabBarLabel: '发现',
        trackName: '发现',
    },
    {
        name: 'Publish',
        screen: NotificationScreen, //可以被自定义渲染替换
        tabBarLabel: '发布',
        trackName: '发布',
    },
    {
        name: 'Notification',
        screen: NotificationScreen,
        tabBarLabel: '通知',
        trackName: '通知',
    },
    {
        name: 'My',
        screen: MyHomeScreen,
        tabBarLabel: '个人',
        trackName: '个人',
    },
];
