/*
 * @flow
 * created by wyk made in 2019-04-11 17:14:30
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';


function WithdrawLogItem(props) {
    const { style, navigation, item } = props;
    let statusText, color;
    switch (item.status) {
        case -1:
            statusText = '提现失败';
            color = Theme.errorColor;
            break;
        case 1:
            statusText = '提现成功';
            color = Theme.weixin;
            break;
        case 0:
            statusText = '待处理';
            color = Theme.correctColor;
            break;
    }
    return (
        <TouchableOpacity
            style={[styles.item, style]}
            activeOpacity={0.7}
            disabled={item.status == 0}
            onPress={() =>
                navigation.navigate('WithdrawDetail', {
                    item: item,
                })
            }>
            <View>
                <Text style={{ fontSize: Font(15), color: Theme.defaultTextColor }}>{statusText}</Text>
                <Text style={{ fontSize: Font(12), color: Theme.subTextColor, paddingTop: Font(10) }}>
                    {item.created_at}
                </Text>
            </View>
            <View>
                <Text style={{ fontSize: Font(20), color }}>￥{item.amount.toFixed(0)}.00</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        alignItems: 'center',
        borderBottomColor:"#F0F0F0",
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
});

export default WithdrawLogItem;
