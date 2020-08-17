import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Platform,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    ImageBackground,
    Image,
    Dimensions,
} from 'react-native';
import PageCleared from './components/PageCleared';
import { appStore, observer } from '@src/store';
import { GQL } from '@src/apollo';
const { width: sw, height: sh } = Dimensions.get('window');
import ApolloClient from 'apollo-boost';
import LottieView from 'lottie-react-native';
import * as PermissionChecker from './CommonWidgetPermissionChecker';

var StatusBarHeight = StatusBar.currentHeight ?? 0; // 状态栏高度

import { userStore } from '../../store';
const ItemGap = 6;
const ItemWidth = (sw - ItemGap * 3) / 2;

function isAndroid() {
    return Platform.OS == 'android';
}

interface Item {
    id: string;
    cover: string;
    title: string;
    count_audience: number;
}
let newclient: ApolloClient<unknown>;

const Live = (props: { navigation: any; inCurrent: boolean }) => {
    const [page, setpage] = useState(1);
    const [hasmore, sethasmore] = useState(true);
    const [liverooms, setliverooms] = useState([]);
    const [refreshing, setrefreshing] = useState(false);
    const [loading, setloading] = useState(true);

    function FetchLiveList(page?: number, fresh?: boolean) {
        newclient = appStore.client;
        if (newclient) {
            newclient
                .query({
                    query: GQL.RecommendLiveRoom,
                    variables: {
                        page: page ?? 1,
                    },
                    fetchPolicy: 'network-only',
                })
                .then((rs: any) => {
                    console.log('直播列表返回数据: ', rs);
                    let { paginatorInfo, data } = rs.data.recommendLiveRoom;
                    sethasmore(paginatorInfo.hasMorePages);
                    if (fresh) {
                        setliverooms([...data]);
                        setrefreshing(false);
                    } else {
                        if (data.length > 0) {
                            let templist = liverooms;
                            for (let i of data) {
                                let room: Item = {
                                    id: i.id,
                                    title: i.title,
                                    cover: i.cover,
                                    count_audience: i.count_audience,
                                };
                                templist.push(room);
                            }
                            setliverooms([...templist]);
                        }
                    }
                    setloading(false);
                })
                .catch((err: any) => {
                    //TODO: 直播间列表查询错误
                    console.log('直播间列表查询错误: ', err);
                });
        }
    }

    useEffect(() => {
        FetchLiveList(page);
    }, []);

    useEffect(() => {
        if (props.inCurrent) FetchLiveList(page, true);
    }, [props.inCurrent]);

    const RenderItem = ({ item, index }: { item: Item; index: number }) => {
        // console.log("直播列表item ",item)
        let roomId = item.id;

        return (
            <TouchableOpacity
                onPress={() => {
                    //TODO: 跳转到直播间
                    // console.log('房间号', roomId);

                    props.navigation.navigate('livewatch', { roomid: roomId });
                }}
                activeOpacity={1.0}
                style={{ marginStart: ItemGap, marginBottom: ItemGap }}>
                <ImageBackground source={{ uri: item.cover }} style={styles.body} resizeMode="cover">
                    <View style={styles.bottomTitle}>
                        <Text style={{ color: '#ffffffcc', maxWidth: ItemWidth * 0.62 }} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={require('./res/fill_person.png')}
                                resizeMode="contain"
                                style={{ height: 15, width: 15, opacity: 0.8, marginTop: 1.5 }}
                            />
                            <Text style={{ color: '#ffffffcc' }}>{item.count_audience}</Text>
                        </View>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    };

    const RenderEmpty = (props: any) => {
        const GoPushHandler = () => {
            if (userStore.login) {
                if (appStore.sufficient_permissions) {
                    props.navigation.navigate('startlive');
                } else {
                    //权限不够，打开权限窗口
                    PermissionChecker.showPermissionCheck();
                }
            } else {
                props.navigation.navigate('Login');
            }
        };

        return (
            <View style={{ flex: 1, height: sh - sh * 0.2, justifyContent: 'space-around', alignItems: 'center' }}>
                <View style={{ alignItems: 'center' }}>
                    <LottieView
                        source={require('./res/empty_live.json')}
                        style={{ height: sw * 0.23, width: sw * 0.23 }}
                        autoPlay
                        loop
                    />
                    <Text style={{ color: '#777', marginTop: 10 }}>啊哦、暂时没有主播在播~</Text>
                </View>
                <TouchableOpacity activeOpacity={0.9} onPress={GoPushHandler}>
                    <Image
                        source={require('./res/gotopush.png')}
                        style={{ width: sw * 0.3, height: (sw * 0.3 * 76) / 280 }}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    const RenderLoading = () => {
        return (
            <View style={{ height: sh, width: sw, alignItems: 'center', paddingTop: sh * 0.3 }}>
                <LottieView
                    source={require('./res/loading.json')}
                    style={{ height: sw * 0.23, width: sw * 0.23 }}
                    autoPlay
                    loop
                />
            </View>
        );
    };

    const NavBarHeight = isAndroid() ? 48 : 44; //安卓对应48，IOS对应44

    return (
        <PageCleared safe>
            {loading ? (
                RenderLoading()
            ) : (
                <FlatList
                    data={liverooms}
                    contentContainerStyle={{ paddingTop: ItemGap }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={RenderItem}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => <RenderEmpty navigation={props.navigation} />}
                    ListHeaderComponent={() => {
                        return <View style={{ height: 36 }} />;
                    }}
                    refreshControl={
                        <RefreshControl
                            title={'加载中...'}
                            refreshing={refreshing}
                            // colors={['rgb(255,176,0)', '#ffb100']}
                            colors={[Theme.primaryColor, Theme.secondaryColor]}
                            onRefresh={() => {
                                setrefreshing(true);
                                FetchLiveList(1, true);
                            }}
                        />
                    }
                    numColumns={3}
                    onEndReachedThreshold={0.33}
                    onEndReached={() => {
                        // 触底加载更多
                        if (hasmore) {
                            console.log('触底加载更多');
                            let nextpage = page + 1;
                            setpage(nextpage);
                            FetchLiveList(nextpage, false);
                        }
                    }}
                />
            )}

            {/* 以白色补上底部透明导航 */}
            <View style={{ width: Device.WIDTH, height: PxDp(Theme.BOTTOM_HEIGHT), backgroundColor: '#FFF' }} />
        </PageCleared>
    );
};
export default Live;

const styles = StyleSheet.create({
    body: {
        height: ItemWidth,
        width: ItemWidth,
        borderRadius: ItemGap,
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    bottomTitle: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
        backgroundColor: '#00000033',
    },
});
