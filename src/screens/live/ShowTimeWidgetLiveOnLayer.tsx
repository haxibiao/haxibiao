import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions,SafeAreaView, TouchableOpacity,NativeModules,StatusBar, Image, Slider } from 'react-native';
import { LivePushManager } from 'hxf-tencent-live';
const { width: sw, height: sh } = Dimensions.get('window');
import ShowTimeWidgetLiveOnWidgetTopBar from './ShowTimeWidgetLiveOnWidgetTopBar';
import CommonWidgetLiveRoomMessages from './CommonWidgetLiveRoomMessages';
import * as BeautyModal from './ShowTimeWidgetBeautyModal';
import * as MirrorModal from './ShowTimeWidgetMirrorModal';
import * as VoiceChanger from './ShowTimeWidgetVoiceChangerModal';
import ShowTimeWSMountPoint from './ShowTimeWSMountPoint';
const SideBarWidth = 38;
const StatusBarHeight = StatusBar.currentHeight ?? 0;
const OptionSize = 33;


const MemoMountPoint = React.memo(() => <ShowTimeWSMountPoint/>)


const AbilitySideBar = (props:any) => {
    const [mirror,setmirror] = useState(false);
    return (
        <View style={styles.sidebar}>
            <TouchableOpacity 
            activeOpacity={0.95}
            onPress={() => {
                //切换前后摄像头
                LivePushManager.liveSwitchCamera();
            }} style={[{marginBottom:12},styles.btn]}>
                <Image source={require('./res/switch_camera.png')} resizeMode='contain' style={styles.img}/>
            </TouchableOpacity>

            <TouchableOpacity 
            activeOpacity={0.95}
            onPress={() => {
                //调出美颜浮层
                BeautyModal.showBeautyModal();
            }} style={[{marginBottom:12},styles.btn]}>
                <Image source={require('./res/meiyan.png')} resizeMode='contain' style={styles.img}/>
            </TouchableOpacity>

            <TouchableOpacity 
            activeOpacity={0.95}
            onPress={() => {
                //设置镜像
                MirrorModal.showMirrorModal();
            }} style={[{marginBottom:12},styles.btn]}>
                <Image source={require('./res/jingxiang.png')} resizeMode='contain' style={styles.img}/>
            </TouchableOpacity>

            {/* <TouchableOpacity 
            activeOpacity={0.95}
            onPress={() => {
                //变声
                VoiceChanger.showVoiceChangerModal();
            }} style={styles.btn}>
                <Image source={require('./res/Voice.png')} resizeMode='contain' style={styles.img}/>
            </TouchableOpacity> */}
            
        </View>
    )
}

const ShowTimeWidgetLiveOnLayer = (props:{navigation:any}) => {

    return (
        <View style={styles.body}>
            <SafeAreaView style={styles.safearea}>
                <ShowTimeWidgetLiveOnWidgetTopBar navigation={props.navigation}/>
                <AbilitySideBar/>
                <CommonWidgetLiveRoomMessages/>
                <MemoMountPoint/>
            </SafeAreaView>
        </View>
    )
}

export default ShowTimeWidgetLiveOnLayer;

const styles = StyleSheet.create({
    body: {
        flex:1,
    },
    safearea:{ 
        flex: 1,
        paddingTop:StatusBarHeight+12,
        paddingBottom:12, 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        backgroundColor:'transparent' 
    },
    btn:{
        height: OptionSize,
        width:OptionSize,
        borderRadius:OptionSize/2,
        overflow:'hidden',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#00000066'
    },
    sidebar:{
        position:'absolute',
        zIndex:10,
        right:10,
        top:sh * 0.15,
        width:SideBarWidth,
        alignItems:'center'
    },
    img:{
        height:'60%',
        width:'60%'
    }
});