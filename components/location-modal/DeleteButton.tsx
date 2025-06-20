import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
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
  useEffect(() => {
    width.value = withTiming(isEditingList ? size : 0, { duration: 300 });
  }, [isEditingList]);
  const animatedWidthStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: size,
    };
  });

  const RemoveCircleIcon = () => {
    return (
      <Ionicons
        name="remove-circle"
        size={size}
        color={"red"}
        className=""
        style={{ zIndex: 1, color: "#EF3B51" }}
      />
    );
  };

  return (
    <Animated.View style={animatedWidthStyle}>
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
            <RemoveCircleIcon />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default DeleteButton;
