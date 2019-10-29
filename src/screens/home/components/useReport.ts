import React, { useCallback, useState, useRef } from 'react';
import { PullChooser } from '@src/components';
import { useApolloClient, GQL } from '@src/apollo';

const useReport = props => {
    const client = useApolloClient();
    const reportMutation = useCallback(
        content => {
            client.mutate({
                query: GQL.RecommendVideosQuery,
                variables: { type: props.type, id: props.target.id, content },
                onCompleted: () => {
                    Toast.show({
                        content: '举报失败',
                    });
                },
                onError: error => {
                    Toast.show({
                        content: error.message.replace('GraphQL error: ', '') || '举报失败',
                    });
                },
            });
        },
        [props, client],
    );

    const report = useCallback(() => {
        const operations = [
            {
                title: '低俗色情',
                onPress: () => reportMutation('低俗色情'),
            },
            {
                title: '侮辱谩骂',
                onPress: () => reportMutation('侮辱谩骂'),
            },
            {
                title: '违法行为',
                onPress: () => reportMutation('违法行为'),
            },
            {
                title: '垃圾广告',
                onPress: () => reportMutation('垃圾广告'),
            },
            {
                title: '政治敏感',
                onPress: () => reportMutation('政治敏感'),
            },
        ];
        PullChooser.show(operations);
    }, []);

    return report;
};

export default useReport;
