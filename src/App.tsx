import React, { Component, useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import Orientation from 'react-native-orientation';
import { Toast, AppUpdateOverlay } from '~/components';
import codePush from 'react-native-code-push';
import SplashScreen from 'react-native-splash-screen';

import { ad } from 'react-native-ad';
import ApolloApp from './ApolloApp';

import * as WeChat from 'react-native-wechat-lib';

import { checkUpdate } from '~/utils';
import { WechatAppId } from '!/app.json';
import { appStore, adStore } from '~/store';

//直播
import { LicenseKey, LicenseUrl } from '!/app.json';
import { LivePullManager } from 'react-native-live';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

function App() {
    let toastRef = useRef();
    const appLunch = useRef(true);

    //启动前，初始化Ad
    ad.init({
        appid: adStore.tt_appid,
    });

    //启动个开屏广告
    const splashAd = ad.startSplash({
        appid: adStore.tt_appid,
        codeid: adStore.codeid_splash,
    });

    splashAd.subscribe('onAdClose', (event) => {
        console.log('广告关闭', event);
    });

    splashAd.subscribe('onAdSkip', (i) => {
        console.log('用户点击跳过监听', i);
    });

    splashAd.subscribe('onAdError', (e) => {
        console.log('开屏加载失败监听', e);
    });

    splashAd.subscribe('onAdClick', (e) => {
        console.log('开屏被用户点击了', e);
    });

    splashAd.subscribe('onAdShow', (e) => {
        console.log('开屏开始展示', e);
    });

    useEffect(() => {
        // 只做直播相关权限检查，获取交由权限浮层
        // checkPermission();
        /**
         *  直播设置licenseKey,url
         */
        // LivePullManager.setLicence(LicenseUrl, LicenseKey);

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

    // 直播权限检查函数
    function checkPermission() {
        if (Platform.OS === 'android') {
            check(PERMISSIONS.ANDROID.CAMERA).then((result) => {
                if (result === RESULTS.GRANTED) {
                    // 有摄像头权限，下一步检查麦克风权限
                    check(PERMISSIONS.ANDROID.RECORD_AUDIO).then((result) => {
                        if (result === RESULTS.GRANTED) appStore.AppSetSufficientPermissions(true);
                    });
                }
            });
        } else if (Platform.OS === 'ios') {
            check(PERMISSIONS.IOS.CAMERA).then((result) => {
                if (result === RESULTS.GRANTED) {
                    // 有摄像头权限，下一步检查麦克风权限
                    check(PERMISSIONS.IOS.MICROPHONE).then((result) => {
                        if (result === RESULTS.GRANTED) appStore.AppSetSufficientPermissions(true);
                    });
                }
            });
        }
    }

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
