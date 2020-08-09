/*
 * @flow
 * created by wyk made in 2018-12-12 12:01:36
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
// import { withNavigation } from 'react-navigation';

import { GQL, graphql } from '~/apollo';
import { userStore } from '~/store';

type Props = {
    id: number;
    followedStatus: boolean | number;
    style?: any;
    titleStyle?: any;
    activeColor?: any;
    tintColor?: any;
};

class FollowButton extends Component<Props> {
    static defaultProps = {
        activeOpacity: 0.6,
        activeColor: Theme.subTextColor,
        tintColor: '#fff',
    };

    constructor(props: Props) {
        super(props);
        this.onFollowHandler = __.throttle(this.onFollowHandler(), 500);
        this.state = {
            followed: props.followedStatus ? true : false,
        };
    }

    buildProps() {
        const { followed } = this.state;
        let { style, titleStyle, activeColor, tintColor, ...others } = this.props;
        let title, backgroundColor, textColor;
        if (followed) {
            title = '已关注';
            textColor = activeColor;
            backgroundColor = '#888888';
        } else {
            title = '关注';
            textColor = tintColor;
            backgroundColor = Theme.secondaryColor;
        }

        style = {
            backgroundColor,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            ...style,
        };

        titleStyle = {
            fontSize: PxDp(13),
            color: textColor,
            overflow: 'hidden',
            ...titleStyle,
        };

        return { titleStyle, style, title, ...others };
    }

    render() {
        if (userStore.me.id === this.props.id) {
            return null;
        }
        const { titleStyle, style, title, ...others } = this.buildProps();
        return (
            <TouchableOpacity {...others} style={style} onPress={this.onFollowHandler}>
                <Text style={titleStyle} numberOfLines={1}>
                    {title}
                </Text>
            </TouchableOpacity>
        );
    }

    onFollowHandler = () => {
        console.log('触发');
        if (!userStore.login) {
            return () => {
                this.props.navigation.navigate('Login');
            };
        } else {
            console.log('true');
            return () => {
                this.setState({ followed: !this.state.followed }, () => {
                    this.follow();
                });
            };
        }
    };

    follow = async () => {
        const { id, followUser } = this.props;
        const handleFunc = followUser;
        const variables = { id };
        try {
            await handleFunc({
                variables,
                refetchQueries: () => [
                    {
                        query: GQL.followedUsersQuery,
                        variables: { user_id: userStore.me.id },
                    },
                    {
                        query: GQL.userQuery,
                        variables: { id },
                    },
                ],
            });
        } catch (error) {
            Toast.show({ content: '操作失败', layout: 'top' });
        }
    };
}

const styles = StyleSheet.create({});

export default graphql(GQL.followUserMutation, { name: 'followUser' })(FollowButton);
