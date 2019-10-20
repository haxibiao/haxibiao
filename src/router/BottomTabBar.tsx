import React, { useMemo } from 'react';
import { View, Image, TouchableWithoutFeedback } from 'react-native';
import { observer, userStore, appStore } from '@src/store';

export const BottomTabBar = observer(props => {
    const { navigation, onTabPress, renderIcon } = props;
    const { routes, index: currentIndex } = navigation.state;

    const TabItems = routes.map((route, index) => {
        const scene = {
            index,
            focused: index === currentIndex,
            route,
        };
        return (
            <TouchableWithoutFeedback key={route.key} onPress={() => onTabPress({ route })}>
                <View style={styles.tabItem}>{renderIcon(scene)}</View>
            </TouchableWithoutFeedback>
        );
    });

    const PublicItem = useMemo(
        () => (
            <TouchableWithoutFeedback
                key="create"
                onPress={() => navigation.navigate(userStore.login ? 'AskQuestion' : 'Login')}>
                <View style={styles.tabItem}>
                    <Image
                        source={require('@src/assets/images/publish.png')}
                        style={{
                            width: PxDp(40),
                            height: PxDp(40),
                        }}
                    />
                </View>
            </TouchableWithoutFeedback>
        ),
        [],
    );

    TabItems.splice(2, 0, PublicItem);
    const lightModel = currentIndex === 0;

    return (
        <View style={[styles.tabBarContainer, lightModel && styles.lightStyle, appStore.modalIsShow && styles.hidden]}>
            {TabItems}
        </View>
    );
});

const styles = {
    tabBarContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        height: Theme.HOME_INDICATOR_HEIGHT + PxDp(56),
        backgroundColor: '#ffffff',
        borderTopWidth: Theme.minimumPixel,
        borderTopColor: Theme.borderColor,
    },
    hidden: {
        zIndex: -1,
    },
    lightStyle: {
        backgroundColor: 'transparent',
        borderTopColor: 'transparent',
    },
    tabItem: {
        flex: 1,
        position: 'relative',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
    },
};
