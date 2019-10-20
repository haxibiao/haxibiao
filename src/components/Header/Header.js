import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { withNavigation } from 'react-navigation';

import Iconfont from '../Iconfont';

class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            routeName,
            leftComponent,
            centerComponent,
            rightComponent,
            navigation,
            hidden = false,
            lightBar = false,
            customStyle = {},
            backHandler,
            onLayout = event => null,
        } = this.props;
        return (
            <View style={[styles.header, lightBar && styles.lightHeader, customStyle]} onLayout={onLayout}>
                {leftComponent ? (
                    leftComponent
                ) : (
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.side, { width: 40, left: 15 }]}
                        onPress={() => {
                            if (backHandler) {
                                backHandler();
                            } else {
                                navigation.goBack();
                            }
                        }}>
                        <Iconfont name="back-ios" size={23} color={lightBar ? '#fff' : Theme.primaryFontColor} />
                    </TouchableOpacity>
                )}
                {centerComponent ? (
                    centerComponent
                ) : (
                    <View style={styles.title}>
                        <Text style={[styles.routeName, lightBar && { color: '#fff' }]}>
                            {routeName ? routeName : navigation.state.routeName}
                        </Text>
                    </View>
                )}
                {rightComponent && <View style={[styles.side, { right: 15 }]}>{rightComponent}</View>}
            </View>
        );
    }
}

// TODO:【Bin】下面的paddingTop要换手机顶部tab的高度
const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        backgroundColor: Theme.skinColor,
        borderBottomColor: Theme.lightBorderColor,
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: 60 + 40,
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 60,
    },
    lightHeader: { backgroundColor: 'transparent', borderBottomColor: 'transparent' },
    routeName: {
        color: Theme.primaryFontColor,
        fontSize: 17,
        fontWeight: '500',
    },
    side: {
        alignItems: 'center',
        bottom: 0,
        flexDirection: 'row',
        height: 40,
        position: 'absolute',
    },
    title: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 40,
    },
});

export default withNavigation(Header);
