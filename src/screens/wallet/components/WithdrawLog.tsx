import React, { Component, useContext } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl } from 'react-native';
// import { ErrorView, LoadingSpinner, EmptyView, } from '~/components';
import { Footer, SpinnerLoading, LoadingError, StatusView } from '~/components';

import { Query, GQL, useQuery } from '~/apollo';
import { userStore } from '~/store';
import WithdrawLogItem from './WithdrawLogItem';

class WithdrawLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: false,
            fetching: false,
        };
    }

    render() {
        const { navigation } = this.props;
        let wallet_id = userStore.me.wallet.id;
        if (!wallet_id) {
            return (
                <View style={{ flex: 1 }}>
                    <StatusView.EmptyView />
                </View>
            );
        }
        return (
            <View style={{ flex: 1 }}>
                <Query query={GQL.userWithdraws} variables={{ wallet_id: wallet_id }}>
                    {({ loading, error, data, fetchMore, refetch }) => {
                        if (loading) return <SpinnerLoading />;
                        if (error) return <LoadingError reload={() => refetch()} />;
                        let {
                            data: items,
                            paginatorInfo: { currentPage, hasMorePages },
                        } = data.withdraws;
                        console.log('data', data);
                        if (items.length < 1) return <StatusView.EmptyView />;
                        return (
                            <FlatList
                                data={items}
                                keyextractor={(index) => index.toString()}
                                refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
                                renderItem={({ item }) => {
                                    return <WithdrawLogItem item={item} navigation={navigation} />;
                                }}
                                onEndReachedThreshold={0.1}
                                onEndReached={() => {
                                    if (!this.state.fetching && hasMorePages) {
                                        this.setState({ fetching: true });
                                        fetchMore({
                                            variables: {
                                                page: ++currentPage,
                                            },
                                            updateQuery: (prev, { fetchMoreResult: more }) => {
                                                this.setState({ fetching: false });
                                                return {
                                                    withdraws: {
                                                        ...more.withdraws,
                                                        data: [...prev.withdraws.data, ...more.withdraws.data],
                                                    },
                                                };
                                            },
                                        });
                                    }
                                }}
                                ListFooterComponent={() => <Footer finished={!hasMorePages} />}
                            />
                        );
                    }}
                </Query>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        alignItems: 'center',
        borderBottomColor: Theme.lightBorder,
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
});

export default WithdrawLog;
