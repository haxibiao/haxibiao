import React, { Component, useState } from 'react';
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
// import {userStore} from '@src/store';

export default (props: any) => {
    const user = props.navigation.getParam('user', {});
    const { data: result } = useQuery(GQL.userQuery, {
        variables: { id: user.id },
    });

    const userData = Helper.syncGetter('user', result);

    const [firstFetch, setFirstFetch] = useState(true);

    return (
        <Query query={GQL.myArticlesQuery} variables={{ user_id: user.id }} fetchPolicy="network-only">
            {({ loading, error, data, refetch, fetchMore }) => {
                const articles = Helper.syncGetter('articles.data', data);

                if (firstFetch) {
                    var hasMorePages = Helper.syncGetter('articles.paginatorInfo.hasMorePages', data);
                    console.log('第一次取hasMorePages : ', hasMorePages);
                }

                let currentPage = Helper.syncGetter('articles.paginatorInfo.currentPage', data);
                if (loading || !articles || !userData) return <SpinnerLoading />;
                return (
                    <PageContainer title="个人作品">
                        <View style={styles.container}>
                            <FlatList
                                contentContainerStyle={styles.contentContainer}
                                bounces={false}
                                data={articles}
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
                                                page: ++currentPage,
                                            },
                                            updateQuery: (prev: any, { fetchMoreResult: more }) => {
                                                setFirstFetch(false);
                                                console.log('重新请求拿到的数据 : ', more);
                                                hasMorePages = Helper.syncGetter(
                                                    'articles.paginatorInfo.hasMorePages',
                                                    more,
                                                );
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
            }}
        </Query>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.skinColor,
        flex: 1,
    },
});
