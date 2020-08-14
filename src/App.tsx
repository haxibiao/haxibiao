import React, { Component, useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import Orientation from 'react-native-orientation';
import { Toast, AppUpdateOverlay } from '~/components';
import codePush from 'react-native-code-push';
import SplashScreen from 'react-native-splash-screen';

import { ad } from 'react-native-ad';

import ApolloApp from './ApolloApp';

import JPushModule from 'jpush-react-native';
import * as WeChat from 'react-native-wechat-lib';

import { checkUpdate } from '~/utils';

import { WechatAppId } from '!/app.json';

function App() {
    let toastRef = useRef();
    const appLunch = useRef(true);

    //启动前，初始化Ad
    // ad.AdManager.init();

    useEffect(() => {
        global.Toast = toastRef.current;
        if (appLunch.current) {
            Orientation.lockToPortrait();
            SplashScreen.hide();
            appLunch.current = false;
        }

        fetchConfig();

        let rs = checkUpdate('autoCheck');
        if (rs) {
            AppUpdateOverlay.show(rs);
        }

        WeChat.registerApp(WechatAppId, '');
    }, []);

    const fetchConfig = () => {
        fetch(Config.ServerRoot + '/api/app-config?os=' + Platform.OS + '&store=' + Config.AppStore, {
            headers: {
                os: Platform.OS,
                store: Config.AppStore,
            },
        })
            .then((response) => response.json())
            .then((config) => {
                //广告开关
                if (config.ad) {
                    //Ad预加载
                    // ad.AdManager.loadFeedAd();
                    // ad.RewardVideo.loadAllAd();
                    //开屏
                    // ad.Splash.loadSplashAd();
                }
            })
            .catch((err) => {
                console.log('err', err);
            });
    };

    return (
        <View style={styles.container}>
            <ApolloApp />
            <Toast ref={toastRef} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

const codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

export default codePush(codePushOptions)(App);
