import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';

const Footer = (props) => {
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
        paddingVertical: pixel(10),
    },
    image: {
        width: pixel(60),
        height: pixel(60),
    },
});

export default Footer;
