import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Colors } from '~/utils';
import { ContentEnd, Screen, LoadingError, SpinnerLoading, BlankContent } from '~/components';
import NotificationItem from './NotificationItem';

import { Query, GQL } from '~/apollo';
import store from '~/store';

class PendingScreen extends Component {
    render() {
        let { pendingRequests, navigation } = this.props;
        return (
            <Screen>
                <View style={styles.container}>
                    <Query query={GQL.pendingArticlesQuery}>
                        {({ loading, error, data, refetch, fetchMore }) => {
                            if (error) return <LoadingError reload={() => refetch()} />;
                            if (loading) return <SpinnerLoading />;

                            let items = data.pendingArticles;
                            return !items.length ? (
                                <BlankContent />
                            ) : (
                                <FlatList
                                    data={items}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <NotificationItem article={item} navigation={navigation} />
                                    )}
                                    ListFooterComponent={() => <ContentEnd />}
                                />
                            );
                        }}
                    </Query>
                </View>
            </Screen>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.skinColor,
    },
});

export default PendingScreen;
