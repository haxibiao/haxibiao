import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import { GQL, useMutation,useClientBuilder } from '@src/apollo';
import { download } from '@src/common';
import { TouchFeedback } from '@src/components';
import { userStore } from '@src/store';
import useReport from '@src/components/View/useReport';

const MoreOperation = props => {
    const { options, target, type, downloadUrl, downloadUrlTitle, onPressIn, deleteCallback,navigation } = props;
    const client = useClientBuilder(Helper.syncGetter('me.token', userStore));
    const report = useReport({ target, type });
    const [deleteArticleMutation] = useMutation(GQL.deleteArticle, {
        variables: {
            id: target.id,
        },
        onCompleted: data => {
            deleteCallback();
            Toast.show({
                content: '删除成功',
            });
        },
        onError: error => {
            Toast.show({
                content: error.message.replace('GraphQL error: ', '') || '删除失败',
            });
        },
    });

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
            client.mutate({
                mutation: GQL.addArticleBlockMutation,
                variables: {
                    id: target.id,
                },
            }).then(result => {
                Toast.show({ content: '操作成功，将减少此类型内容的推荐！' });
            }).catch(error => {
                //查询接口，服务器返回错误后
                Toast.show({ content: error.message });
            })
        } else {
            navigation.navigate('Login');
        }
    }, [target]);

    const operation = useMemo(
        () => ({
            下载: {
                image: require('@app/assets/images/more_video_download.png'),
                callback: downloadVideo,
            },
            举报: {
                image: require('@app/assets/images/more_report.png'),
                callback: reportArticle,
            },
            删除: {
                image: require('@app/assets/images/more_delete.png'),
                callback: deleteArticle,
            },
            不感兴趣: {
                image: require('@app/assets/images/more_dislike.png'),
                callback: dislike,
            },
        }),
        [reportArticle, deleteArticle, dislike],
    );

    const optionsView = useMemo(() => {
        return options.map(option => {
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
        paddingVertical: PxDp(30),
    },
    optionIcon: {
        height: PxDp(50),
        width: PxDp(50),
    },
    optionItem: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: PxDp(25),
    },
    optionName: {
        color: '#fff',
        fontSize: PxDp(13),
        marginTop: PxDp(10),
    },
    optionsContainer: {
        height: Device.HEIGHT,
        justifyContent: 'flex-end',
        paddingBottom: Device.HEIGHT / 2,
        width: Device.WIDTH,
    },
    title: {
        color: '#fff',
        fontSize: PxDp(20),
        textAlign: 'center',
    },
});

export default MoreOperation;
