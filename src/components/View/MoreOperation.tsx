import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { GQL, useMutation } from '@src/apollo';
import { download } from '@src/common';
import useReport from './useReport';
import TouchFeedback from '../Basic/TouchFeedback';
import { useNavigation } from '@src/router';

const MoreOperation = props => {
    const { options, target, type, downloadUrl, downloadUrlTitle, onPressIn, deleteCallback, navigation } = props;
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
        Toast.show({ content: '操作成功，将减少此类型内容的推荐' });
    }, []);

    const shield = useCallback(() => {
        onPressIn();
        Toast.show({ content: '拉黑成功，将减少此用户内容的推荐' });
        navigation.goBack();
        
    }, []);

    const operation = useMemo(
        () => ({
            下载: {
                image: require('@src/assets/images/more_video_download.png'),
                callback: downloadVideo,
            },
            举报: {
                image: require('@src/assets/images/more_report.png'),
                callback: reportArticle,
            },
            删除: {
                image: require('@src/assets/images/more_delete.png'),
                callback: deleteArticle,
            },
            不感兴趣: {
                image: require('@src/assets/images/more_dislike.png'),
                callback: dislike,
            },
            拉黑: {
                image: require('@src/assets/images/more_shield.png'),
                callback: shield,
            },
        }),
        [reportArticle, deleteArticle, dislike],
    );

    const optionsView = useMemo(() => {
        return options.map((option, index) => {
            return (
                <TouchFeedback style={styles.optionItem} key={index} onPress={operation[option].callback}>
                    <Image style={styles.optionIcon} source={operation[option].image} />
                    <Text style={styles.optionName}>{option}</Text>
                </TouchFeedback>
            );
        });
    }, [options]);

    return (
        <View style={styles.optionsContainer}>
            <View style={styles.body}>{optionsView}</View>
            <TouchFeedback style={styles.footer} onPress={onPressIn}>
                <Text style={styles.footerText}>取消</Text>
            </TouchFeedback>
        </View>
    );
};

MoreOperation.defaultProps = {
    options: ['不感兴趣', '举报'],
    type: 'articles',
};

const styles = StyleSheet.create({
    optionsContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: PxDp(12),
        borderTopRightRadius: PxDp(12),
        paddingBottom: PxDp(Theme.HOME_INDICATOR_HEIGHT),
        overflow: 'hidden',
    },
    body: {
        paddingVertical: PxDp(Theme.itemSpace),
        flexDirection: 'row',
        alignItems: 'center',
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: PxDp(Theme.itemSpace),
        borderTopWidth: PxDp(1),
        borderColor: Theme.borderColor,
    },
    footerText: {
        color: Theme.defaultTextColor,
        fontSize: PxDp(15),
    },
    optionItem: {
        flex: 1,
        paddingVertical: PxDp(10),
        alignItems: 'center',
    },
    optionIcon: {
        width: PxDp(50),
        height: PxDp(50),
    },
    optionName: {
        marginTop: PxDp(10),
        color: Theme.subTextColor,
        fontSize: PxDp(13),
    },
});

export default MoreOperation;
