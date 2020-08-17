import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Image, Slider } from 'react-native';
const { width: sw, height: sh } = Dimensions.get('window');
import { LivePushManager } from 'hxf-tencent-live';
import {observe} from 'mobx';
import LiveBeautyStore from './LiveBeautyStore';

const ShowTimeWidgetBeautySlider = React.memo(() => {

    useEffect(() => {
        LivePushManager.liveSetBeautyMode('NATURAL');
    },[])

    const BlurHandler = (value:number) => {
        let v = Math.round(value)*10;
        LivePushManager.liveSetBeautyLevel(v);
        LiveBeautyStore.setBlur(v);
    }

    const WhiteHandler = (value:number) => {
        let v = Math.round(value)*10;
        LivePushManager.liveSetWhitenessLevel(v);
        LiveBeautyStore.setWhiteness(v);
    }
    
    return (
        <View style={{ width: sw * 0.5 }}>
            <Text style={styles.option_title}>磨皮</Text>
            <View style={styles.slider_wrapper}>
                <Slider 
                value={LiveBeautyStore.blur} 
                thumbTintColor='#ffffffdd' 
                minimumTrackTintColor='#fff' 
                onValueChange={BlurHandler}/>
            </View>
            <Text style={[styles.option_title,{marginTop:20}]}>美白</Text>
            <View style={styles.slider_wrapper}>
                <Slider 
                value={LiveBeautyStore.whiteness} 
                thumbTintColor='#ffffffdd' 
                style={{width:'100%'}}
                minimumTrackTintColor='#fff' 
                onValueChange={WhiteHandler}/>
            </View>
        </View>
    )
});

export default ShowTimeWidgetBeautySlider;

const styles = StyleSheet.create({
    option_title:{ 
        color: '#ffffffdd', 
        marginBottom: 5,
        fontWeight:'bold',
        textShadowColor:'#000',
        textShadowRadius:2 
    },
    slider_wrapper:{ 
        width: sw * 0.5, 
        height: 30, 
        borderRadius: 15, 
        backgroundColor: '#00000066' ,
        justifyContent:'center',
    },
})