import React, { Component } from 'react';
import { StyleSheet, View, Image, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import HTML from 'react-native-render-html';
import ImageViewer from 'react-native-image-zoom-viewer';
import {
    PageContainer,
    LoadingError,
    SpinnerLoading,
    AuthorCard,
    StatusView,
    Avatar,
    OverlayViewer,
    Row,
} from '@src/components';
import { Query, GQL } from '@src/apollo';
import { userStore } from '@src/store';
import { ad } from '@native';

const IMG_WIDTH = Device.WIDTH - 30;

class DetailScreen extends Component {
    constructor(props) {
        super(props);
        this.footOffsetY = Device.HEIGHT;
        this.commentsOffsetY = 0;
        this.commentsHeight = 0;
        this.state = {
            showWrite: false,
            addCommentVisible: false,
            imageViewerVisible: false,
        };
    }

    showPicture = (images, initIndex) => {
        let overlayView = (
            <ImageViewer
                onSwipeDown={() => OverlayViewer.hide()}
                imageUrls={images}
                index={initIndex}
                enableSwipeDown
                saveToLocalByLongPress={false}
                loadingRender={() => {
                    return <ActivityIndicator size="large" color={'#fff'} />;
                }}
            />
        );
        OverlayViewer.show(overlayView);
    };

    render() {
        let { showWrite, addCommentVisible, imageViewerVisible } = this.state;
        let { login } = userStore;
        const article = this.props.navigation.getParam('article', {});

        return (
            <PageContainer title="文章详情">
                <Query query={GQL.articleQuery} variables={{ id: article.id }}>
                    {({ loading, error, data, refetch }) => {
                        if (error) return <LoadingError reload={() => refetch()} />;
                        if (loading) return <SpinnerLoading />;
                        if (!(data && data.article)) {
                            return <StatusView.EmptyView />;
                        }
                        let { article } = data;
                        let user = Helper.syncGetter('user', article) || {};
                        this.articleImages = []; //初始化pictures，同时也是防止重复render所以在此清空
                        this.imgKey = 0; //初始化imgkey，同时也是防止重复render所以在此清空
                        return (
                            <ScrollView
                                style={styles.container}
                                onScroll={this._onScroll.bind(this)}
                                ref={ref => (this.scrollRef = ref)}
                                removeClippedSubviews={true}
                                keyboardShouldPersistTaps={'handled'}
                                scrollEventThrottle={16}>
                                <View style={{ padding: PxDp(Theme.itemSpace) }}>
                                    <Row
                                        style={{
                                            paddingBottom: PxDp(Theme.itemSpace),
                                        }}>
                                        <TouchableOpacity
                                            style={{ marginRight: 6 }}
                                            onPress={() => this.props.navigation.navigate('User', { user })}>
                                            <Avatar size={PxDp(40)} source={user.avatar} />
                                        </TouchableOpacity>
                                        <Text style={{ fontSize: Font(15), color: Theme.secondaryTextColor }}>
                                            {user.name}
                                        </Text>
                                    </Row>
                                    <View>
                                        <Text style={styles.title} NumberOfLines={3}>
                                            {article.title}
                                        </Text>
                                    </View>
                                    <View style={styles.articleInfo}>
                                        <Text style={styles.articleInfoText}>
                                            {article.time_ago +
                                                ' · 字数' +
                                                article.count_words +
                                                ' · 阅读' +
                                                article.hits +
                                                '  '}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: PxDp(Theme.itemSpace) }}>
                                    <HTML
                                        html={article.body}
                                        imagesMaxWidth={Device.WIDTH}
                                        baseFontStyle={{
                                            fontSize: 15,
                                            color: Theme.defaultTextColor,
                                        }}
                                        tagsStyles={tagsStyles}
                                        renderers={{
                                            img: (htmlAttribs, children, passProps) => {
                                                //往picture填充图片
                                                this.articleImages.push({
                                                    url: htmlAttribs.src,
                                                });
                                                // 获取当前index
                                                let index = this.imgKey;
                                                this.imgKey++;
                                                let width = htmlAttribs.width ? parseInt(htmlAttribs.width) : IMG_WIDTH;
                                                let height = htmlAttribs.height
                                                    ? parseInt(htmlAttribs.height)
                                                    : IMG_WIDTH;
                                                let size = imageSize({ width, height });
                                                return (
                                                    <TouchableOpacity
                                                        activeOpacity={1}
                                                        key={index}
                                                        onPress={() => {
                                                            this.showPicture(this.articleImages, index);
                                                        }}
                                                        style={{ alignItems: 'center' }}>
                                                        <Image
                                                            source={{ uri: htmlAttribs.src }}
                                                            style={{
                                                                width: size.width, //TODO: will use htmlAttribs.width
                                                                height: size.height, //TODO:图片的宽高比例可以由后台api计算好返回，这里先固定, will use htmlAttribs.height
                                                                resizeMode: 'cover',
                                                            }}
                                                            {...passProps}
                                                        />
                                                    </TouchableOpacity>
                                                );
                                            },
                                            hr: () => <View style={styles.hr} />,
                                        }}
                                        alterNode={node => {
                                            const { name, parent, children, data } = node;
                                            node.attribs = {
                                                ...(node.attribs || {}),
                                                style: `marginLeft:${0};padding:${0};`,
                                            };
                                            return node;
                                        }}
                                    />
                                </View>
                            </ScrollView>
                        );
                    }}
                </Query>
            </PageContainer>
        );
    }

    //获取文章底部到页面顶部的高度 控制底部输入框显示隐藏的临界点
    _footOnLayout(event) {
        let { x, y, width, height } = event.nativeEvent.layout;
        this.footOffsetY = y;
    }

    //获取评论区域到顶部的高度
    _commentsOnLayout(event) {
        let { y, height } = event.nativeEvent.layout;
        this.commentsOffsetY = y;
        this.commentsHeight = height;
    }

    //scrollView 滚动事件
    _onScroll(event) {
        let { y } = event.nativeEvent.contentOffset;
        if (y >= this.footOffsetY - Device.HEIGHT) {
            if (!this.state.showWrite) {
                this.setState({ showWrite: true });
            }
        } else {
            if (this.state.showWrite) {
                this.setState({ showWrite: false });
            }
        }
    }

    //滚动到评论顶部
    _scrollToComments = () => {
        if (this.commentsHeight >= Device.HEIGHT) {
            this.scrollRef.scrollTo({
                x: 0,
                y: this.commentsOffsetY,
                animated: true,
            });
        } else {
            this.scrollRef.scrollToEnd({ animated: true });
        }
    };
}

function imageSize({ width, height }) {
    var size = {};
    if (width > Device.WIDTH) {
        size.width = Device.WIDTH;
        size.height = Math.round((Device.WIDTH * height) / width);
    } else {
        size = { width, height };
    }
    return size;
}

//html targets style
let tagsStyles = {
    a: { color: Theme.link },
    p: {
        lineHeight: 21,
        marginBottom: 10,
    },
    h1: {
        fontSize: 20,
        marginTop: 0,
        marginBottom: 10,
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 26,
        color: '#201e33',
    },
    articleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    articleInfoText: {
        fontSize: 12,
        color: Theme.secondaryTextColor,
    },
    showFoot: {
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    hr: {
        height: 1,
        backgroundColor: Theme.borderColor,
        marginTop: 10,
        marginBottom: 20,
    },
});

export default DetailScreen;
