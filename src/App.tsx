import React, { Component, useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import Orientation from 'react-native-orientation';
import { Toast } from './components';
import codePush from 'react-native-code-push';
import SplashScreen from 'react-native-splash-screen';

import { ad } from './native';

import { Provider } from 'mobx-react';
import StoreContext, * as store from './store';
import ApolloApp from './ApolloApp';

import JPushModule from 'jpush-react-native';
import * as WeChat from 'react-native-wechat';

import { checkUpdate } from '@src/common';

import { WechatAppId } from '@app/app.json';

function App() {
    const appLunch = useRef(true);

    //启动前，初始化Ad
    ad.AdManager.init();

    useEffect(() => {
        global.Toast = this.toast;
        if (appLunch.current) {
            Orientation.lockToPortrait();
            SplashScreen.hide();
            appLunch.current = false;
        }

        fetchConfig();

        checkUpdate('autoCheck');

        WeChat.registerApp(WechatAppId);
    }, []);

    const fetchConfig = () => {
        fetch(Config.ServerRoot + '/api/app-config?os=' + Platform.OS + '&store=' + Config.AppStore, {
            headers: {
                os: Platform.OS,
                store: Config.AppStore,
            },
        })
            .then(response => response.json())
            .then(config => {

                //广告开关
                if (config.ad) {
                    //Ad预加载
                    ad.AdManager.loadFeedAd();
                    ad.RewardVideo.loadAllAd();
                    //开屏
                    ad.Splash.loadSplashAd();
                }
            })
            .catch(err => {
                console.log('err', err);
            });
    };

    return (
        <View style={styles.container}>
            <StoreContext.Provider value={store}>
                <ApolloApp />
            </StoreContext.Provider>
            <Toast ref={ref => (this.toast = ref)} />
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
