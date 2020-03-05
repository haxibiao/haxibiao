import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image, Animated } from 'react-native';
import { HxfButton, FollowButton, Row, Iconfont, Avatar, NavigatorBar, MoreOperation } from '@src/components';
import { GQL, useApolloClient, ApolloProvider } from '@src/apollo';
import { useNavigation, useNavigationParam } from '@src/router';
import { userStore, observer } from '@src/store';
import { Overlay } from 'teaset';

export default observer(({ category, titleStyle, nameStyle }) => {
    const navigation = useNavigation();
    const client = useApolloClient();
    // const showMoreOperation = useCallback(() => {
    //     let overlayRef;
    //     const MoreOperationOverlay = (
    //         <Overlay.PullView
    //             style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
    //             containerStyle={{ backgroundColor: 'transparent' }}
    //             animated={true}
    //             ref={ref => (overlayRef = ref)}>
    //             <ApolloProvider client={client}>
    //                 <MoreOperation
    //                     onPressIn={() => overlayRef.close()}
    //                     target={category}
    //                     options={['举报']}
    //                     type="category"
    //                     deleteCallback={() => startAnimation(1, 0)}
    //                 />
    //             </ApolloProvider>
    //         </Overlay.PullView>
    //     );
    //     Overlay.show(MoreOperationOverlay);
    // }, [client, category]);
    return (
        <View style={styles.profileContainer}>
            <ImageBackground source={require('@app/assets/images/category_default_bg.png')} style={styles.categoryBg}>
                <View style={styles.mask} />
                <View style={styles.content}>
                    <Animated.View
                        style={[{ height: PxDp(Theme.NAVBAR_HEIGHT), justifyContent: 'center' }, titleStyle]}>
                        <Animated.Text style={[styles.categoryName, nameStyle]}>#{category.name}</Animated.Text>
                    </Animated.View>
                    <Text style={styles.categoryDescription}>
                        {category.description || '这个话题很懒，什么介绍都不写'}
                    </Text>
                    <View style={styles.fill}>
                        <Text style={styles.countArticles}>{Helper.NumberFormat(category.count_articles)}条动态</Text>
                    </View>
                </View>
            </ImageBackground>
            <View style={styles.navBarStyle}>
                <TouchableOpacity activeOpacity={1} onPress={navigation.goBack} style={styles.navBarButton}>
                    <Iconfont name="zuojiantou" color={'#fff'} size={PxDp(22)} />
                </TouchableOpacity>
                {/* <TouchableOpacity activeOpacity={1} onPress={showMoreOperation} style={styles.navBarButton}>
                    <Iconfont name="qita1" size={PxDp(22)} color={'#fff'} />
                </TouchableOpacity> */}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    profileContainer: {
        flex: 1,
    },
    mask: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    categoryBg: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    content: {
        flex: 1,
        padding: PxDp(Theme.itemSpace),
        paddingTop: PxDp(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight),
    },
    categoryName: {
        color: '#fff',
        fontSize: PxDp(20),
    },
    categoryDescription: {
        color: '#f9f9f9',
        fontSize: PxDp(14),
    },
    fill: {
        flex: 1,
        marginTop: PxDp(Theme.itemSpace * 2),
        justifyContent: 'flex-end',
    },
    countArticles: {
        color: '#fff',
        fontSize: PxDp(14),
    },
    navBarStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: PxDp(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight),
        paddingTop: PxDp(Theme.statusBarHeight),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    navBarButton: {
        alignSelf: 'stretch',
        paddingHorizontal: PxDp(Theme.itemSpace),
        justifyContent: 'center',
    },
});
