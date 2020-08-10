import React, { useState, useRef, useCallback, useImperativeHandle } from 'react';
import { StyleSheet, View, Text, Keyboard } from 'react-native';
import { HxfTextInput, HxfButton } from '~/components/Form';
import Iconfont from '~/components/Iconfont';
import { useKeyboardListener } from '~/utils';
import { GQL, useMutation } from '~/apollo';
import { userStore } from '~/store';
import { useNavigation } from '~/router';

const CommentInput = React.forwardRef((props, ref) => {
    const {
        commentAbleType,
        commentAbleId,
        replyByComment,
        setReplyByComment,
        updateScrollOffset,
        increaseCountComments,
        queryType,
    } = props;
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const [body, setBody] = useState('');
    const bodyRef = useRef();
    const showListener = useRef();
    const hideListener = useRef();
    const inputRef = useRef();

    const onChangeText = useCallback((value) => {
        setBody(value);
        bodyRef.current = value;
    }, []);

    useImperativeHandle(
        ref,
        () => ({
            focus: () => {
                inputRef.current.focus();
            },
            blur: () => {
                inputRef.current.blur();
            },
        }),
        [inputRef],
    );

    const updateCommentsQuery = useCallback(
        (cache, { data: { addComment } }) => {
            onChangeText('');
            const prev = cache.readQuery({
                query: GQL.commentsQuery,
                variables: {
                    commentable_type: commentAbleType,
                    commentable_id: commentAbleId,
                    replyCount: 3,
                },
            });
            if (props.replyByComment) {
                let findIndex;
                const commentItem = __.find(prev.comments.data, function (comment, index) {
                    findIndex = index;
                    return comment.id === props.replyByComment.id;
                });
                commentItem.comments = Object.assign({}, commentItem.comments, {
                    data: [addComment, ...commentItem.comments.data],
                });
                prev.comments.data[findIndex] = commentItem;
                cache.writeQuery({
                    query: GQL.commentsQuery,
                    variables: {
                        commentable_type: commentAbleType,
                        commentable_id: commentAbleId,
                        replyCount: 3,
                    },
                    data: {
                        comments: Object.assign({}, prev.comments, {
                            data: [...prev.comments.data],
                        }),
                    },
                });
            } else {
                updateScrollOffset();
                cache.writeQuery({
                    query: GQL.commentsQuery,
                    variables: {
                        commentable_type: commentAbleType,
                        commentable_id: commentAbleId,
                        replyCount: 3,
                    },
                    data: {
                        comments: Object.assign({}, prev.comments, {
                            data: [addComment, ...prev.comments.data],
                        }),
                    },
                });
            }
        },
        [props],
    );
    const updateRepliesQuery = useCallback((cache, { data: { addComment } }) => {
        Toast.show({ content: '回复成功' });
        onChangeText('');
        updateScrollOffset();
        const prev = cache.readQuery({
            query: GQL.commentRepliesQuery,
            variables: {
                id: replyByComment.id,
            },
        });
        cache.writeQuery({
            query: GQL.commentRepliesQuery,
            variables: {
                id: replyByComment.id,
            },
            data: {
                comment: Object.assign({}, prev.comment, {
                    comments: Object.assign({}, prev.comment.comments, {
                        data: [addComment, ...prev.comment.comments.data],
                    }),
                }),
            },
        });
    }, []);

    const [addCommentMutation, { data: signInData }] = useMutation(GQL.addCommentMutation, {
        variables: {
            commentable_id: replyByComment ? replyByComment.id : commentAbleId,
            commentable_type: replyByComment ? 'comments' : commentAbleType,
            body: body && body.trim(),
        },
        update: queryType === 'comment' ? updateRepliesQuery : updateCommentsQuery,
        optimisticResponse: {
            __typename: 'Mutation',
            addComment: {
                __typename: 'Comment',
                id: -1,
                is_accept: false,
                commentable_id: commentAbleId,
                body,
                liked: null,
                likes: 0,
                count_replies: 0,
                time_ago: '1 秒 前',
                user: userStore.me,
                comments: [],
            },
        },
        onError: (error) => {
            const content = error.message.replace('GraphQL error: ', '') || '评论失败';
            Toast.show({ content });
        },
        onCompleted: (data) => {
            increaseCountComments();
        },
    });

    const addCommentHandler = useCallback(() => {
        Keyboard.dismiss();
        if (TOKEN) {
            Toast.show({ content: '回复成功' });
            addCommentMutation();
        } else {
            navigation.navigate('Login');
        }
    }, [addCommentMutation]);

    const onKeyboardShow = useCallback(() => {
        setVisible(true);
    }, [props]);

    const onKeyboardHide = useCallback(() => {
        setVisible(false);
        if (!(bodyRef.current && bodyRef.current.length > 0)) {
            setReplyByComment(null);
        }
    }, []);

    useKeyboardListener(onKeyboardShow, onKeyboardHide);

    return (
        <View style={styles.inputContainer}>
            <View style={styles.textInputWrap}>
                <Iconfont name="xie" size={Font(16)} color={Theme.subTextColor} />
                <HxfTextInput
                    placeholder={replyByComment ? `回复 ${replyByComment.user.name}:` : '写评论...'}
                    style={styles.textInput}
                    value={body}
                    onChangeText={onChangeText}
                    ref={inputRef}
                />
            </View>
            {visible && (
                <View style={styles.buttonWrap}>
                    <HxfButton
                        title="发送"
                        gradient={true}
                        disabled={body.length < 1}
                        style={styles.sendButton}
                        onPress={addCommentHandler}
                    />
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    buttonWrap: {
        marginLeft: PxDp(15),
    },
    inputContainer: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flexDirection: 'row',
        paddingHorizontal: PxDp(15),
        paddingVertical: PxDp(12),
    },
    sendButton: {
        alignItems: 'center',
        borderRadius: PxDp(18),
        height: PxDp(36),
        justifyContent: 'center',
        width: PxDp(76),
    },
    textInput: {
        flex: 1,
        marginLeft: PxDp(6),
    },
    textInputWrap: {
        backgroundColor: '#f4f4f4',
        borderRadius: PxDp(18),
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: PxDp(36),
        paddingHorizontal: PxDp(12),
        paddingVertical: PxDp(6),
    },
});

export default CommentInput;