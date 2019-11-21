import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';

import HTML from 'react-native-render-html';
import { Screen, ShareModal, Header } from '@src/components';

import { Query, GQL } from  '@src/apollo';
import store from '@src/store';
import { Iconfont, Colors, width } from '@src/common';

let css_fix = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    </head>
    <body>
    <style>
    article {
      word-break: break-all!important;
      font-size: 16px;
      line-height: 26px;
    }
    article img {
      max-width: 100%;
      height: auto;
    }
    </style>`;

//必须用onload, 不然计算图片高度不准确
let js_fix = `
  <script>
      window.onload = function() {
        document.title = document.body.offsetHeight;
        window.location.hash = 1;
      }
  </script>
  </body>
  </html>`;

class DraftDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.toggleModalVisible = this.toggleModalVisible.bind(this);
    this.state = {
      modalVisible: false
    };
  }

  render() {
    let { modalVisible } = this.state;
    const { article } = this.props.navigation.state.params;
    const { navigation } = this.props;
    return (
      <Screen header={this.renderHeader()}>
        <Query query={GQL.draftQuery} variables={{ id: article.id }}>
          {({ loading, error, data }) => {
            if (!(data && data.article)) { return null; }
            return (
              <View style={styles.container}>
                <ScrollView
                  style={[styles.container, { paddingBottom: 20 }]}
                  removeClippedSubviews={true}
                >
                  <View style={{ paddingHorizontal: 15 }}>
                    <Text style={styles.articleTitle}>
                      {data.article.title}
                    </Text>
                  </View>
                  <View style={{ paddingHorizontal: 15 }}>
                    <HTML
                      html={data.article.body}
                      imagesMaxWidth={width}
                      renderers={{
                        img: (htmlAttribs, children, passProps) => {
                          return (
                            <Image
                              key={htmlAttribs.src}
                              source={{
                                uri: htmlAttribs.src
                              }}
                              style={{
                                marginLeft: -15,
                                width, //TODO: will use htmlAttribs.width
                                height: 200, //TODO:图片的宽高比例可以由后台api计算好返回,这里先固定, will use htmlAttribs.height
                                resizeMode: 'cover'
                              }}
                              {...passProps}
                            />
                          );
                        }
                      }}
                    />
                  </View>
                </ScrollView>
                <View style={styles.articleBottom}>
                  {
                    // 隐藏功能
                    // <TouchableOpacity
                    // 	onPress={this.toggleModalVisible}
                    // 	style={[
                    // 		styles.articleOperation,
                    // 		{
                    // 			borderRightWidth: 1,
                    // 			borderRightColor: Colors.lightBorderColor
                    // 		}
                    // 	]}
                    // >
                    // 	<Iconfont name={"share"} size={17} color={"#666"} />
                    // 	<Text style={styles.operationName}>分享</Text>
                    // </TouchableOpacity>
                  }

                  <TouchableOpacity
                    onPress={() => null}
                    style={styles.articleOperation}
                  >
                    <Iconfont name={'write'} size={20} color={'#666'} />
                    <Text style={styles.operationName}>编辑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        </Query>
        <ShareModal
          plain
          visible={modalVisible}
          toggleVisible={this.toggleModalVisible}
        />
      </Screen>
    );
  }

  renderHeader = () => {
    return (
      <Header
        routeName
        rightComponent={
          <TouchableOpacity onPress={() => null}>
            <Text
              style={{
                fontSize: 15,
                color: Colors.themeColor
              }}
            >
              公开发布
            </Text>
          </TouchableOpacity>
        }
      />
    );
  };

  toggleModalVisible() {
    this.setState(prevState => ({
      modalVisible: !prevState.modalVisible
    }));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor
  },
  articleTitle: {
    marginVertical: 30,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '700',
    color: Colors.darkFontColor
  },
  articleBottom: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.lightBorderColor
  },
  articleOperation: {
    flex: 1,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  operationName: {
    fontSize: 15,
    color: '#666',
    marginLeft: 10
  }
});

export default DraftDetailScreen;
