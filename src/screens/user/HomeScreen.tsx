import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, FlatList, Animated } from 'react-native';

import {
    PostItem,
    PageContainer,
    StatusView,
    SpinnerLoading,
    Footer,
    Placeholder,
    CustomRefreshControl,
    ItemSeparator,
    HxfButton,
} from '~/components';
import { Query, useQuery, GQL } from '~/apollo';
import { observer, userStore } from '~/store';
import UserProfile from './components/UserProfile';
import BottomBar from './components/BottomBar';
import { observable } from 'mobx';

const animatedReferenceValue = Device.WIDTH * 0.75 - PxDp(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight);

export default observer((props: any) => {
    const user = props.route.params?.user ?? {};
    const [observableArticles, setArticles] = useState(null);

    const { data: userQueryResult } = useQuery(GQL.userQuery, {
        variables: { id: user.id },
    });
    const userData = useMemo(() => Helper.syncGetter('user', userQueryResult), [userQueryResult]);
    const isSelf = useMemo(() => userStore.me.id === user.id, [userStore]);

    const { loading, error, data: userArticlesQueryResult, refetch, fetchMore } = useQuery(GQL.userArticlesQuery, {
        variables: { user_id: user.id },
    });
    const articles = useMemo(() => Helper.syncGetter('articles.data', userArticlesQueryResult), [
        userArticlesQueryResult,
    ]);

    const hasMorePages = useMemo(
        () => Helper.syncGetter('articles.paginatorInfo.hasMorePages', userArticlesQueryResult),
        [userArticlesQueryResult],
    );
    const currentPage = useMemo(
        () => Helper.syncGetter('articles.paginatorInfo.currentPage', userArticlesQueryResult),
        [userArticlesQueryResult],
    );

    useEffect(() => {
        if (Array.isArray(articles)) {
            setArticles(observable(articles));
        }
    }, [articles]);

    const scrollAnimateValue = useRef(new Animated.Value(0));

    const scrollListener = useCallback((e) => {
        const { contentOffset, contentSize } = e.nativeEvent;
        const { y } = contentOffset;
    }, []);

    const onScroll = useMemo(() => {
        return Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollAnimateValue.current } } }],
            {
                listener: scrollListener,
            },
            { useNativeDriver: true },
        );
    }, [scrollListener]);

    const height = scrollAnimateValue.current.interpolate({
        inputRange: [0, animatedReferenceValue],
        outputRange: [Device.WIDTH * 0.75, PxDp(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight)],
        extrapolate: 'clamp',
    });

    const opacity = scrollAnimateValue.current.interpolate({
        inputRange: [0, animatedReferenceValue],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const titleOpacity = scrollAnimateValue.current.interpolate({
        inputRange: [0, animatedReferenceValue],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    if (loading || !userData || !observableArticles) return <SpinnerLoading />;

    return (
        <PageContainer contentViewStyle={{ marginTop: 0 }} error={error}>
            <FlatList
                contentContainerStyle={styles.contentContainer}
                bounces={false}
                data={observableArticles}
                refreshing={loading}
                refreshControl={<CustomRefreshControl onRefresh={refetch} />}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={onScroll}
                renderItem={(item: any) => <PostItem post={item.item} />}
                ListEmptyComponent={
                    <StatusView.EmptyView
                        title="TA还没有作品"
                        imageSource={require('!/assets/images/default_empty.png')}
                    />
                }
                onEndReached={() => {
                    if (hasMorePages) {
                        fetchMore({
                            variables: {
                                page: currentPage + 1,
                            },
                            updateQuery: (prev: any, { fetchMoreResult: more }) => {
                                if (more && more.articles) {
                                    return {
                                        articles: {
                                            ...more.articles,
                                            data: [...prev.articles.data, ...more.articles.data],
                                        },
                                    };
                                }
                            },
                        });
                    }
                }}
                ListFooterComponent={() => (hasMorePages ? <Placeholder quantity={1} /> : null)}
            />
            <Animated.View style={[styles.profileView, { height }]}>
                <UserProfile
                    user={userData}
                    titleStyle={{
                        opacity: titleOpacity,
                    }}
                    contentStyle={{
                        opacity,
                    }}
                />
            </Animated.View>

            {!isSelf && <BottomBar user={userData} navigation={props.navigation} />}
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: '#fff',
        flexGrow: 1,
        paddingTop: Device.WIDTH * 0.75,
    },
    profileView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: Device.WIDTH,
        height: Device.WIDTH * 0.75,
        overflow: 'hidden',
    },
});
