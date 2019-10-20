import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

import { Colors } from '@src/common';
import { Screen, Header } from '@src/components';

import store from '@src/store';

import { Mutation, GQL } from  '@src/apollo';

class IntroduceScreen extends Component {
  constructor(props) {
    super(props);
    this.introduction = props.navigation.getParam('introduction', '');
  }

  render() {
    return (
      <Screen header>
        <View style={styles.container}>
          <Mutation mutation={GQL.updateUserIntroduction}>
            {updateUserIntroduction => {
              return (
                <Header
                  rightComponent={
                    <TouchableOpacity
                      onPress={() => {
                        updateUserIntroduction({
                          variables: {
                            input: {
                              introduction: this.introduction
                            },
                            id: store.me.id
                          }
                        });
                        store.changeIntroduction(this.introduction);
                        this.props.navigation.goBack();
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 17,
                          color: Colors.themeColor
                        }}
                      >
                        确定
                      </Text>
                    </TouchableOpacity>
                  }
                />
              );
            }}
          </Mutation>
          <View style={styles.inputContainer}>
            <TextInput
              textAlignVertical="top"
              underlineColorAndroid="transparent"
              selectionColor={Colors.themeColor}
              multiline={true}
              autoFocus
              style={styles.textInput}
              onChangeText={introduction => {
                this.introduction = introduction;
              }}
              defaultValue={this.introduction}
            />
          </View>
        </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor
  },
  inputContainer: {
    flex: 1,
    backgroundColor: Colors.skinColor,
    padding: 15
  },
  textInput: {
    height: 80,
    padding: 0,
    fontSize: 16,
    color: Colors.primaryFontColor,
    lineHeight: 24
  }
});

export default IntroduceScreen;
