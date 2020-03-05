import React, { Component, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, Image } from 'react-native';
import { PageContainer, StatusView, Iconfont, Avatar } from '@src/components';
import { Query, GQL, useApolloClient } from '@src/apollo';
// import {userStore} from '@src/store';

import ArticleItem from './components/ArticleItem';

export default (props: any) => {
    const client = useApolloClient();

    useEffect(() => {
        return () => {
            client.query({
                query: GQL.unreadsQuery,
                fetchPolicy: 'network-only',
            });
        };
    }, []);
    return (
        <PageContainer title="其他提醒">
            <View style={styles.container}>
                <Query query={GQL.otherNotificationsQuery}>
                    {({ loading, error, data, refetch, fetchMore }) => {
                        if (loading) return null;
                        console.log(data);
                        let notifications = data.notifications;

                        let items = Helper.syncGetter('data', notifications);
                        if (items.length <= 0) return <StatusView.EmptyView />;
                        return (
                            <FlatList
                                data={items}
                                renderItem={item => ArticleItem(item)}
                                onEndReached={() => {
                                    let { hasMorePages, currentPage } = notifications.paginatorInfo;
                                    if (hasMorePages) {
                                        fetchMore({
                                            variables: {
                                                page: ++currentPage,
                                            },
                                            updateQuery: (prev, { fetchMoreResult }) => {
                                                if (fetchMoreResult && fetchMoreResult.notifications) {
                                                    return Object.assign({}, prev, {
                                                        notifications: Object.assign({}, prev.notifications, {
                                                            paginatorInfo: fetchMoreResult.notifications.paginatorInfo,
                                                            data: [
                                                                ...prev.notifications.data,
                                                                ...fetchMoreResult.notifications.data,
                                                            ],
                                                        }),
                                                    });
                                                }
                                            },
                                        });
                                    }
                                }}
                            />
                        );
                    }}
                </Query>
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.skinColor || "#FFF",
        flex: 1,
    },
});
