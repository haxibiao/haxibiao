import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, FlatList, Animated, Image } from 'react-native';
import {
    PostItem,
    PageContainer,
    StatusView,
    SpinnerLoading,
    Footer,
    Placeholder,
    CustomRefreshControl,
    ItemSeparator,
    TouchFeedback,
} from '~/components';
import { Query, useQuery, GQL } from '~/apollo';
import { observer } from '~/store';
import CategoryProfile from './components/CategoryProfile';
import { observable } from 'mobx';

const animatedReferenceValue = Device.WIDTH * 0.75 - PxDp(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight);

export default observer((props: any) => {
    const category = props.route.params?.category ?? {};
    const [observableArticles, setArticles] = useState([]);

    const { data: categoryQueryResult } = useQuery(GQL.categoryQuery, {
        variables: { id: category.id },
    });
    const categoryData = useMemo(() => Helper.syncGetter('category', categoryQueryResult), [categoryQueryResult]);

    const { loading, error, data: categoryArticlesQueryResult, refetch, fetchMore } = useQuery(
        GQL.categoryArticlesQuery,
        {
            variables: { category_id: category.id },
        },
    );
    const articles = useMemo(() => Helper.syncGetter('articles.data', categoryArticlesQueryResult), [
        categoryArticlesQueryResult,
    ]);

    const hasMorePages = useMemo(
        () => Helper.syncGetter('articles.paginatorInfo.hasMorePages', categoryArticlesQueryResult),
        [categoryArticlesQueryResult],
    );
    const currentPage = useMemo(
        () => Helper.syncGetter('articles.paginatorInfo.currentPage', categoryArticlesQueryResult),
        [categoryArticlesQueryResult],
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

    const translateX = scrollAnimateValue.current.interpolate({
        inputRange: [0, animatedReferenceValue],
        outputRange: [0, PxDp(Theme.itemSpace * 2)],
        extrapolate: 'clamp',
    });

    const translateY = scrollAnimateValue.current.interpolate({
        inputRange: [0, animatedReferenceValue],
        outputRange: [0, -PxDp(Theme.NAVBAR_HEIGHT)],
        extrapolate: 'clamp',
    });

    const fontSize = scrollAnimateValue.current.interpolate({
        inputRange: [0, animatedReferenceValue],
        outputRange: [PxDp(20), PxDp(16)],
        extrapolate: 'clamp',
    });

    const buttonPress = useCallback(() => {
        if (TOKEN) {
            props.navigation.navigate('AskQuestion', { category });
        } else {
            props.navigation.navigate('Login');
        }
    }, [TOKEN, category]);

    if (loading || !categoryData || !articles) return <SpinnerLoading />;

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
                <CategoryProfile
                    category={categoryData}
                    titleStyle={{ transform: [{ translateX }, { translateY }] }}
                    nameStyle={{ fontSize }}
                />
            </Animated.View>
            <View style={styles.buttonWrap}>
                <TouchFeedback activeOpacity={1} onPress={buttonPress}>
                    <Image source={require('!/assets/images/ic_send_post.png')} style={styles.sendButton} />
                </TouchFeedback>
            </View>
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
    buttonWrap: {
        position: 'absolute',
        right: PxDp(Theme.itemSpace),
        bottom: PxDp(Theme.HOME_INDICATOR_HEIGHT + Theme.itemSpace * 2),
    },
    sendButton: { width: PxDp(52), height: PxDp(52) },
});
