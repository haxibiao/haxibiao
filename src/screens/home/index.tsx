import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import { StyleSheet, View, FlatList, StatusBar, Image, ImageBackground, Text } from 'react-native';
import { GQL, useQuery, useApolloClient } from '~/apollo';
import { SpinnerLoading } from '~/components';
import { useDetainment } from '~/utils';

import VideoItem from './components/VideoItem';
import Footer from './components/Footer';
import RewardProgress from './components/RewardProgress';
import CommentOverlay from '../comment/CommentOverlay';
import { useNavigation } from '~/router';
import { observer, appStore, Keys, Storage, userStore } from '~/store';
import VideoStore from '!/src/store/DrawVideoStore';

export default observer(() => {
    const me = { ...userStore.me };
    const client = useApolloClient();
    const navigation = useNavigation();
    useDetainment(navigation, true);

    //展开评论用
    const commentRef = useRef();
    // 动态添加属性，mobx 6自动proxy, 不兼容hermes...
    // appStore.showComment = useCallback(() => {
    //     console.log('展开评论slideUp');
    //     commentRef.current.slideUp();
    // }, [commentRef]);

    const config = useRef({
        waitForInteraction: true,
        viewAreaCoveragePercentThreshold: 95,
    });
    const activeMedia = useMemo(
        () => VideoStore.dataSource[VideoStore.viewableItemIndex >= 0 ? VideoStore.viewableItemIndex : 0],
        [VideoStore.dataSource, VideoStore.viewableItemIndex],
    );

    const onLayout = useCallback((event) => {
        const { height } = event.nativeEvent.layout;
        appStore.viewportHeight = height;
    }, []);

    const VideosQuery = useCallback(() => {
        return client.query({
            query: GQL.RecommendVideosQuery,
            variables: { page: VideoStore.currentPage, count: 5 },
        });
    }, [client, TOKEN]);

    const fetchData = useCallback(async () => {
        if (!VideoStore.isLoadMore) {
            VideoStore.isLoadMore = true;
            const [error, result] = await Helper.exceptionCapture(VideosQuery);
            const videoSource = Helper.syncGetter('data.recommendVideos.data', result);
            console.log('首页视频刷数据videoSource', videoSource);

            if (error) {
                VideoStore.isError = true;
            } else {
                if (Array.isArray(videoSource) && videoSource.length > 0) {
                    VideoStore.addSource(videoSource);
                } else {
                    VideoStore.isFinish = true;
                }
            }
            VideoStore.isLoadMore = false;
        }
    }, [VideosQuery]);

    const getVisibleRows = useCallback((info) => {
        if (info.viewableItems[0]) {
            VideoStore.viewableItemIndex = info.viewableItems[0].index;
        }
    }, []);

    const onMomentumScrollEnd = useCallback(
        (event) => {
            if (VideoStore.dataSource.length - VideoStore.viewableItemIndex <= 3) {
                fetchData();
            }
        },
        [fetchData],
    );

    useEffect(() => {
        const navWillFocusListener = navigation.addListener('willFocus', () => {
            StatusBar.setBarStyle('light-content');
        });
        const navWillBlurListener = navigation.addListener('willBlur', () => {
            StatusBar.setBarStyle('dark-content');
        });
        return () => {
            navWillFocusListener();
            navWillBlurListener();
        };
    }, []);

    useEffect(() => {
        if (userStore.launched) {
            fetchData();
        }
        return () => {
            VideoStore.reset();
        };
    }, [userStore.launched]);

    // 静默注册登录

    // console.log("来自storage的 userStore from store : ",userStore)
    // console.log("me from store : ",me)
    async function HandleSilentLogin() {
        // 如果 firstInstall 为 false 则用户主动注销过，不再进行静默登录
        const firstInstall = await Storage.getItem(Keys.firstInstall);
        console.log('首页处理静默登录函数中获取的 firstInstall : ', firstInstall);
        if (firstInstall) {
            // 首次静默注册登录
            SilentSignIn();
        }
    }
    async function ResetVersionHandler() {
        const resetVersion = await Storage.getItem(Keys.resetVersion);
        if (resetVersion !== Config.AppVersion && me.id) {
            // 版本变动，重新静默注册登录.更新版本号
            appStore.changeResetVersion(Config.AppVersion);
            SilentSignIn();
        }
    }

    useEffect(() => {
        // 版本变动，重新静默注册登录
        ResetVersionHandler();
        // 该APP没有登录过，调用静默登录
        if (!me.id) {
            HandleSilentLogin();
        }
    }, [me]);

    async function SilentSignIn() {
        const uuid = Device.UUID;
        if (uuid) {
            // 调用静默注册接口
            client
                .mutate({
                    mutation: GQL.autoSignInMutation,
                    variables: { UUID: uuid },
                })
                .then((result) => {
                    const safeData = Helper.syncGetter('data.autoSignIn', result);
                    userStore.signIn(safeData);
                })
                .catch((error) => {
                    // 静默登录失败，引导用户到手动登录页
                    navigation.navigate('Login');
                });
        } else {
            // 没有拿到uuid,引导用户到手动登录页
            navigation.navigate('Login');
        }
    }

    return (
        <View style={styles.container} onLayout={onLayout}>
            {VideoStore.dataSource.length !== 0 ? (
                <FlatList
                    data={VideoStore.dataSource}
                    contentContainerStyle={{ flexGrow: 1 }}
                    bounces={false}
                    scrollsToTop={false}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                    pagingEnabled={true}
                    removeClippedSubviews={true}
                    keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                    renderItem={({ item, index }) => <VideoItem media={item} index={index} />}
                    getItemLayout={(data, index) => ({
                        length: appStore.viewportHeight,
                        offset: appStore.viewportHeight * index,
                        index,
                    })}
                    ListEmptyComponent={
                        <View style={styles.cover}>
                            <Image style={styles.curtain} source={require('!/assets/images/curtain.png')} />
                        </View>
                    }
                    ListFooterComponent={<Footer />}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    onViewableItemsChanged={getVisibleRows}
                    viewabilityConfig={config.current}
                />
            ) : (
                <SpinnerLoading />
            )}

            <CommentOverlay ref={commentRef} media={activeMedia} navigation={navigation} />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#131C1C',
        flex: 1,
    },
    cover: {
        flex: 1,
        // ...StyleSheet.absoluteFill,
    },
    curtain: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rewardProgress: {
        position: 'absolute',
        right: pixel(Theme.itemSpace),
        bottom: pixel(350 + Theme.BOTTOM_HEIGHT),
    },
    overlayTip: {
        position: 'absolute',
        height: 85,
        width: 115,
        paddingBottom: 15,
        paddingHorizontal: 5,
        zIndex: 999,
        top: -80,
        left: -100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayTipText: { color: '#fff', fontSize: 14 },
});
