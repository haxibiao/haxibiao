import React, { useEffect, useContext, useCallback, useState } from 'react';
import { StyleSheet, Clipboard, Text, View, TouchableOpacity } from 'react-native';
import { ApolloProvider, useClientBuilder } from '~/apollo';
import RootStackNavigator from '~/router/RootStackNavigator';
import StoreContext, { observer, appStore } from '~/store';
import { ApolloProvider as OldApolloProvider } from 'react-apollo';
import { useCaptureVideo } from '~/hooks';
import { SocketServer, name } from '!/app.json';

import Echo from 'laravel-echo';
import Socketio from 'socket.io-client';
import JPushModule from 'jpush-react-native';

import { UserAgreementOverlay } from '~/components';

export default observer(() => {
    // const store = useContext(StoreContext);
    const client = useClientBuilder(Helper.syncGetter('userStore.me.token', store));
    appStore.client = client;

    const onStart = useCallback(() => {
        Toast.show({ content: '从粘贴板获取视频链接\n正在分享视频...' });
    }, []);

    const onFailed = useCallback((error) => {
        Toast.show({ content: error.message || '粘贴板视频上传失败' });
    }, []);

    const onSuccess = useCallback((post) => {
        Toast.show({ content: '视频上传成功' });
        // const video = Helper.syncGetter('data.resolveDouyinVideo', post);
        // let popViewRef;
        // Overlay.show(
        //     <Overlay.PopView modal={true} style={styles.overlay} ref={ref => (popViewRef = ref)}>
        //         <CaptureVideoSuccess
        //             video={video}
        //             onPress={() => {
        //                 middlewareNavigate('PostDetail', { post: video });
        //                 popViewRef.close();
        //             }}
        //         />
        //     </Overlay.PopView>,
        // );
    }, []);

    useCaptureVideo({ client, onStart, onSuccess, onFailed });

    const mountWebSocket = (user: { token: string | undefined; id: string }) => {
        console.log('mountWebSocket', user);
        if (user.token !== undefined) {
            // 构造laravel echo及Socket Client
            const echo = new Echo({
                broadcaster: 'socket.io',
                host: SocketServer,
                client: Socketio,
                auth: {
                    headers: {
                        Authorization: 'Bearer ' + user.token,
                    },
                },
            });

            console.log('Apollo echo', echo);
            appStore.setEcho(echo);

            // 监听公共频道
            echo.channel('notice').listen('NewNotice', sendLocalNotification);

            // 监听用户私人频道
            echo.private('App.User.' + user.id)
                // .listen('WithdrawalDone', sendLocalNotification)
                .listen('NewLike', sendLocalNotification)
                // .listen('NewFollow', sendLocalNotification)
                .listen('NewComment', sendLocalNotification)
                .listen('NewMessage', sendLocalNotification);
            // 系统通知栏

            console.log('socket listen ready');
        }
    };

    // 本地推送通知
    const sendLocalNotification = (data: any) => {
        console.log('socket got data', data);
        const currentDate = new Date();
        JPushModule.sendLocalNotification({
            buildId: 1,
            id: data.id,
            content: data.content,
            extra: {},
            fireTime: currentDate.getTime() + 3000,
            title: data.title,
        });
    };

    let user = Helper.syncGetter('userStore.me', store);
    console.log('now user is ', user);

    useEffect(() => {
        mountWebSocket(user);
    }, [user]);

    useEffect(() => {
        // 判断是否阅读用户协议
        console.log('是否阅读：', appStore.createUserAgreement);
        if (!appStore.createUserAgreement) {
            UserAgreementOverlay(true);
        }
    }, [appStore.createUserAgreement]);

    return (
        <OldApolloProvider client={client}>
            <ApolloProvider client={client}>
                <RootStackNavigator uriPrefix={`${name}://`} />
            </ApolloProvider>
        </OldApolloProvider>
    );
});

const styles = StyleSheet.create({
    overlay: { alignItems: 'center', justifyContent: 'center' },
});
