import { SharedValue, useAnimatedStyle } from "react-native-reanimated";

export const getLocationHeaderStyles = (
  scrolledDownShared: SharedValue<number>
) => {
  const highAndLowOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - Math.max(scrolledDownShared.value - 30, 0) / 30,
    };
  });
  const conditionOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - Math.max(scrolledDownShared.value - 60, 0) / 30,
    };
  });
  const tempOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - Math.max(scrolledDownShared.value - 90, 0) / 30,
    };
  });
  const minimizedTempOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: Math.max(scrolledDownShared.value - 130, 0) / 30,
    };
  });

  return {
    highAndLowOpacityStyle,
    conditionOpacityStyle,
    tempOpacityStyle,
    minimizedTempOpacityStyle,
  };
};
