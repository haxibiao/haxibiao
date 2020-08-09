/*
 * @flow
 * created by wyk made in 2019-01-24 15:08:42
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, info);
        this.setState({ hasError: true });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <View style={styles.container}>
                    <Image style={styles.image} source={require('~/assets/images/default_error.png')} />
                    <Text style={styles.title}>糟糕，出错了。我们会尽快修复！</Text>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: Helper.WPercent(80),
    },
    image: {
        width: Helper.WPercent(36),
        height: Helper.WPercent(36),
        resizeMode: 'cover',
    },
    title: {
        fontSize: Font(12),
        marginTop: PxDp(10),
        color: Theme.subTextColor,
    },
});

export default ErrorBoundary;
