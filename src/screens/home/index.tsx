import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import { StyleSheet, View, FlatList, StatusBar, Image, ImageBackground, Text } from 'react-native';

import { GQL, useQuery, useApolloClient } from '@src/apollo';
import StoreContext, { observer, appStore } from '@src/store';
import { ttad } from '@src/native';

import VideoItem from './components/VideoItem';
import Footer from './components/Footer';
import RewardProgress from './components/RewardProgress';
import VideoStore from './VideoStore';
import CommentOverlay from '../comment/CommentOverlay';
import { useNavigation } from '@src/router';
import { Keys, Storage } from '../../store/localStorage';

export default observer(props => {
    const store = useContext(StoreContext);
    const client = useApolloClient();
    const navigation = useNavigation();
    const firstAuthenticationQuery = useRef(false);
    const commentRef = useRef();
    const activeItem = useRef(0);
    const config = useRef({
        waitForInteraction: true,
        viewAreaCoveragePercentThreshold: 95,
    });

    VideoStore.showComment = useCallback(() => {
        commentRef.current.slideUp();
    }, [commentRef]);

    const hideComment = useCallback(() => {
        commentRef.current.slideDown();
    }, [commentRef]);

    const onLayout = useCallback(event => {
        const { height } = event.nativeEvent.layout;
        appStore.viewportHeight = height;
    }, []);

    const VideosQuery = useCallback(() => {
        return client.query({
            query: GQL.RecommendVideosQuery,
            variables: { page: VideoStore.currentPage, count: 5 },
        });
    }, [client]);

    const fetchData = useCallback(
        async ({ authentication }) => {
            VideoStore.isLoadMore = true;
            const [error, result] = await Helper.exceptionCapture(VideosQuery);
            const videoSource = Helper.syncGetter('data.recommendVideos.data', result);
            if (error) {
                VideoStore.isError = true;
            } else {
                if (Array.isArray(videoSource) && videoSource.length > 0) {
                    if (authentication) {
                        VideoStore.dataSource = videoSource;
                        firstAuthenticationQuery.current = false;
                    } else {
                        VideoStore.addSource(videoSource);
                    }
                } else {
                    VideoStore.isFinish = true;
                }
            }
            VideoStore.isLoadMore = false;
        },
        [VideosQuery],
    );

    const getVisibleRows = useCallback(info => {
        if (info.viewableItems[0]) {
            activeItem.current = info.viewableItems[0].index;
            VideoStore.viewableItemIndex = activeItem.current;
        }
    }, []);

    const onMomentumScrollEnd = useCallback(
        event => {
            if (VideoStore.dataSource.length - activeItem.current <= 3) {
                fetchData({ authentication: firstAuthenticationQuery.current });
            }
        },
        [fetchData],
    );

    useEffect(() => {
        fetchData({ authentication: firstAuthenticationQuery.current });
        const navWillFocusListener = props.navigation.addListener('willFocus', () => {
            StatusBar.setBarStyle('light-content');
        });
        const navWillBlurListener = navigation.addListener('willBlur', () => {
            StatusBar.setBarStyle('dark-content');
            // hideComment();
        });
        return () => {
            navWillFocusListener.remove();
            navWillBlurListener.remove();
        };
    }, []);

    useEffect(() => {
        if (TOKEN) {
            firstAuthenticationQuery.current = true;
            fetchData({ authentication: firstAuthenticationQuery.current });
        }
    }, [TOKEN]);

    // 静默注册登录
    const { userStore } = store;
    let me = { ...userStore.me };

    async function HandleSilentLogin() {
        // 如果 firstInstall 为 false 则用户主动注销过，不再进行静默登录
        let firstInstall = await Storage.getItem(Keys.firstInstall);
        console.log('Info : firstInstall from storage : ', firstInstall);
        if (firstInstall) {
            //首次静默注册登录
            console.log('Info : firstInstall 为 true，用户未主动注销账号');
            SilentSignIn();
        } else {
            //不进行静默登录
            console.log('Info : firstInstall 为 false 用户主动注销过，不进行静默登录');
        }
    }
    async function ResetVersionHandler() {
        let resetVersion = await Storage.getItem(Keys.resetVersion);
        if (resetVersion !== Config.AppVersion && me) {
            //版本变动，重新静默注册登录.更新版本号
            userStore.changeResetVersion(Config.AppVersion);
            SilentSignIn();
        }
    }

    useEffect(() => {
        console.log('me :', me);
        //版本变动，重新静默注册登录
        ResetVersionHandler();
        if (me && me.id !== undefined) {
            console.log('me.id : ', me.id);
            // 该APP已经登录过，不调用静默登录
        } else {
            console.log('Info : [home/index.tsx]  userStore.me : ', me);
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
                .then(result => {
                    const safeData = Helper.syncGetter('data.autoSignIn', result);
                    const { userStore } = store;
                    userStore.signIn(safeData);
                    console.log('Info : 静默注册登录成功 , me ', safeData);
                })
                .catch(error => {
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
                        <Image style={styles.curtain} source={require('@src/assets/images/curtain.png')} />
                    </View>
                }
                ListFooterComponent={<Footer />}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onViewableItemsChanged={getVisibleRows}
                viewabilityConfig={config.current}
            />
            {appStore.enableWallet && (
                <View style={styles.rewardProgress}>
                    {me.id ? (
                        <View />
                    ) : (
                        <ImageBackground
                            source={require('@src/assets/images/chat_left.png')}
                            style={styles.overlayTip}
                            resizeMode={'stretch'}>
                            <Text style={styles.overlayTipText}>登录后看视频赚钱、边看边赚</Text>
                        </ImageBackground>
                    )}
                    <RewardProgress />
                </View>
            )}

            <CommentOverlay
                ref={commentRef}
                media={VideoStore.dataSource[VideoStore.viewableItemIndex >= 0 ? VideoStore.viewableItemIndex : 0]}
                navigation={navigation}
            />
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
        width: null,
        height: null,
    },
    rewardProgress: {
        position: 'absolute',
        right: PxDp(Theme.itemSpace),
        bottom: PxDp(330 + Theme.HOME_INDICATOR_HEIGHT),
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
