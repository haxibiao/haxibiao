import React,{useEffect} from 'react';
import { View,Text,Animated,Easing,Dimensions} from 'react-native';
import {Overlay} from 'teaset';
import LottieView from 'lottie-react-native';

const { width: sw, height: sh } = Dimensions.get("window");

let overlaykey:any = null;
const showBoBo = (msg:string) => {

    const view = (
        <Overlay.View overlayOpacity={0.6} >
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <LottieView 
                source={require('../res/bobokiss.json')} 
                autoPlay 
                loop={false} 
                style={{height:sw * 0.7,width:sw * 0.7}}
                onAnimationFinish={() => {
                    console.log('彩蛋结束');
                    hideBoBo();
                }}
                />
                <Text style={{fontSize:20,color:"#ffffffdd"}}>{msg ?? ''}</Text>
            </View>
        </Overlay.View>
    );
    overlaykey = Overlay.show(view);
}

const hideBoBo = () => {
    Overlay.hide(overlaykey);
}

export {showBoBo,hideBoBo}