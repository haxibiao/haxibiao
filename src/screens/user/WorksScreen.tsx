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
} from '@src/components';
import { Query, GQL, useQuery } from '@src/apollo';
import { observable } from 'mobx';

export default (props: any) => {
    const user = props.navigation.getParam('user', {});
    const [observableArticles, setArticles] = useState(null);

    const { loading, error, data: myArticlesQueryResult, refetch, fetchMore } = useQuery(GQL.myArticlesQuery, {
        variables: { user_id: user.id },
        fetchPolicy: 'network-only',
    });
    const articles = useMemo(() => Helper.syncGetter('articles.data', myArticlesQueryResult), [myArticlesQueryResult]);

    const hasMorePages = useMemo(
        () => Helper.syncGetter('articles.paginatorInfo.hasMorePages', myArticlesQueryResult),
        [myArticlesQueryResult],
    );
    const currentPage = useMemo(() => Helper.syncGetter('articles.paginatorInfo.currentPage', myArticlesQueryResult), [
        myArticlesQueryResult,
    ]);

    useEffect(() => {
        if (Array.isArray(articles)) {
            setArticles(observable(articles));
        }
    }, [articles]);

    if (loading || !observableArticles ) return <SpinnerLoading />;

    return (
        <PageContainer title="个人作品">
            <View style={styles.container}>
                <FlatList
                    contentContainerStyle={styles.contentContainer}
                    bounces={false}
                    data={observableArticles}
                    refreshing={loading}
                    refreshControl={<CustomRefreshControl onRefresh={refetch} />}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEventThrottle={16}
                    renderItem={(item: any) => <PostItem post={item.item} showSubmitStatus={true} />}
                    ListEmptyComponent={
                        <StatusView.EmptyView
                            title="TA还没有作品"
                            imageSource={require('@src/assets/images/default_empty.png')}
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
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.skinColor,
        flex: 1,
    },
    contentContainer: {
        backgroundColor: '#fff',
        flexGrow: 1,
    },
});
