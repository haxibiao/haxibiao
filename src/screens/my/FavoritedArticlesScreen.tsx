import React, { Component, useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import {
    PostItem,
    PageContainer,
    StatusView,
    SpinnerLoading,
    Footer,
    Placeholder,
    CustomRefreshControl,
    ItemSeparator,
} from '~/components';
import { Query, GQL, useQuery } from '~/apollo';
import { userStore } from '~/store';
import { observable } from 'mobx';

export default (props: any) => {
    const { me } = userStore;
    const [observableArticles, setArticles] = useState(null);

    const { loading, error, data: favorites, refetch, fetchMore } = useQuery(GQL.userFavoritedArticlesQuery, {
        variables: { user_id: me.id },
        fetchPolicy: 'network-only',
    });
    const articles = useMemo(() => Helper.syncGetter('favorites.data', favorites), [favorites]);

    const hasMorePages = useMemo(() => Helper.syncGetter('favorites.paginatorInfo.hasMorePages', favorites), [
        favorites,
    ]);
    const currentPage = useMemo(() => Helper.syncGetter('favorites.paginatorInfo.currentPage', favorites), [favorites]);

    useEffect(() => {
        if (Array.isArray(articles)) {
            setArticles(observable(articles));
        }
    }, [articles]);

    if (loading || !observableArticles) return <SpinnerLoading />;
    console.log('loading', loading);
    console.log('!observableArticles', observableArticles);

    return (
        <PageContainer title="我的收藏">
            <View style={styles.container}>
                <FlatList
                    contentContainerStyle={styles.contentContainer}
                    bounces={false}
                    data={observableArticles}
                    refreshing={loading}
                    refreshControl={<CustomRefreshControl onRefresh={refetch} />}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEventThrottle={16}
                    renderItem={(item: any) => {
                        if (Helper.syncGetter('item.article', item)) {
                            return <PostItem post={item.item.article} />;
                        }
                    }}
                    ListEmptyComponent={
                        <StatusView.EmptyView imageSource={require('!/assets/images/default_empty.png')} />
                    }
                    onEndReached={() => {
                        if (hasMorePages) {
                            fetchMore({
                                variables: {
                                    page: currentPage + 1,
                                },
                                updateQuery: (prev: any, { fetchMoreResult: more }) => {
                                    if (more && more.favorites) {
                                        return {
                                            favorites: {
                                                ...more.favorites,
                                                data: [...prev.favorites.data, ...more.favorites.data],
                                            },
                                        };
                                    }
                                },
                            });
                        }
                    }}
                    ListFooterComponent={() => (hasMorePages ? <Placeholder quantity={1} /> : null)}
                />
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.skinColor || '#FFF',
        flex: 1,
    },
    contentContainer: {
        backgroundColor: '#fff',
        flexGrow: 1,
    },
});
