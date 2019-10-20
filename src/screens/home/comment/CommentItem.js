/*
 * @flow
 * created by wyk made in 2019-03-29 16:41:46
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { TouchFeedback, Iconfont, SafeText, Avatar } from '@src/components';
import { compose, graphql, GQL } from '@src/apollo';
import { withNavigation } from 'react-navigation';

type replyComment = { id: string, body: any, user: Object, likes: boolean, liked: boolean };
type Props = {
    comment: replyComment,
};

class CommentItem extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            liked: props.comment.liked,
            likes: props.comment.likes,
            bounce: new Animated.Value(1),
        };
    }

    likeComment = () => {
        this.setState(
            prevState => ({
                liked: !prevState.liked,
                likes: prevState.liked ? --prevState.likes : ++prevState.likes,
            }),
            () => this.bounceAnimation(this.state.liked),
        );
    };

    bounceAnimation = isLiked => {
        this.props.comment.liked = isLiked;
        this.props.comment.likes = this.state.likes;
        try {
            this.props.toggleLikeMutation({
                variables: {
                    liked_id: this.props.comment.id,
                    liked_type: 'COMMENT',
                },
            });
        } catch (error) {
            console.log('toggleLikeMutation error', error);
        }
        if (isLiked) {
            let { bounce } = this.state;
            bounce.setValue(1);
            Animated.spring(bounce, {
                toValue: 1.2,
                friction: 2,
                tension: 40,
            }).start();
        }
    };

    render() {
        const { comment, navigation } = this.props;
        const { liked, likes, bounce } = this.state;
        const scale = bounce.interpolate({
            inputRange: [1, 1.1, 1.2],
            outputRange: [1, 1.25, 1],
        });
        return (
            <View style={styles.comment}>
                <TouchFeedback onPress={() => navigation.navigate('User', { user: comment.user })}>
                    <Avatar source={comment.user.avatar} size={PxDp(34)} />
                </TouchFeedback>
                <View style={{ flex: 1, marginLeft: PxDp(10) }}>
                    <View style={styles.profile}>
                        <SafeText style={styles.name}>{comment.user.name}</SafeText>
                        <View style={{ alignItems: 'center' }}>
                            <Animated.View style={{ transform: [{ scale: scale }] }}>
                                <TouchFeedback style={styles.touchItem} onPress={__.throttle(this.likeComment, 400)}>
                                    <Iconfont
                                        name={liked ? 'like' : 'like-outline'}
                                        size={PxDp(20)}
                                        color={liked ? Theme.red : Theme.subTextColor}
                                    />
                                </TouchFeedback>
                            </Animated.View>
                            {likes > 0 && (
                                <SafeText
                                    style={[styles.countLikes, { color: liked ? Theme.red : Theme.subTextColor }]}>
                                    {likes}
                                </SafeText>
                            )}
                        </View>
                    </View>
                    <View>
                        {comment.body && (
                            <Text style={styles.bodyText}>
                                {comment.body}
                                <SafeText style={styles.timeAgo}>{`   ${comment.time_ago}`}</SafeText>
                            </Text>
                        )}
                    </View>
                    <View />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    comment: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: PxDp(Theme.itemSpace),
    },
    profile: {
        flex: 1,
        height: PxDp(30),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    touchItem: {
        width: PxDp(36),
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: PxDp(14),
        fontWeight: '200',
        paddingRight: PxDp(4),
        color: Theme.secondaryTextColor,
    },
    timeAgo: {
        fontSize: PxDp(12),
        fontWeight: '200',
        color: Theme.grey,
        marginLeft: 5,
    },
    countLikes: {
        fontSize: PxDp(12),
        fontWeight: '200',
        color: Theme.primaryColor,
    },
    bodyText: {
        fontSize: PxDp(14),
        lineHeight: PxDp(20),
        fontWeight: '400',
        color: Theme.defaultTextColor,
    },
    linkText: {
        lineHeight: PxDp(22),
        color: Theme.linkColor,
    },
});

export default compose(
    withNavigation,
    graphql(GQL.toggleLikeMutation, { name: 'toggleLikeMutation' }),
)(CommentItem);
