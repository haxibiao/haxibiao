import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
// import { withNavigation } from 'react-navigation';

import Iconfont from '../Iconfont';

export default class HeaderLeft extends Component {
    render() {
        const { color = Theme.defaultTextColor, children, navigation, goBack = true } = this.props;
        return (
            <View style={styles.headerLeft}>
                {goBack && (
                    <TouchableOpacity activeOpacity={1} style={styles.goBack} onPress={() => navigation.goBack()}>
                        <Iconfont name="fanhui" size={23} color={color} />
                    </TouchableOpacity>
                )}
                {children}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    goBack: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 40,
        width: 40,
    },
    headerLeft: {
        alignItems: 'center',
        flexDirection: 'row',
        marginRight: 15,
    },
});

// export default withNavigation(HeaderLeft);
