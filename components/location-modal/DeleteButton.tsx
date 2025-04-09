import { View, Text, Pressable } from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  SharedValue,
} from "react-native-reanimated";

interface DeleteButtonProps {
  size: number;
  onPress?: (() => void) | null;
  isEditingList: boolean;
}
const DeleteButton = ({
  size,
  onPress = null,
  isEditingList,
}: DeleteButtonProps) => {
  const width = useSharedValue(0);

  width.value = isEditingList ? size : 0;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(width.value, { duration: 300 }),
      height: size,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        className="relative"
        style={{
          width: size,
          height: size,
        }}
      >
        <View
          className="absolute top-0 left-0 bg-white "
          style={{
            width: size / 2,
            height: size / 2,
            borderRadius: 22,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 0,
            marginLeft: size / 2 / 2,
            marginTop: size / 2 / 2,
          }}
        >
          <View
            style={{
              width: size,
              height: size,
            }}
          >
            <Ionicons
              name="remove-circle"
              size={size}
              color={"red"}
              className=""
              style={{ zIndex: 1, color: "#EF3B51" }}
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default DeleteButton;
