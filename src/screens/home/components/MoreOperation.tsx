import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { TouchFeedback } from '@src/components';
import { download } from '@src/common';
import useReport from './useReport';

const MoreOperation = props => {
    const { options, target, downloadUrl, onPressIn } = props;
    const report = useReport({ target, type: 'article' });
    const reportArticle = useCallback(() => {
        onPressIn();
        report();
    }, []);
    const downloadVideo = useCallback(() => {
        onPressIn();
        download({ url: downloadUrl });
    }, [downloadUrl]);

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
            不感兴趣: {
                image: require('@src/assets/images/more_dislike.png'),
                callback: onPressIn,
            },
        }),
        [],
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
    options: ['下载', '不感兴趣', '举报'],
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
