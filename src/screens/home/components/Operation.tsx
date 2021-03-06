import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import useReport from '~/components/View/useReport';
import { TouchFeedback } from '~/components';

import { GQL } from '~/apollo';
import { download } from '~/utils';
import { appStore } from '~/store';

const MoreOperation = (props: any) => {
    const { options, target, type, downloadUrl, downloadUrlTitle, onPressIn, deleteCallback, navigation } = props;
    const client = appStore.client;
    const report = useReport({ target, type });
    let deleteArticleMutation = {};
    // const [deleteArticleMutation] = useMutation(GQL.deleteArticle, {
    //     variables: {
    //         id: target.id,
    //     },
    //     onCompleted: (data) => {
    //         deleteCallback();
    //         Toast.show({
    //             content: '删除成功',
    //         });
    //     },
    //     onError: (error) => {
    //         Toast.show({
    //             content: error.message.replace('GraphQL error: ', '') || '删除失败',
    //         });
    //     },
    // });

    const deleteArticle = useCallback(() => {
        onPressIn();
        deleteArticleMutation();
    }, [deleteArticleMutation]);

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
                    //查询接口，服务器返回错误后
                    Toast.show({ content: error.message });
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
        }),
        [reportArticle, deleteArticle, dislike],
    );

    const optionsView = useMemo(() => {
        return options.map((option) => {
            return (
                <TouchFeedback style={styles.optionItem} key={option} onPress={operation[option].callback}>
                    <Image style={styles.optionIcon} source={operation[option].image} />
                    <Text style={styles.optionName}>{option}</Text>
                </TouchFeedback>
            );
        });
    }, [options]);

    return (
        <TouchableWithoutFeedback onPress={onPressIn}>
            <View style={styles.optionsContainer}>
                <Text style={styles.title}>请选择你要进行的操作</Text>
                <View style={styles.body}>{optionsView}</View>
            </View>
        </TouchableWithoutFeedback>
    );
};

MoreOperation.defaultProps = {
    options: ['不感兴趣', '举报'],
    type: 'articles',
};

const styles = StyleSheet.create({
    body: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: pixel(30),
    },
    optionIcon: {
        height: pixel(50),
        width: pixel(50),
    },
    optionItem: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: pixel(25),
    },
    optionName: {
        color: '#fff',
        fontSize: pixel(13),
        marginTop: pixel(10),
    },
    optionsContainer: {
        height: Device.HEIGHT,
        justifyContent: 'flex-end',
        paddingBottom: Device.HEIGHT / 2,
        width: Device.WIDTH,
    },
    title: {
        color: '#fff',
        fontSize: pixel(20),
        textAlign: 'center',
    },
});

export default MoreOperation;
