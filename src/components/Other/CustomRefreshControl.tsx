/*
 * @flow
 * created by wyk made in 2018-12-11 16:16:04
 */

import React, { useState } from 'react';
import { StyleSheet, View, RefreshControl } from 'react-native';
import { appStore } from '~/store';

type Props = {
    onRefresh: Function;
    reset: Function;
    title?: string;
    size?: string;
    tintColor?: string;
    colors?: Array<string>;
    progressBackgroundColor?: string;
};

export default (props: Props) => {
    let defaultProps = {
        title: '',
        size: undefined,
        tintColor: '#FFCC80',
        colors: [Theme.primaryColor, '#FFCC80'],
        progressBackgroundColor: '#fff',
    };

    const [refreshing, setRefreshing] = useState(false);

    const { onRefresh, reset, ...otherProps } = props;

    const _onRefresh = async () => {
        const { deviceOffline } = appStore;
        if (deviceOffline) {
            Toast.show({ content: '网络错误,请检查网络连接' });
            return;
        }
        if (!onRefresh) {
            return;
        }
        await onRefresh();
        setRefreshing(true);

        //FIXME: 以前这里很复杂，可以异步等onRefresh事件完成
        // , async () => {
        //     try {
        //         await onRefresh();
        //     } catch (e) {
        //         console.error('onRefresh error', e);
        //     } finally {
        //         setRefreshing(false);
        //         reset && reset();
        //     }
        // }
    };

    return <RefreshControl {...defaultProps} refreshing={refreshing} onRefresh={_onRefresh} {...otherProps} />;
};
