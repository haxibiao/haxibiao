import React, { useState, useEffect, useRef } from 'react';

import { StatusBar, View, StatusBarIOS, StyleSheet, Dimensions, NativeModules, TouchableOpacity, Animated, Text, ViewStyle, Platform, TextStyle } from 'react-native';
const { width, height } = Dimensions.get('window');
// import { Icons, SvgIcon } from './res';

const { StatusBarManager } = NativeModules;

// const icon = Icons.arrow_left;
// const size = 23;
// const scale = 0.022;

const PageBackground = '#ffffff';//最外层view的背景色 

interface BarStyle {
    'light-content': string;
    'dark-content': string;
    'default': string;
}

function isAndroid() {
    return Platform.OS == 'android';
}

export default function PageCleared(props: {
    navigation?: any;
    children?: JSX.Element[] | JSX.Element;
    backgroundColor?: string;
    backIcon?: JSX.Element;
    rightWidget?: JSX.Element;
    enableShadow?: boolean;
    enableBack?: boolean;
    backBg?: string;
    barStyle?: keyof BarStyle;
    safe?: boolean;
    containerStyle?: ViewStyle;
    fixed?: boolean;
    centerTitleStyle?: TextStyle;
    centerTitle?: string;
}) {

    const backgroundColor = props?.backgroundColor ?? PageBackground; //最外层view的背景色 


    const barStyle = props?.barStyle ?? (backgroundColor == 'white' || '#ffffff') ? 'dark-content' : 'default';
    const enableShadow = props?.enableShadow ?? false;
    const enableBack = props?.enableBack ?? true;
    const safe = props?.safe ?? null;
    const fixed = props?.fixed ?? false;
    const backbg = props?.backBg ?? 'transparent';

    /**
     * 导航栏高度适配 ATag1
     */
    const NavBarHeight = isAndroid() ? 48 : 44; //安卓对应48，IOS对应44 。数值与路由中自定义底部导航栏高度相一致

    /**
     * 状态栏高度适配 ATag2 ( 返回安全视图高度，和状态栏高度适配合并在这里一起完成)
     */
    const [StatusHeight, setStatusHeight] = useState(0);
    useEffect(() => {

        if (!isAndroid()) {
            // 这里直接适配了IOS刘海屏
            StatusBarManager.getHeight((h: any) => {
                setStatusHeight(h.height);
                console.log(h.height);
            });
        } else {
            // 适配Android
            setStatusHeight(StatusBar.currentHeight ?? 0);
        }

    }, [])


    // 导航栏绝对定位的样式配置
    let position: ViewStyle = { position: "absolute", top: 0, left: 0, zIndex: 10 };

    let shadow: ViewStyle = enableShadow ? {
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOpacity: 0.2,
                shadowRadius: 5,
                shadowOffset: {
                    width: 0,
                    height: 0
                }
            },
            android: {
                elevation: 18
            }
        })
    } : {};

    return (
        <View style={[{ backgroundColor: backgroundColor,flex:1 }, props.containerStyle]}>

            <StatusBar backgroundColor={'transparent'} barStyle={barStyle} />

            {/*  头部导航栏  开始*/}
            {
                props?.enableBack && (
                    <View style={[
                        styles.body,
                        {
                            minHeight: NavBarHeight + StatusHeight,
                            width: width,
                            backgroundColor: 'transparent',
                        },
                        position
                    ]}>
                        <View style={[styles.leftWidgetContainer, { height: NavBarHeight }]}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={[
                                    styles.backWrapper,
                                    shadow,
                                    {
                                        backgroundColor: backbg
                                    }
                                ]}
                                onPress={() => {
                                    if (enableBack) props.navigation.goBack();
                                }}>
                                {/* <SvgIcon
                                    name={icon}
                                    color={'#454545'}
                                    size={size}
                                    offset={{ x: 4, y: 0 }}
                                    scale={scale} /> */}
                                    <Text>退出</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            fixed && (
                                <View style={[styles.centerWidgetContainer, { height: NavBarHeight }]}>
                                    <Text style={props?.centerTitleStyle ?? { fontSize: 17, color: '#222' }}>
                                        {props?.centerTitle ?? ''}
                                    </Text>
                                </View>
                            )
                        }
                        <View style={[styles.rightWidgetContainer, { height: NavBarHeight }]}>
                            {
                                props?.rightWidget ?? <View />
                            }
                        </View>
                    </View>
                )
            }
            {/*  头部导航栏  结束*/}

            {/*  安全距离填充视图  */}
            <View style={{width:0,height: safe ? StatusHeight : 0}}/>

            {/*  主体内容  */}
            {props.children}
        </View>
    )
}
const styles = StyleSheet.create({
    body: {
        width: width,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    backWrapper: {
        height: 33,
        width: 33,
        borderRadius: 18,
        marginStart: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#ffffff",
    },
    rightWidgetContainer: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    centerWidgetContainer: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center'
    },
    leftWidgetContainer: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
})