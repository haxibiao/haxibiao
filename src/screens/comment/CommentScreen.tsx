import React, { useContext, useState, useCallback, useEffect, useMemo, useRef, useImperativeHandle } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { PageContainer, Placeholder, StatusView, ItemSeparator, ListFooter, SubmitLoading } from '~components';

import { GQL, useQuery, useLazyQuery, useApolloClient } from '~apollo';
import StoreContext, { observer, userStore } from '~store';
import { middlewareNavigate, useNavigationParam } from '~router';
import { exceptionCapture } from '~utils';

import CommentItem from './CommentItem';
import CommentInput from './CommentInput';

export default observer((props) => {
	const client = useApolloClient();
	const store = useContext(StoreContext);
	const commentId = useNavigationParam('comment', {}).id;
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
					renderItem={({ item, index }) => {
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
						<StatusView.EmptyView imageSource={require('~assets/images/default_comment.png')} />
					)}
					ListHeaderComponent={() => (
						<CommentItem
							disableLongPress={true}
							comment={comment}
							replyHandler={replyHandler}
							showReplyComment={false}
							separatorHeight={PxDp(10)}
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
		paddingBottom: PxDp(Theme.HOME_INDICATOR_HEIGHT),
	},
	contentContainerStyle: {
		flexGrow: 1,
		paddingBottom: Theme.HOME_INDICATOR_HEIGHT + PxDp(Theme.itemSpace),
	},
});
