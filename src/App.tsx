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
        //获取APP的开启配置(广告和钱包)
        const { appStore } = store;

        //华为有单独的开关能力，这个逻辑后端就可以出好，前端统一传os和store回去即可
        fetch(Config.ServerRoot + '/api/app-config?os=' + Platform.OS + '&store=' + Config.AppStore, {
            headers: {
                os: Platform.OS,
                store: Config.AppStore,
            },
        })
            .then(response => response.json())
            .then(result => {
                //1.先store保存APP 配置信息(含ad appid,codeid等)
                console.log('ad result', result);
                appStore.setConfig(result);

                //2.再init AD(后端加载了更多需要的SDK)
                ad.AdManager.init();

                //3.开屏
                if (appStore.enableAd) {
                    //给后续需要展示的第一个弹层Feed预加载
                    ad.AdManager.loadFeedAd();
                    ad.RewardVideo.loadAllAd();
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
