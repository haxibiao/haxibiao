import React, { Component, useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import Orientation from 'react-native-orientation';
import { Toast } from './components';
import codePush from 'react-native-code-push';
import SplashScreen from 'react-native-splash-screen';

import { ttad } from './native';

import { Provider } from 'mobx-react';
import StoreContext, * as store from './store';
import ApolloApp from './ApolloApp';

import JPushModule from 'jpush-react-native';

import { checkUpdate } from '@src/common';

function App() {
    const appLunch = useRef(true);

    useEffect(() => {
        global.Toast = this.toast;
        if (appLunch.current) {
            Orientation.lockToPortrait();
            SplashScreen.hide();
            if (Config.AppStore !== 'huawei') {
                ttad.Splash.loadSplashAd();
            }
            appLunch.current = false;
        }

        fetchConfig();

        checkUpdate('autoCheck');
    }, []);

    const fetchConfig = () => {
        //获取广告开启配置
        const { appStore } = store;

        const name = Config.AppStore === 'huawei' ? 'huawei' : Platform.OS;
        fetch(Config.ServerRoot + '/api/app-config?' + Date.now(), {
            headers: {
                name,
            },
        })
            .then(response => response.json())
            .then(result => {
                console.log('result', result);
                appStore.setConfig(result);

                if (Config.AppStore === 'huawei' && result.ad === 'on') {
                    ttad.Splash.loadSplashAd();
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
