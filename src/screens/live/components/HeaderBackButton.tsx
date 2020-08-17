import React from "react";
import { TouchableOpacity,StyleSheet, Text } from 'react-native';
// import { Icons,SvgIcon } from './res';
//TODO: import { useNavigation } from "@react-navigation/native";

interface Props {
  paddingStart?: number;
  marginBottom?: number;
  color?: string;
  arrow?: boolean;
  navigation:any;
}
export default function HeaderBackButton(props: Props) {
  const navigation = props.navigation;
  const color = props.color ?? "#222";

  let { paddingStart, marginBottom } = props;
  paddingStart = paddingStart ?? 10;
  marginBottom = marginBottom ?? 0;

  // let icon = props?.arrow ? Icons.arrow_left : Icons.back;
  // let size = props?.arrow ? 27 : 30;
  // let scale = props?.arrow ? 0.026 : 0.030;

  function _backHanlder() {
    navigation.goBack();
  }
  return (
    <TouchableOpacity
      onPress={_backHanlder}
      style={[{
        paddingStart: paddingStart,
        marginBottom: marginBottom,
      },styles.button]}
      activeOpacity={1.0}
    >
      {/* <SvgIcon name={icon} color={color} size={size} scale={scale} /> */}
      <Text>退出</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        alignItems: "center"
    }
})