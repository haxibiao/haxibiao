import React from 'react';
import {
    View,
    Text,
    Image,
    Animated,
    StyleSheet,
    Keyboard,
    Platform,
    LayoutChangeEvent,
    ScaledSize,
    Dimensions,
    TouchableOpacity,
    DeviceEventEmitter,
    TouchableWithoutFeedback,
} from 'react-native';
import { Overlay } from 'teaset';
import { CommonActions, useTheme } from '@react-navigation/native';
import { useSafeArea } from 'react-native-safe-area-context';
import { observer, userStore, appStore } from '../store';
import { BoxShadow } from 'react-native-shadow';

type Props = {
    state: any;
    navigation: any;
    descriptors: any;
    activeBackgroundColor?: any;
    activeTintColor?: any;
    adaptive?: any;
    allowFontScaling?: any;
    inactiveBackgroundColor?: any;
    inactiveTintColor?: any;
    keyboardHidesTabBar?: any;
    labelPosition?: any;
    labelStyle?: any;
    safeAreaInsets?: any;
    showIcon?: any;
    showLabel?: any;
    style?: any;
    tabStyle?: any;
    activeTintColor?: string;
    inactiveTintColor?: string;
};

const DEFAULT_TABBAR_HEIGHT = 50;

const useNativeDriver = Platform.OS !== 'web';

const iconSource = {
    HomeScreen: {
        active: require('~/assets/images/init_main_focus.png'),
        inactive: require('~/assets/images/init_main.png'),
    },
    FindScreen: {
        active: require('~/assets/images/init_discover_focus.png'),
        inactive: require('~/assets/images/init_discover.png'),
    },
    Notification2: {
        active: require('~/assets/images/init-notification-focus.png'),
        inactive: require('~/assets/images/init-notification.png'),
    },
    Notification: {
        active: require('~/assets/images/init-notification-focus.png'),
        inactive: require('~/assets/images/init-notification.png'),
    },
    MyHomeScreen: {
        active: require('~/assets/images/init_personal_focus.png'),
        inactive: require('~/assets/images/init_personal.png'),
    },
};

export default observer(
    ({
        state,
        navigation,
        descriptors,
        activeBackgroundColor,
        activeTintColor,
        adaptive = true,
        allowFontScaling,
        inactiveBackgroundColor,
        inactiveTintColor,
        keyboardHidesTabBar = false,
        labelPosition,
        labelStyle,
        safeAreaInsets,
        showIcon,
        showLabel,
        style,
        tabStyle,
    }: Props) => {
        const { colors } = useTheme();
        const defaultInsets = useSafeArea();

        const focusedRoute = state.routes[state.index];
        console.log('111111===============', focusedRoute);

        const focusedDescriptor = descriptors[focusedRoute.key];
        const focusedOptions = focusedDescriptor.options;

        const [isKeyboardShown, setIsKeyboardShown] = React.useState(false);

        const shouldShowTabBar = focusedOptions.tabBarVisible !== false && !(keyboardHidesTabBar && isKeyboardShown);

        const [isTabBarHidden, setIsTabBarHidden] = React.useState(!shouldShowTabBar);

        const [visible] = React.useState(() => new Animated.Value(shouldShowTabBar ? 1 : 0));

        const hemoButtomClickTime = React.useRef(0);

        React.useEffect(() => {
            if (shouldShowTabBar) {
                Animated.timing(visible, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }).start(({ finished }) => {
                    if (finished) {
                        setIsTabBarHidden(false);
                    }
                });
            } else {
                setIsTabBarHidden(true);

                Animated.timing(visible, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            }
        }, [shouldShowTabBar, visible]);

        const [dimensions, setDimensions] = React.useState(() => {
            const { height = 0, width = 0 } = Dimensions.get('window');

            return { height, width };
        });

        React.useEffect(() => {
            const handleOrientationChange = ({ window }: { window: ScaledSize }) => {
                setDimensions(window);
            };

            Dimensions.addEventListener('change', handleOrientationChange);

            const handleKeyboardShow = () => setIsKeyboardShown(true);
            const handleKeyboardHide = () => setIsKeyboardShown(false);

            if (Platform.OS === 'ios') {
                Keyboard.addListener('keyboardWillShow', handleKeyboardShow);
                Keyboard.addListener('keyboardWillHide', handleKeyboardHide);
            } else {
                Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
                Keyboard.addListener('keyboardDidHide', handleKeyboardHide);
            }

            return () => {
                Dimensions.removeEventListener('change', handleOrientationChange);

                if (Platform.OS === 'ios') {
                    Keyboard.removeListener('keyboardWillShow', handleKeyboardShow);
                    Keyboard.removeListener('keyboardWillHide', handleKeyboardHide);
                } else {
                    Keyboard.removeListener('keyboardDidShow', handleKeyboardShow);
                    Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
                }
            };
        }, []);

        const [layout, setLayout] = React.useState({
            height: 0,
            width: dimensions.width,
        });

        const handleLayout = (e: LayoutChangeEvent) => {
            const { height, width } = e.nativeEvent.layout;

            setLayout((layout) => {
                if (height === layout.height && width === layout.width) {
                    return layout;
                } else {
                    return {
                        height,
                        width,
                    };
                }
            });
        };

        const { routes } = state;

        const insets = {
            top: safeAreaInsets?.top ?? defaultInsets.top,
            right: safeAreaInsets?.right ?? defaultInsets.right,
            bottom: safeAreaInsets?.bottom ?? defaultInsets.bottom,
            left: safeAreaInsets?.left ?? defaultInsets.left,
        };

        return (
            <Animated.View
                style={[
                    styles.bottomTabBar,
                    {
                        backgroundColor: focusedRoute.name != 'HomeScreen' ? colors.card : 'rgba(255,255,255,0)',
                        borderTopColor: colors.border,
                    },
                    {
                        transform: [
                            {
                                translateY: visible.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [layout.height + insets.bottom, 0],
                                }),
                            },
                        ],
                        // Absolutely position the tab bar so that the content is below it
                        // This is needed to avoid gap at bottom when the tab bar is hidden
                        position: 'absolute',
                    },
                    {
                        height: DEFAULT_TABBAR_HEIGHT + insets.bottom,
                        paddingBottom: insets.bottom,
                        paddingHorizontal: Math.max(insets.left, insets.right),
                    },
                ]}
                pointerEvents={isTabBarHidden ? 'none' : 'auto'}>
                <View style={styles.content} onLayout={handleLayout}>
                    {routes.map((route: any, index: number) => {
                        if (!appStore.enableWallet && route.name === 'Task') {
                            return;
                        }

                        const focused = index === state.index;
                        const { options } = descriptors[route.key];
                        const color = focused ? activeTintColor : inactiveTintColor;
                        const tabBarLabel = descriptors[route.key].options.tabBarLabel || route.name;

                        const onPress = () => {
                            // 实现双击首页底部图标跳转顶部
                            if (index === 0) {
                                if (hemoButtomClickTime.current >= new Date().getTime() - 200) {
                                    DeviceEventEmitter.emit('findListGoTop', {});
                                    hemoButtomClickTime.current = 0;
                                }
                                hemoButtomClickTime.current = new Date().getTime();
                            }

                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!focused && !event.defaultPrevented) {
                                navigation.dispatch({
                                    ...CommonActions.navigate(route.name),
                                    target: state.key,
                                });
                            }
                        };

                        const onLongPress = () => {
                            navigation.emit({
                                type: 'tabLongPress',
                                target: route.key,
                            });
                        };
                        if (index == 2) {
                            return <PublishButton key="publishButton" navigation={navigation} />;
                        }

                        return (
                            <TouchableOpacity
                                style={styles.tabItem}
                                activeOpacity={0.9}
                                key={route.key}
                                onPress={onPress}
                                onLongPress={onLongPress}>
                                <TabBarIcon
                                    name={route.name}
                                    focused={focused}
                                    activeTintColor={activeTintColor}
                                    inactiveTintColor={inactiveTintColor}
                                />
                                <Text style={[styles.label, { color }]}>{tabBarLabel}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </Animated.View>
        );
    },
);

function TabBarIcon({ name, focused, activeTintColor, inactiveTintColor }) {
    // We render the icon twice at the same position on top of each other:
    // active and inactive one, so we can fade between them.
    return (
        <View style={styles.tabBarIcon}>
            <View style={[styles.icon, { opacity: focused ? 1 : 0 }]}>
                <Image source={iconSource[name].active} style={styles.iconSize} />
            </View>
            <View style={[styles.icon, { opacity: focused ? 0 : 1 }]}>
                <Image source={iconSource[name].inactive} style={styles.iconSize} />
            </View>
        </View>
    );
}
const PublishButton = ({ navigation }) => {
    const onPublishPress = () => {
        navigation.navigate('AskQuestion');
    };

    return (
        <TouchableWithoutFeedback key="publish" onPress={onPublishPress}>
            <View style={styles.tabItem}>
                <Image
                    source={require('../assets/images/publish.png')}
                    style={{
                        width: 40,
                        height: 40,
                    }}
                />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    bottomTabBar: {
        left: 0,
        right: 0,
        bottom: 0,
        borderTopWidth: StyleSheet.hairlineWidth,
        elevation: 8,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
    },
    tabItem: {
        flex: 1,
        position: 'relative',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBarIcon: {
        position: 'relative',
        width: 22,
        height: 22,
    },
    icon: {
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        minWidth: 25,
    },
    iconSize: {
        width: 22,
        height: 22,
    },
    label: {
        fontSize: 10,
        marginTop: 2,
    },
});
