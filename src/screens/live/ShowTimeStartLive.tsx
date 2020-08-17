import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, TextInput, Image, Slider } from 'react-native';

import ShowTimeWidgetLivePreview from './ShowTimeWidgetLivePreview';
import ShowTimeWidgetConfigureLayer from './ShowTimeWidgetConfigureLayer';
import ShowTimeWidgetLiveOnLayer from './ShowTimeWidgetLiveOnLayer';

const { width: sw, height: sh } = Dimensions.get('window');

const StartLiveButtonWidth = sw * 0.72;
const StartLiveButtonHeight = StartLiveButtonWidth * 0.2;
const CardWidth = sw * 0.8;
const CardHeight = CardWidth * 0.23;

const ShowTimeStartLive = (props: any) => {

    const [started,setstarted] = useState(false);

    return (
        <View style={styles.body}>
            <ShowTimeWidgetLivePreview />
            {
                started ? <ShowTimeWidgetLiveOnLayer navigation={props.navigation} /> : <ShowTimeWidgetConfigureLayer navigation={props.navigation} startCallback={() => {setstarted(true)}}/>
            }
        </View>
    )
}

export default ShowTimeStartLive;

const styles = StyleSheet.create({
    body: {
        flex:1,
        alignItems: 'center',
        backgroundColor: '#333'
    },
    StartButton: {
        width: StartLiveButtonWidth,
        height: StartLiveButtonHeight,
        borderRadius: StartLiveButtonHeight / 2,
        backgroundColor: '#F2CB17ee',
        position: 'absolute',
        bottom: sh * 0.1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})