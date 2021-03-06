'use strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class Badge extends Component {
    static defaultProps = {
        maxCount: 99,
    };

    buildProps() {
        let { style, countStyle, count, maxCount } = this.props;

        let width, height, borderRadius, borderWidth;
        width = pixel(20);
        height = pixel(20);
        borderRadius = width / 2;

        style = [
            {
                backgroundColor: Theme.error,
                minWidth: width,
                height: height,
                borderRadius: borderRadius,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
            },
        ].concat(style);

        countStyle = [
            {
                color: '#fff',
                fontSize: font(11),
            },
        ].concat(countStyle);

        return { style, countStyle, count, maxCount };
    }

    render() {
        let { style, countStyle, count, maxCount } = this.buildProps();
        if (!count || count <= 0) return null;
        return (
            <View style={style}>
                <Text style={countStyle} allowFontScaling={false} numberOfLines={1}>
                    {count > maxCount ? maxCount + '+' : count}
                </Text>
            </View>
        );
    }
}
