import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Image, ImageBackground, Text, Alert, TouchableOpacity } from 'react-native';
import { observer, Storage, Keys } from '../store';
import Swiper from 'react-native-swiper';
import { StackActions, NavigationActions } from 'react-navigation';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function GuideSplash(props: any) {
    const navigation = useNavigation();
    const route = useRoute();

    const [guide, setGuide] = useState(false);
    var status = false;

    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: '主页' })],
    });

    const handlerAction = (routeName: any) => {
        if (routeName) {
            const handlerScheme = StackActions.reset({
                index: 1,
                actions: [
                    NavigationActions.navigate({ routeName: '主页' }),
                    NavigationActions.navigate({ routeName: routeName }),
                ],
            });
            navigation.dispatch(handlerScheme);
        } else {
            navigation.dispatch(resetAction);
        }
    };

    async function getStatus() {
        // console.log('GuideSplash navigation', navigation);
        const routeName = route.params?.route;
        status = await Storage.getItem(Keys.ShowSplash);
        // console.log('status ', status);
        if (status) {
            // navigate to home
            handlerAction(routeName);
        } else {
            // first install , launch splash guide
            setGuide(true);
            await Storage.setItem(Keys.ShowSplash, true);
        }
    }
    useEffect(() => {
        getStatus();
    }, []);

    return (
        <>
                <Image
                    source={{ uri: 'launch_screen' }}
                    style={{ width: Device.WIDTH, height: Device.HEIGHT }}
                    resizeMode={'cover'}
                />
        </>
    );
}
const dotSize = 7,
    radius = dotSize / 2;
const styles = StyleSheet.create({
    body: {
        ...StyleSheet.absoluteFill,
    },
    desc: {
        marginBottom: Theme.HOME_INDICATOR_HEIGHT + Device.WIDTH * 0.22,
        alignItems: 'center',
    },
    dot: {
        backgroundColor: '#DDDDDDf1',
        marginBottom: 0,
        marginEnd: 10,
        width: dotSize,
        height: dotSize,
        borderRadius: radius,
    },
    activeDot: {
        backgroundColor: '#FA5A5C',
        marginBottom: 0,
        marginEnd: 10,
        width: dotSize,
        height: dotSize,
        borderRadius: radius,
    },
    enterWrapper: {
        width: 60,
        height: 24,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    enterBtn: {
        width: 60,
        height: 24,
        borderRadius: 19,
        position: 'absolute',
        right: 15,
        top: Theme.HOME_INDICATOR_HEIGHT + 40,
    },
});
