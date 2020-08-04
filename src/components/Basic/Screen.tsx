import React, { Component } from 'react';
import { View, StatusBar, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';

class Screen extends Component {
    render() {
        let { navigation, customStyle = {}, lightBar, header = false, leftComponent = false } = this.props;
        if (navigation.getParam('auth') && TOKEN === null) {
            return <ActivityIndicator />;
        }
        return (
            <View
                style={[
                    {
                        flex: 1,
                        backgroundColor: '#ffffff',
                    },
                    customStyle,
                ]}>
                <StatusBar
                    translucent={true}
                    backgroundColor={'transparent'}
                    barStyle={lightBar ? 'light-content' : 'dark-content'}
                />
                {this.props.children}
            </View>
        );
    }
}

export default withNavigation(Screen);
