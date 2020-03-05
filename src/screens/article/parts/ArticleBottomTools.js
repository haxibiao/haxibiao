import React, { Component } from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import CommentsInput from '../../comment/CommentsInput';

import { Mutation, GQL, graphql, compose } from  '@src/apollo';
import { width, navigate } from '@src/common';
import { Iconfont } from '@src/components';
import { userStore } from '@src/store';
class ArticleBottomTools extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      like,
      unlike,
      comments,
      article,
      showWrite,
      toggleCommentModal,
      handleRewardVisible,
      handleSlideShareMenu,
      commentHandler,
      navigation
    } = this.props;
    let { login, me } = userStore;
    let { liked_id, count_likes } = article;
    return (
      <View style={styles.BottomTools}>
        <View>
          <CommentsInput
            showWrite={showWrite}
            toggleCommentModal={toggleCommentModal}
          />
        </View>
        <View style={styles.articleTools}>
          {
            // 隐藏功能
            // <TouchableOpacity onPress={handleRewardVisible} style={{ flex: 1 }}>
            //   <View style={styles.articleToolItem}>
            //     <Iconfont name={"reward"} size={19} color={Theme.tintFontColor} style={{ marginBottom: -1 }} />
            //     <Text style={styles.articleToolItemText}>赞赏 {rewards}</Text>
            //   </View>
            // </TouchableOpacity>
          }
          <TouchableOpacity onPress={commentHandler} style={{ flex: 1 }}>
            <View style={styles.articleToolItem}>
              <Iconfont
                name={'comment-hollow'}
                size={17}
                color={Theme.tintTextColor}
              />
              <Text style={styles.articleToolItemText}>
                评论 {comments || 0}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={async () => {
              if (login) {
                if (!liked_id) {
                  like({
                    variables: {
                      liked_id: article.id,
                      user_id: me.id
                    },
                    // optimisticResponse: {
                    //   __typename: 'Mutation',
                    //   like: {
                    //     id: article.id,
                    //     liked_id: !liked_id,
                    //     count_likes: liked_id ? --count_likes : ++count_likes
                    //   }
                    // }
                    update: (cache, { data }) => {
                      cache.writeQuery({
                        query: GQL.articleQuery,
                        variables: { id: article.id },
                        data: {
                          article: {
                            ...article,
                            count_likes: data.like.article.count_likes,
                            liked_id: data.like.id
                          }
                        }
                      });
                    }
                  });
                } else {
                  unlike({
                    variables: {
                      id: liked_id
                    }
                  });
                  liked_id--;
                  count_likes--;
                }
              } else {
                navigate('Login');
              }
            }}
          >
            <View style={styles.articleToolItem}>
              <Iconfont
                name={liked_id ? 'like' : 'like-outline'}
                size={17}
                color={liked_id ? Theme.primaryColor : Theme.tintTextColor}
              />
              <Text style={styles.articleToolItemText}>喜欢 {count_likes}</Text>
            </View>
          </TouchableOpacity>
          {
            // 隐藏第三方social
            // <TouchableOpacity onPress={handleSlideShareMenu} style={{ flex: 1 }}>
            //   <View style={styles.articleToolItem}>
            //     <Iconfont name={"share"} size={16} color={Theme.tintTextColor} />
            //     <Text style={styles.articleToolItemText}>分享</Text>
            //   </View>
            // </TouchableOpacity>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  BottomTools: {
    width,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: Theme.borderColor,
    backgroundColor: Theme.groundColour
  },
  textInput: {
    backgroundColor: Theme.secondaryTextColor,
    borderWidth: 1,
    borderColor: Theme.borderColor,
    borderRadius: 2,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center'
  },
  articleTools: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  articleToolItem: {
    alignItems: 'center'
  },
  articleToolItemText: {
    marginTop: 4,
    fontSize: 11,
    color: Theme.tintTextColor
  }
});

export default compose(
  graphql(GQL.likeArticleMutation, { name: 'like' }),
  graphql(GQL.unlikeArticleMutation, { name: 'unlike' })
)(ArticleBottomTools);
