import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { PageContainer, StatusView, Footer, ItemSeparator } from '~/components';

import { GQL, useQuery } from '~/apollo';
import { observer, userStore } from '~/store';

import FeedbackItem from './FeedbackItem';

export default observer((props: { navigation: any }) => {
    const { loading, data, fetchMore, refetch } = useQuery(GQL.MyFeedbackQuery, {
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
                    renderItem={({ item }) => <FeedbackItem feedback={item} navigation={props.navigation} />}
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
