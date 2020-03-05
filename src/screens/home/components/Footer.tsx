import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';

const Footer = props => {
    return useMemo(
        () => (
            <View style={styles.footer}>
                <ActivityIndicator color="#fff" size={'small'} />
            </View>
        ),
        [],
    );
};

const styles = StyleSheet.create({
    footer: {
        alignItems: 'center',
        paddingVertical: PxDp(10),
    },
    image: {
        width: PxDp(60),
        height: PxDp(60),
    },
});

export default Footer;
