import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

const animation = require('~/assets/json/loadinganimation.json');

export default () => {
    return (
        <View style={styles.container}>
            <LottieView source={animation} autoPlay loop style={{ width: '60%', height: 100 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
