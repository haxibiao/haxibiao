import React, { useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { PageContainer, Placeholder, StatusView, PostItem, Footer, ItemSeparator } from '~/components';

import { GQL, useQuery, useLazyQuery } from '~/apollo';
import StoreContext, { observer, userStore } from '~/store';

import FeedbackItem from './FeedbackItem';

export default observer((props) => {
    // const store = useContext(StoreContext);
    const { loading, error, data, fetchMore, refetch } = useQuery(GQL.MyFeedbackQuery, {
        variables: { id: userStore.me.id },
    });

    let feedback = useMemo(() => Helper.syncGetter('feedback.data', data), [data]);
    const currentPage = useMemo(() => Helper.syncGetter('feedback.paginatorInfo.currentPage', data), [data]);
    const hasMorePages = useMemo(() => Helper.syncGetter('feedback.paginatorInfo.hasMorePages', data), [data]);
    const fetchMoreFeedback = useCallback(() => {
        if (hasMorePages) {
            fetchMore({
                variables: {
                    page: currentPage + 1,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return Object.assign({}, prev, {
                        feedback: Object.assign({}, fetchMoreResult.feedback, {
                            data: [...prev.feedback.data, ...fetchMoreResult.feedback.data],
                        }),
                    });
                },
            });
        }
    }, [hasMorePages, currentPage]);

    return (
        <PageContainer autoKeyboardInsets={false} hiddenNavBar={true}>
            <View style={styles.container}>
                <FlatList
                    data={feedback}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                    renderItem={({ item, index }) => <FeedbackItem feedback={item} navigation={props.navigation} />}
                    ItemSeparatorComponent={() => <ItemSeparator style={{ height: PxDp(10) }} />}
                    refreshing={loading}
                    onRefresh={refetch}
                    onEndReachedThreshold={0.01}
                    onEndReached={fetchMoreFeedback}
                    ListEmptyComponent={() => <StatusView.EmptyView />}
                    ListFooterComponent={() => <Footer finished={!hasMorePages} />}
                />
            </View>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: PxDp(Theme.BOTTOM_HEIGHT),
    },
    ad: {
        minHeight: PxDp(200),
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: PxDp(5),
    },
});
