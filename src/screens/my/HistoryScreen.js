import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Text } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { goContentScreen } from '@src/common';
import { PageContainer, ContentEnd, ScrollTabBar, LoadingError, StatusView, SpinnerLoading } from '@src/components';

import { Query, GQL } from '@src/apollo';
import { userStore } from '@src/store';
class HistoryScreen extends Component {
    render() {
        const { me } = userStore;
        return (
            <PageContainer title="浏览记录">
                <View style={styles.container}>
                    <ScrollableTabView renderTabBar={props => <ScrollTabBar {...props} tabUnderlineWidth={PxDp(50)} />}>
                        <View tabLabel="今日" style={{ flex: 1 }}>
                            <StatusView.EmptyView />
                        </View>
                        <View tabLabel="更早" style={{ flex: 1 }}>
                            <StatusView.EmptyView />
                        </View>
                    </ScrollableTabView>
                </View>
            </PageContainer>
        );
        return (
            <PageContainer title="浏览记录">
                <View style={styles.container}>
                    <ScrollableTabView renderTabBar={props => <ScrollTabBar {...props} width={160} />}>
                        <View tabLabel="今日" style={{ flex: 1 }}>
                            <Query query={GQL.visitsQuery} variables={{ filter: 'TODAY', user_id: me.id }}>
                                {({ error, loading, data, fetchMore, refetch }) => {
                                    if (error) return <LoadingError reload={() => refetch()} />;
                                    if (loading) return <SpinnerLoading />;
                                    let {
                                        data: items,
                                        paginatorInfo: { currentPage, hasMorePages },
                                    } = data.visits;
                                    if (items.length < 1) {
                                        return <StatusView.EmptyView />;
                                    }
                                    return (
                                        <FlatList
                                            data={items}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={this._historyItem}
                                            onEndReached={() => {
                                                if (hasMorePages) {
                                                    fetchMore({
                                                        variables: {
                                                            page: ++currentPage,
                                                        },
                                                        updateQuery: (prev, { fetchMoreResult: more }) => {
                                                            return {
                                                                articles: {
                                                                    ...more.visits,
                                                                    data: [...prev.visits.data, ...more.visits.data],
                                                                },
                                                            };
                                                        },
                                                    });
                                                }
                                            }}
                                            ListFooterComponent={() => <ContentEnd />}
                                        />
                                    );
                                }}
                            </Query>
                        </View>
                        <View tabLabel="更早" style={{ flex: 1 }}>
                            <Query query={GQL.visitsQuery} variables={{ filter: 'EARLY', user_id: me.id }}>
                                {({ error, loading, data, fetchMore, refetch }) => {
                                    if (error) return <LoadingError reload={() => refetch()} />;
                                    if (loading) return <SpinnerLoading />;
                                    let {
                                        data: items,
                                        paginatorInfo: { currentPage, hasMorePages },
                                    } = data.visits;
                                    if (items.length < 1) {
                                        return <StatusView.EmptyView />;
                                    }
                                    return (
                                        <FlatList
                                            data={items}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={this._historyItem}
                                            onEndReached={() => {
                                                if (hasMorePages) {
                                                    fetchMore({
                                                        variables: {
                                                            page: ++currentPage,
                                                        },
                                                        updateQuery: (prev, { fetchMoreResult: more }) => {
                                                            return {
                                                                articles: {
                                                                    ...more.visits,
                                                                    data: [...prev.visits.data, ...more.visits.data],
                                                                },
                                                            };
                                                        },
                                                    });
                                                }
                                            }}
                                            ListFooterComponent={() => <ContentEnd />}
                                        />
                                    );
                                }}
                            </Query>
                        </View>
                    </ScrollableTabView>
                </View>
            </PageContainer>
        );
    }

    _historyItem = ({ item, index }) => {
        let { navigation } = this.props;
        let title = item.article.title;
        let description = item.article.description;
        return (
            <TouchableOpacity
                style={styles.historyItem}
                onPress={() => goContentScreen(navigation, { ...item.article, type: item.type })}>
                <View style={{ flex: 1, marginRight: 20 }}>
                    <Text style={styles.title} numberOfLines={3}>
                        {title ? title : description}
                    </Text>
                </View>
                <Text style={styles.timeAgo}>{item.time_ago}</Text>
            </TouchableOpacity>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.skinColor,
    },
    historyItem: {
        height: 100,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: Theme.lightBorderColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        lineHeight: 22,
        color: Theme.primaryFontColor,
    },
    timeAgo: {
        fontSize: 13,
        color: Theme.lightFontColor,
    },
});

export default HistoryScreen;
