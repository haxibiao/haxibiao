/*
 * @flow
 * created by wyk made in 2019-04-11 18:10:13
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Row } from '@src/components';

class IncomeAndExpenditureItem extends Component {
    render() {
        const { navigation, item } = this.props;
        return (
            <View style={styles.item}>
                <Row style={{ justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: Font(15), color: Theme.defaultTextColor }}>{item.remark}</Text>
                    <Text
                        style={{
                            fontSize: Font(20),
                            color: item.amount > 0 ? Theme.primaryColor : Theme.secondaryColor,
                        }}>
                        {item.amount > 0 ? '+' + item.amount : item.amount}
                    </Text>
                </Row>
                <Row style={{ justifyContent: 'space-between', marginTop: Font(10) }}>
                    <Text style={{ fontSize: Font(12), color: Theme.subTextColor }}>{item.created_at}</Text>
                    <Text
                        style={{
                            fontSize: Font(12),
                            color: Theme.subTextColor,
                        }}>{`剩余贡献值: ${item.balance}`}</Text>
                </Row>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        padding: PxDp(Theme.itemSpace),
        borderBottomColor: Theme.borderColor,
        borderBottomWidth: PxDp(1),
    },
});

export default IncomeAndExpenditureItem;