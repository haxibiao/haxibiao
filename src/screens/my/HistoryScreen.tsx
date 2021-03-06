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

    const { loading, error, data: userVisitsQueryResult, refetch, fetchMore } = useQuery(GQL.userVisitsQuery, {
        variables: { user_id: me.id },
        fetchPolicy: 'network-only',
    });
    const articles = useMemo(() => Helper.syncGetter('visits.data', userVisitsQueryResult), [userVisitsQueryResult]);

    const hasMorePages = useMemo(() => Helper.syncGetter('visits.paginatorInfo.hasMorePages', userVisitsQueryResult), [
        userVisitsQueryResult,
    ]);
    const currentPage = useMemo(() => Helper.syncGetter('visits.paginatorInfo.currentPage', userVisitsQueryResult), [
        userVisitsQueryResult,
    ]);

    console.log('浏览记录：', userVisitsQueryResult);

    useEffect(() => {
        if (Array.isArray(articles)) {
            setArticles(observable(articles));
        }
    }, [articles]);

    if (loading || !observableArticles) return <SpinnerLoading />;
    // console.log("loading",loading);
    // console.log("!observableArticles",observableArticles);
    console.log('要是有事也是一样啥意思呀', observableArticles);

    return (
        <PageContainer title="浏览记录" while>
            <View style={styles.container}>
                <FlatList
                    contentContainerStyle={styles.contentContainer}
                    bounces={false}
                    data={observableArticles}
                    refreshing={loading}
                    refreshControl={<CustomRefreshControl onRefresh={refetch} />}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEventThrottle={16}
                    renderItem={(item: any) => <PostItem time_ago={item.item.time_ago} post={item.item.article} />}
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
                                    if (more && more.visits) {
                                        return {
                                            visits: {
                                                ...more.visits,
                                                data: [...prev.visits.data, ...more.visits.data],
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
        backgroundColor: Theme.groundColour,
        flex: 1,
    },
    contentContainer: {
        backgroundColor: '#fff',
        flexGrow: 1,
    },
});
