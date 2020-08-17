import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Image, TouchableWithoutFeedback, Animated } from 'react-native';
import { useBounceAnimation, useLinearAnimation } from '~/utils';
import { observer, userStore } from '~/store';
import { GQL, useMutation } from '~/apollo';
import { middlewareNavigate } from '~/router';
import * as Progress from 'react-native-progress';
import VideoStore from '~/store/VideoStore';

const RewardProgress = observer(() => {
    const firstReward = useRef(true);
    const userId = userStore.me.id;
    const progress = (VideoStore.rewardProgress / VideoStore.rewardLimit) * 100;
    const rewardAble = progress >= 100;

    const [rewardGold, setReward] = useState();
    const [imageAnimation, startImageAnimation] = useBounceAnimation({ value: 0, toValue: 1 });
    const [textAnimation, startTextAnimation] = useLinearAnimation({ duration: 2000 });
    const [playReward] = useMutation(GQL.VideoPlayReward, {
        variables: {
            input: {
                video_ids: [...new Set(VideoStore.playedVideoIds)],
            },
        },
        refetchQueries: () => [
            {
                query: GQL.userProfileQuery,
                variables: { id: userId },
            },
        ],
    });

    useEffect(() => {
        async function fetchReward() {
            if (TOKEN) {
                VideoStore.rewardProgress = 0;
                startImageAnimation();
                const [error, res] = await Helper.exceptionCapture(playReward);
                VideoStore.playedVideoIds = [];
                if (error) {
                    setReward('领取失败');
                } else {
                    const gold = Helper.syncGetter('data.videoPlayReward.gold', res);
                    setReward(`+${gold}${Config.goldAlias}`);
                    startTextAnimation();
                }
            } else if (firstReward.current) {
                firstReward.current = false;
                Toast.show({ content: '登录领取奖励哦' });
            }
        }
        if (rewardAble) {
            fetchReward();
        }
    }, [rewardAble]);

    const imageScale = imageAnimation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.2, 1],
    });

    const textOpacity = textAnimation.interpolate({
        inputRange: [0, 0.1, 0.4, 0.7, 0.8, 1],
        outputRange: [0, 0.7, 0.8, 0.9, 1, 0],
    });

    const textTranslateY = textAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, -80],
    });

    const textScale = textAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1.5],
    });

    return (
        <TouchableWithoutFeedback onPress={(): void => middlewareNavigate('Wallet')}>
            <Animated.View style={[styles.circleProgress, { transform: [{ scale: imageScale }] }]}>
                <Animated.Text
                    style={[
                        styles.rewardText,
                        { opacity: textOpacity, transform: [{ translateY: textTranslateY }, { scale: textScale }] },
                    ]}>
                    {rewardGold}
                </Animated.Text>
                <Image source={require('!/assets/images/video_reward_progress.png')} style={styles.rewardImage} />
                {progress > 0 && (
                    <Progress.Circle
                        progress={progress / 100}
                        size={PxDp(54)}
                        borderWidth={0}
                        color="#ff5644"
                        thickness={PxDp(4)}
                        endAngle={1}
                        strokeCap="round"
                    />
                )}
            </Animated.View>
        </TouchableWithoutFeedback>
    );
});
const styles = StyleSheet.create({
    circleProgress: {
        height: PxDp(54),
        position: 'relative',
        width: PxDp(54),
    },
    rewardImage: {
        ...StyleSheet.absoluteFill,
        height: PxDp(54),
        width: PxDp(54),
    },
    rewardText: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: font(12),
        color: '#FFB100',
    },
});

export default RewardProgress;
