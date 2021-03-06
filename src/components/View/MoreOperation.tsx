import React, { useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Image, Clipboard, ScrollView, Linking } from 'react-native';
import { GQL, useMutation, useClientBuilder } from '~/apollo';
import { download, exceptionCapture, syncGetter } from '~/utils';
import { userStore } from '~/store';
import { Share } from 'react-native-ad';
import * as WeChat from 'react-native-wechat-lib';
import useReport from './useReport';
import TouchFeedback from '../Basic/TouchFeedback';

const MoreOperation = (props) => {
    const shareLink = useRef();
    const client = useClientBuilder(syncGetter('me.token', userStore));
    const {
        options,
        target,
        type,
        downloadUrl,
        downloadUrlTitle,
        onPressIn,
        deleteCallback,
        navigation,
        showShare,
        shares,
    } = props;
    const report = useReport({ target, type });
    console.log('ahjdghashjdhagjdahsdj', target);

    const [deleteArticleMutation] = useMutation(GQL.deleteArticle, {
        variables: {
            id: target.id,
        },
        onCompleted: (data) => {
            deleteCallback();
            Toast.show({
                content: '删除成功',
            });
        },
        onError: (error) => {
            Toast.show({
                content: error.message.replace('GraphQL error: ', '') || '删除失败',
            });
        },
    });

    const deleteArticle = useCallback(() => {
        onPressIn();
        deleteArticleMutation();
    }, [deleteArticleMutation]);

    const fetchShareLink = useCallback(async () => {
        if (shareLink.current) {
            return shareLink.current;
        }
        const [error, result] = await exceptionCapture(() =>
            client.query({
                query: GQL.shareQuery,
                variables: {
                    id: target.id,
                },
            }),
        );
        if (error) {
            Toast.show({ content: error.message });
            return null;
        } else if (syncGetter('data.sharePost', result)) {
            shareLink.current = syncGetter('data.sharePost', result);
            return shareLink.current;
        }
    }, []);

    const copyLink = useCallback(async () => {
        onPressIn();
        const link = await fetchShareLink();
        Clipboard.setString(link);
        Toast.show({ content: '复制成功，快去分享给好友吧！' });
    }, []);

    const reportArticle = useCallback(() => {
        onPressIn();
        report();
    }, [report]);

    const downloadVideo = useCallback(() => {
        onPressIn();
        download({ url: downloadUrl, title: downloadUrlTitle });
    }, [downloadUrl]);

    const dislike = useCallback(() => {
        onPressIn();
        if (TOKEN) {
            client
                .mutate({
                    mutation: GQL.addArticleBlockMutation,
                    variables: {
                        id: target.id,
                    },
                })
                .then((result) => {
                    Toast.show({ content: '操作成功，将减少此类型内容的推荐！' });
                })
                .catch((error) => {
                    // 查询接口，服务器返回错误后
                    Toast.show({ content: error.message.replace('GraphQL error: ', '') });
                });
        } else {
            navigation.navigate('Login');
        }
    }, [target]);

    const shield = useCallback(() => {
        onPressIn();
        if (TOKEN) {
            client
                .mutate({
                    mutation: GQL.addUserBlockMutation,
                    variables: {
                        id: target.id,
                    },
                    refetchQueries: () => [
                        {
                            query: GQL.postsSquareQuery,
                            variables: { page: 0 },
                        },
                        {
                            query: GQL.RecommendVideosQuery,
                            variables: { page: 0, count: 5 },
                        },
                    ],
                })
                .then((result: any) => {
                    navigation.goBack();
                    Toast.show({ content: '拉黑成功，下拉刷新将减少此用户内容的推荐！' });
                })
                .catch((error: any) => {
                    //查询接口，服务器返回错误后
                    Toast.show({ content: error.message });
                });
        } else {
            navigation.navigate('Login');
        }
    }, []);

    const favorite = useCallback(() => {
        onPressIn();
        if (TOKEN) {
            target.favorited = !target.favorited;
            client
                .mutate({
                    mutation: GQL.toggleFavoritedMutation,
                    variables: {
                        id: target.id,
                    },
                })
                .then((result: any) => {
                    Toast.show({ content: '收藏成功！' });
                })
                .catch((error: any) => {
                    target.favorited = !target.favorited;
                    // 查询接口，服务器返回错误后
                    Toast.show({ content: error.message.replace('GraphQL error: ', '') });
                });
        } else {
            navigation.navigate('Login');
        }
    }, [target]);

    const onFavorite = useCallback(() => {
        onPressIn();
        if (TOKEN) {
            target.favorited = !target.favorited;
            client
                .mutate({
                    mutation: GQL.toggleFavoritedMutation,
                    variables: {
                        id: target.id,
                    },
                    refetchQueries: () => [
                        {
                            query: GQL.postsSquareQuery,
                            variables: { user_id: userStore.me.id },
                        },
                    ],
                })
                .then((result: any) => {
                    Toast.show({ content: '取消收藏成功！' });
                })
                .catch((error: any) => {
                    target.favorited = !target.favorited;
                    // 查询接口，服务器返回错误后
                    Toast.show({ content: error.message.replace('GraphQL error: ', '') });
                });
        } else {
            navigation.navigate('Login');
        }
    }, [target]);

    const operation = useMemo(
        () => ({
            下载: {
                image: require('!/assets/images/more_video_download.png'),
                callback: downloadVideo,
            },
            复制链接: {
                image: require('!/assets/images/more_links.png'),
                callback: copyLink,
            },
            举报: {
                image: require('!/assets/images/more_report.png'),
                callback: reportArticle,
            },
            删除: {
                image: require('!/assets/images/more_delete.png'),
                callback: deleteArticle,
            },
            不感兴趣: {
                image: require('!/assets/images/more_dislike.png'),
                callback: dislike,
            },
            拉黑: {
                image: require('!/assets/images/more_shield.png'),
                callback: shield,
            },
            收藏: {
                image: require('!/assets/images/more_favorite.png'),
                callback: favorite,
            },
            取消收藏: {
                image: require('!/assets/images/more_favorite.png'),
                callback: onFavorite,
            },
        }),
        [reportArticle, deleteArticle, dislike, downloadVideo, copyLink, shield],
    );

    const optionsView = useMemo(() => {
        return options.map((option, index) => {
            if (option === '下载' && !downloadUrl) {
                return;
            }
            return (
                <TouchFeedback
                    style={[styles.optionItem, options.length < 5 && { width: Device.WIDTH / 4 }]}
                    key={index}
                    onPress={operation[option].callback}>
                    <Image style={styles.optionIcon} source={operation[option].image} />
                    <Text style={styles.optionName}>{option}</Text>
                </TouchFeedback>
            );
        });
    }, [options]);

    const shareToWechat = useCallback(async () => {
        onPressIn();
        const link = await fetchShareLink();
        try {
            await WeChat.shareVideo({
                scene: 0,
                title: target.body || '我发现一个很好看的小视频，分享给你',
                videoUrl: Config.ServerRoot + '/s/p/' + target.id + '?user_id=' + userStore.me.id,
            });
        } catch (e) {
            Toast.show({ content: '未安装微信或当前微信版本较低' });
        }
    }, []);

    const shareToTimeline = useCallback(async () => {
        onPressIn();
        const link = await fetchShareLink();
        try {
            await WeChat.shareWebpage({
                scene: 1,
                webpageUrl: link ?? '',
            });
        } catch (e) {
            Toast.show({ content: '未安装微信或当前微信版本较低' });
        }
    }, []);

    const shareToQQ = useCallback(async () => {
        onPressIn();
        // const baseurl = new Buffer(Config.ServerRoot + "/share/post/"+ target.id).toString('base64');
        // const baseimage = new Buffer(Config.ServerRoot + "/logo/ " + Config.Name + " .com.small.png").toString('base64');
        // const basetitle = new Buffer("这个视频好好看分享给你").toString('base64');
        // const basedesc = new Buffer(target.body).toString('base64');
        // const openUrl = "mqqapi://share/to_fri?file_type=news&src_type=web&version=1&generalpastboard=1&share_id=1107845270&url="+ baseurl +"&previewimageUrl=" + baseimage + "&image_url=" + baseimage + "&title=" + basetitle + "&description=" + basedesc + "&callback_type=scheme&thirdAppDisplayName=UVE=&app_name=UVE=&cflag=0&shareType=0";
        // Linking.openURL(openUrl);
        const link = await fetchShareLink();
        const callback = await Share.shareTextToQQ(link);

        if (!callback) {
            Toast.show({
                content: '请先安装QQ客户端',
            });
        }
    }, []);

    const shareToWeiBo = useCallback(async () => {
        onPressIn();
        const link = await fetchShareLink();
        Clipboard.setString(link);
        const callback = await Share.shareToSinaFriends(link);

        if (!callback) {
            Toast.show({
                content: '请先安装微博客户端',
            });
        }
    }, []);

    const shareToQQZone = useCallback(async () => {
        onPressIn();
        const link = await fetchShareLink();
        Clipboard.setString(link);
        const callback = await Share.shareImageToQQZone(link);

        if (!callback) {
            Toast.show({
                content: '请先安装QQ空间客户端',
            });
        }
    }, []);

    const share = useMemo(
        () => ({
            微信: {
                image: require('!/assets/images/share_wx.png'),
                callback: shareToWechat,
            },
            QQ好友: {
                image: require('!/assets/images/share_qq.png'),
                callback: shareToQQ,
            },
            微博: {
                image: require('!/assets/images/share_wb.png'),
                callback: shareToWeiBo,
            },
            朋友圈: {
                image: require('!/assets/images/share_pyq.png'),
                callback: shareToTimeline,
            },
            QQ空间: {
                image: require('!/assets/images/share_qqz.png'),
                callback: shareToQQZone,
            },
        }),
        [],
    );

    const shareView = useMemo(() => {
        return shares.map((option: any, index: any) => {
            return (
                <TouchFeedback
                    style={[styles.optionItem, shares.length < 5 && { width: Device.WIDTH / 4 }]}
                    key={index}
                    onPress={share[option].callback}>
                    <Image style={styles.optionIcon} source={share[option].image} />
                    <Text style={styles.optionName}>{option}</Text>
                </TouchFeedback>
            );
        });
    }, [shares]);

    return (
        <View style={styles.optionsContainer}>
            {false && (
                <>
                    <View style={[styles.body, { marginTop: pixel(10) }]}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {shareView}
                        </ScrollView>
                    </View>
                    <View style={styles.dividingLine} />
                </>
            )}
            <View style={styles.body}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {optionsView}
                </ScrollView>
            </View>
            <TouchFeedback style={styles.footer} onPress={onPressIn}>
                <Text style={styles.footerText}>取消</Text>
            </TouchFeedback>
        </View>
    );
};

MoreOperation.defaultProps = {
    options: ['不感兴趣', '举报', '拉黑'],
    type: 'articles',
    shares: ['微信', 'QQ好友', '微博', '朋友圈', 'QQ空间'],
    showShare: false,
};

const styles = StyleSheet.create({
    optionsContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: pixel(12),
        borderTopRightRadius: pixel(12),
        paddingBottom: pixel(Theme.HOME_INDICATOR_HEIGHT),
        overflow: 'hidden',
    },
    body: {
        paddingVertical: pixel(5),
        flexDirection: 'row',
        alignItems: 'center',
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: pixel(Theme.itemSpace),
        borderTopWidth: pixel(1),
        borderColor: Theme.borderColor,
    },
    footerText: {
        color: Theme.defaultTextColor,
        fontSize: pixel(15),
    },
    optionItem: {
        maxWidth: Device.WIDTH * 0.25,
        minWidth: Device.WIDTH * 0.22,
        padding: pixel(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionIcon: {
        width: pixel(50),
        height: pixel(50),
    },
    optionName: {
        marginTop: pixel(10),
        color: Theme.subTextColor,
        fontSize: pixel(13),
    },
    dividingLine: {
        borderBottomWidth: pixel(0.2),
        borderColor: Theme.borderColor,
        marginHorizontal: pixel(25),
    },
});

export default MoreOperation;
