import React, { useEffect, useContext } from 'react';
import { ApolloProvider, useClientBuilder } from '@src/apollo';
import { RootStackNavigator, setRootNavigation } from '@src/router';
import StoreContext, { observer, appStore } from '@src/store';
import { ApolloProvider as OldApolloProvider } from 'react-apollo';

import {
    SocketServer
} from '@app/app.json';

import Echo from 'laravel-echo';
import Socketio from 'socket.io-client';

import JPushModule from 'jpush-react-native';

export default observer(() => {
    const store = useContext(StoreContext);
    const client = useClientBuilder(Helper.syncGetter('userStore.me.token', store));
    appStore.client = client;

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
    return (
        <OldApolloProvider client={client}>
            <ApolloProvider client={client}>
                <RootStackNavigator ref={setRootNavigation} />
            </ApolloProvider>
        </OldApolloProvider>
    );
});
