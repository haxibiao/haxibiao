import React, { useCallback, useState, useRef } from 'react';
import PullChooser from '../Popup/PullChooser';
import { useMutation, GQL } from '~/apollo';

const useReport = (props) => {
    const reason = useRef();

    let reportMutation = {};
    //FIXME: 用appStore.client.mutate ...
    // const [reportMutation] = useMutation(GQL.addReportMutation, {
    //     variables: {
    //         type: props.type,
    //         id: props.target.id,
    //         reason: reason.current,
    //     },
    //     onCompleted: (data) => {
    //         Toast.show({
    //             content: '举报成功，感谢您的反馈',
    //         });
    //     },
    //     onError: (error) => {
    //         Toast.show({
    //             content: error.message.replace('GraphQL error: ', '') || '举报失败',
    //         });
    //     },
    // });

    const reportAction = useCallback(
        (content) => {
            reason.current = content;
            reportMutation();
        },
        [reportMutation],
    );

    const report = useCallback(() => {
        const operations = [
            {
                title: '低俗色情',
                onPress: () => reportAction('低俗色情'),
            },
            {
                title: '侮辱谩骂',
                onPress: () => reportAction('侮辱谩骂'),
            },
            {
                title: '违法行为',
                onPress: () => reportAction('违法行为'),
            },
            {
                title: '垃圾广告',
                onPress: () => reportAction('垃圾广告'),
            },
            {
                title: '政治敏感',
                onPress: () => reportAction('政治敏感'),
            },
        ];
        PullChooser.show(operations);
    }, [reportAction]);

    return report;
};

useReport.defaultProps = {
    type: 'articles',
};

export default useReport;
