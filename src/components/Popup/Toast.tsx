'use strict';

import React, {Component} from 'react';
import {StyleSheet, View, Text, Animated, Easing} from 'react-native';

type positionValue = 'top' | 'center' | 'bottom';

interface Option {
    content: any;
    layout?: positionValue;
    duration?: number;
    callback?: () => void;
}

interface Props {
    style?: any;
    textStyle?: any;
    fadeInDuration?: number;
    fadeOutDuration?: number;
    showDuration?: number;
}

interface State {
    isShow: boolean;
    content: any;
    opacity: any;
}

class Toast extends Component<Props, State> {
    static defaultProps = {
        fadeInDuration: 300,
        fadeOutDuration: 400,
        showDuration: 1200,
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            isShow: false,
            content: null,
            opacity: new Animated.Value(1),
        };
    }

    show(option: Option = {}) {
        this.positionValue = option.layout || 'center';
        const duration = option.duration || this.props.showDuration;
        const content = option.content;
        const callback = option.callback;
        if (this.isShow) return;
        this.isShow = true;
        this.state.opacity.setValue(0);
        this.setState({content, isShow: true});
        Animated.sequence([
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: this.props.fadeInDuration,
                easing: Easing.linear,
            }),
            Animated.delay(duration),
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: this.props.fadeOutDuration,
                easing: Easing.linear,
            }),
        ]).start(() => {
            this.setState({content: null, isShow: false});
            this.isShow = false;
            if (typeof callback === 'function') {
                callback();
            }
        });
    }

    render() {
        const {isShow, opacity, content} = this.state;
        const {style, textStyle} = this.props;
        let position;
        switch (this.positionValue) {
            case 'top':
                position = {top: PxDp(Theme.NAVBAR_HEIGHT + 100)};
                break;
            case 'center':
                position = {top: PxDp(Device.HEIGHT - 120) / 2};
                break;
            case 'bottom':
                position = {bottom: PxDp(Theme.HOME_INDICATOR_HEIGHT + 100)};
                break;
        }
        const ToastView = isShow ? (
            <View style={[styles.container, position]} pointerEvents="none">
                <Animated.View style={[styles.toast, {opacity}, style]}>
                    {React.isValidElement(content) ? (
                        content
                    ) : (
                        <Text style={[styles.content, textStyle]}>{content}</Text>
                    )}
                </Animated.View>
            </View>
        ) : null;
        return ToastView;
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 10000,
        alignItems: 'center',
    },
    toast: {
        maxWidth: '50%',
        backgroundColor: 'rgba(32,30,51,0.7)',
        borderRadius: PxDp(5),
        paddingVertical: PxDp(8),
        paddingHorizontal: PxDp(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        fontSize: Font(14),
        lineHeight: PxDp(24),
        color: '#fff',
        textAlign: 'center',
    },
});

export default Toast;
