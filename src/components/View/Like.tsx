import React, { Component, useContext, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Image, Text } from 'react-native';
import { useBounceAnimation } from '~/utils';
import { GQL, useMutation } from '~/apollo';
import { observer } from '~/store';
import { useNavigation } from '@react-navigation/native';
import Iconfont from '../Iconfont';
import SafeText from '../Basic/SafeText';

const imageSource = {
    liked: require('!/assets/images/ic_liked.png'),
    unlike: require('!/assets/images/ic_like.png'),
};

interface ThumbUpTarget {
    id: number | string;
    liked: boolean;
    count_likes: number | string;
    [key: string]: any;
}

interface Props {
    [key: string]: any;
    isAd?: boolean;
    shadowText?: boolean;
}

const Like = observer((props: Props) => {
    const { post, containerStyle, imageStyle, textStyle, shadowText, iconSize, type } = props;
    const navigation = useNavigation();
    const firstMount = useRef(true);
    const [animation, startAnimation] = useBounceAnimation({ value: 1, toValue: 1.2 });
    const [likeArticle] = useMutation(GQL.toggleLikeMutation, {
        variables: {
            id: post.id,
            type: 'posts',
        },
    });

    const likeHandler = __.debounce(async function () {
        const [error, result] = await Helper.exceptionCapture(likeArticle);
        if (error) {
            console.log('like error', error);

            // post.liked ? post.count_likes-- : post.count_likes++;
            // post.liked = !post.liked;
            if (!props.isAd) {
                Toast.show({ content: '操作失败' });
            }
        }
    }, 500);

    function toggleLike(): void {
        if (TOKEN) {
            post.liked ? post.count_likes-- : post.count_likes++;
            post.liked = !post.liked;
        } else {
            navigation.navigate('Login');
        }
    }

    useEffect(() => {
        if (!firstMount.current) {
            startAnimation();
            likeHandler();
        }
        firstMount.current = false;
    }, [post.liked]);

    const scale = animation.interpolate({
        inputRange: [1, 1.1, 1.2],
        outputRange: [1, 1.25, 1],
    });
    if (type === 'icon') {
        return (
            <Animated.View style={{ transform: [{ scale }] }}>
                <TouchableOpacity onPress={toggleLike} style={containerStyle}>
                    <Iconfont size={iconSize} name="xihuanfill" color={post.liked ? Theme.watermelon : '#CCD5E0'} />
                    <SafeText style={textStyle} shadowText={shadowText}>
                        {post.count_likes || 0}
                    </SafeText>
                </TouchableOpacity>
            </Animated.View>
        );
    }
    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity onPress={toggleLike} style={containerStyle}>
                <Image source={post.liked ? imageSource.liked : imageSource.unlike} style={imageStyle} />
                <SafeText style={textStyle} shadowText={shadowText}>
                    {post.count_likes}
                </SafeText>
            </TouchableOpacity>
        </Animated.View>
    );
});

Like.defaultProps = {
    containerStyle: { flexDirection: 'column' },
    imageStyle: { height: pixel(40), width: pixel(40) },
    textStyle: { color: 'rgba(255,255,255,0.8)', fontSize: font(12), marginTop: pixel(10), textAlign: 'center' },
};

export default Like;

const styles = StyleSheet.create({
    countLikes: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: font(12),
        marginTop: pixel(10),
        textAlign: 'center',
    },
    imageStyle: {
        height: pixel(40),
        width: pixel(40),
    },
    iconSize: pixel(40),
});
