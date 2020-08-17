import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, FlatList, Image } from 'react-native';
const { width: sw, height: sh } = Dimensions.get('window');
import { Overlay } from 'teaset';
import { Avatar } from 'react-native-widgets';
import { appStore, observer } from '~/store';
import { GQL } from '~/apollo';
import { ApolloClient } from 'apollo-boost';
import LiveStore from './LiveStore';

const radius = 12;
let client: ApolloClient<unknown>;

const ContentView = observer((props: any) => {
    const [data, setdata] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);

    useEffect(() => {
        client = appStore.client;
        if (client) {
            client
                .query({
                    query: GQL.RoomUsersQuery,
                    variables: { room_id: parseInt(LiveStore.roomidForOnlinePeople) },
                    fetchPolicy: 'network-only',
                })
                .then((rs) => {
                    console.log(rs);
                    let list = rs.data?.getLiveRoomUsers ?? [];
                    setdata([...list]);
                    console.log(list);
                    setloading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    const RenderItem = ({ item, index }: { item: { name: string; avatar: any }; index: number }) => {
        console.log('用户头像', item.avatar);
        return (
            <View style={styles.onlinePeople}>
                <Avatar size={32} uri={item.avatar} frameStyle={{ marginHorizontal: 10 }} />
                <Text style={{ fontSize: 15, color: '#333' }}>{item.name}</Text>
            </View>
        );
    };

    return (
        <View style={styles.body}>
            {error ? (
                <View style={styles.errorWrapper}>
                    <Image
                        source={require('./images/default_error.png')}
                        resizeMode="contain"
                        style={{ height: '38%', width: '38%' }}
                    />
                </View>
            ) : (
                <>
                    {loading ? (
                        <View style={styles.loadingWrapper}>
                            <Image
                                source={require('./images/lightning.png')}
                                resizeMode="contain"
                                style={{ height: 34, width: 34 }}
                            />
                            <Text>加载中...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={data}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={RenderItem}
                            ListEmptyComponent={() => {
                                return (
                                    <View style={styles.emptyWrapper}>
                                        <Image
                                            source={require('./images/default_message.png')}
                                            resizeMode="contain"
                                            style={{ height: '46%', width: '46%' }}
                                        />
                                        <Text style={{ color: '#999' }}>暂无在线观众</Text>
                                    </View>
                                );
                            }}
                        />
                    )}
                </>
            )}
        </View>
    );
});

let overlaykey: any = null;
const showOnlinePeopleModal = () => {
    const view = (
        <Overlay.PullView side="bottom" containerStyle={{ backgroundColor: 'transparent' }}>
            <ContentView />
        </Overlay.PullView>
    );
    overlaykey = Overlay.show(view);
};

const hideOnlinePeopleModal = () => {
    Overlay.hide(overlaykey);
};

export { showOnlinePeopleModal, hideOnlinePeopleModal };

const styles = StyleSheet.create({
    body: {
        height: sh * 0.45,
        width: sw,
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        backgroundColor: 'white',
        paddingTop: 10,
    },
    onlinePeople: {
        width: sw,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    errorWrapper: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingWrapper: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    emptyWrapper: {
        height: sh * 0.45,
        width: sw,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
