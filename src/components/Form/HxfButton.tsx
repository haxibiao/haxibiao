import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TouchableWithoutFeedback } from 'react-native';
import GradientView from '../Basic/GradientView';

type Size = 'mini' | 'small' | 'medium' | 'default';

export interface Props {
    title?: string;
    theme?: string;
    gradient?: boolean;
    size?: Size;
    onPress?: (e: SyntheticEvent) => void;
    innerStyle?: any;
    plain?: bool;
    icon?: bool;
    loading?: bool;
    disabled?: bool;
}

class HxfButton extends Component<Props, any> {
    static defaultProps: Props = {
        theme: Theme.primaryColor,
        size: 'default',
        innerStyle: {},
        plain: false,
        icon: false,
        loading: false,
        disabled: false,
    };

    constructor(props: Props) {
        super(props);
    }

    public buildProps() {
        const { theme, size, innerStyle, plain, ...others } = this.props;

        let buttonStyle, titleStyle;
        if (plain) {
            buttonStyle = {
                ...buttonLayout[size],
                ...innerStyle,
                borderWidth: PxDp(1),
                borderColor: theme,
            };
            titleStyle = { ...buttonTitle[size], color: theme };
        } else {
            buttonStyle = { ...buttonLayout[size], ...innerStyle, backgroundColor: theme };
            titleStyle = { ...buttonTitle[size], color: '#fff' };
        }
        return {
            buttonStyle,
            titleStyle,
            ...others,
        };
    }

    private renderIcon() {
        const { theme, size, icon, loading } = this.props;
        let Iconfont;
        if (loading) {
            Iconfont = <ActivityIndicator color={theme} size={size === 'small' ? size : 'large'} />;
        }
        if (icon) {
            Iconfont = icon;
        }
        if (Iconfont) {
            return (
                <View style={iconWrapStyle[size]}>
                    <Iconfont />
                </View>
            );
        }
        return null;
    }

    public render() {
        const { gradient, style, buttonStyle, titleStyle, title, children, disabled, onPress } = this.buildProps();
        if (gradient) {
            return (
                <TouchableWithoutFeedback disabled={disabled} onPress={onPress}>
                    <GradientView colors={disabled?['#787878', '#a4a4a4']:[Theme.primaryColor, Theme.secondaryColor]} style={[styles.buttonWrap, style]}>
                        {this.renderIcon()}
                        {children || <Text style={titleStyle}>{title}</Text>}
                    </GradientView>
                </TouchableWithoutFeedback>
            );
        }
        return (
            <TouchableOpacity
                style={[styles.buttonWrap, buttonStyle, style, disabled && { backgroundColor: '#a8a8a8' }]}
                disabled={disabled}
                onPress={onPress}>
                {this.renderIcon()}
                {children || <Text style={titleStyle}>{title}</Text>}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    buttonWrap: {
        alignItems: 'center',
        borderRadius:PxDp(4),
        flexDirection: 'row',
        justifyContent: 'center',
        overflow: 'hidden',
    },
});

export default HxfButton;

const buttonLayout = {
    mini: {
        paddingVertical: PxDp(4),
        paddingHorizontal: PxDp(9),
    },
    small: {
        paddingVertical: PxDp(6),
        paddingHorizontal: PxDp(11),
    },
    medium: {
        paddingVertical: PxDp(9),
        paddingHorizontal: PxDp(14),
    },
    default: {
        paddingVertical: PxDp(11),
        paddingHorizontal: PxDp(17),
    },
};

const buttonTitle = {
    mini: {
        fontSize: Font(13),
    },
    small: {
        fontSize: Font(13),
    },
    medium: {
        fontSize: Font(15),
    },
    default: {
        fontSize: Font(16),
    },
};

const iconWrapStyle = {
    mini: {
        marginRight: PxDp(2),
    },
    small: {
        marginRight: PxDp(3),
    },
    medium: {
        marginRight: PxDp(4),
    },
    default: {
        marginRight: PxDp(5),
    },
};
