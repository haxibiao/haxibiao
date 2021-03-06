import React, { useState, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { PageContainer, StatusView, ListFooter } from '~/components';

import { GQL, useQuery } from '~/apollo';
import { observer } from '~/store';
import { useRoute } from '~/router';

import CommentItem from './CommentItem';
import CommentInput from '../../components/View/CommentInput';

export default observer(() => {
    const commentId = useRoute().params?.comment.id;
    const [replyByComment, setReplyByComment] = useState();
    const loadingMore = useRef(false);
    const flatListRef = useRef();
    const fancyInputRef = useRef();

    const updateScrollOffset = useCallback(() => {
        flatListRef.current.scrollToOffset({ y: 0, animated: true });
    }, [flatListRef]);

    const replyHandler = useCallback(
        (user) => {
            fancyInputRef.current.focus();
            setReplyByComment(user);
        },
        [fancyInputRef],
    );
    const { loading, error, data, refetch, fetchMore } = useQuery(GQL.commentRepliesQuery, {
        variables: { id: commentId },
        fetchPolicy: 'network-only',
    });
    const comment = useMemo(() => Helper.syncGetter('comment', data), [data]);
    const replyComments = useMemo(() => Helper.syncGetter('comment.comments.data', data), [data]);
    let currentPage = useMemo(() => Helper.syncGetter('comment.comments.paginatorInfo.currentPage', data), [data]);
    const hasMorePages = useMemo(() => Helper.syncGetter('comment.comments.paginatorInfo.hasMorePages', data), [data]);
    const fetchMoreComments = useCallback(() => {
        if (hasMorePages && !loadingMore.current) {
            loadingMore.current = true;
            fetchMore({
                variables: {
                    page: ++currentPage,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    loadingMore.current = false;
                    if (!fetchMoreResult) return prev;
                    return Object.assign({}, prev, {
                        comment: Object.assign({}, prev.comment, {
                            comments: Object.assign({}, prev.comment.comments, {
                                paginatorInfo: fetchMoreResult.comment.comments.paginatorInfo,
                                data: [...prev.comment.comments.data, ...fetchMoreResult.comment.comments.data],
                            }),
                        }),
                    });
                },
            });
        }
    }, [hasMorePages, currentPage]);

    const hiddenListFooter = replyComments && replyComments.length === 1;

    const increaseCountComments = useCallback(() => {
        comment.count_replies++;
    }, [comment]);

    const decreaseCountComments = useCallback(() => {
        comment.count_replies--;
        refetch();
    }, [comment]);

    return (
        <PageContainer title="评论详情" error={error} loading={!replyComments} safeView>
            <View style={styles.container}>
                <FlatList
                    ref={flatListRef}
                    data={replyComments}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                    renderItem={({ item }) => {
                        return (
                            <CommentItem
                                comment={item}
                                replyHandler={replyHandler}
                                showReplyComment={false}
                                decreaseCountComments={decreaseCountComments}
                            />
                        );
                    }}
                    refreshing={loading}
                    onRefresh={refetch}
                    onEndReachedThreshold={0.2}
                    onEndReached={fetchMoreComments}
                    ListEmptyComponent={() => (
                        <StatusView.EmptyView imageSource={require('!/assets/images/default_comment.png')} />
                    )}
                    ListHeaderComponent={() => (
                        <CommentItem
                            disableLongPress={true}
                            comment={comment}
                            replyHandler={replyHandler}
                            showReplyComment={false}
                            separatorHeight={pixel(10)}
                        />
                    )}
                    ListFooterComponent={() => <ListFooter hidden={hiddenListFooter} finished={!hasMorePages} />}
                />
            </View>
            <CommentInput
                increaseCountComments={increaseCountComments}
                updateScrollOffset={updateScrollOffset}
                replyByComment={replyByComment || comment}
                setReplyByComment={setReplyByComment}
                commentAbleId={comment && comment.commentable_id}
                ref={fancyInputRef}
                queryType="comment"
            />
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        paddingBottom: pixel(Theme.HOME_INDICATOR_HEIGHT),
    },
    contentContainerStyle: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT + pixel(Theme.itemSpace),
    },
});
