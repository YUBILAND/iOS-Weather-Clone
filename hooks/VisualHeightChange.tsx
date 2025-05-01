import {
  View,
  Text,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from "react-native";
import React from "react";
import Animated, { AnimatedStyle } from "react-native-reanimated";

interface VisualHeightChangeProps {
  onLayout: ((event: LayoutChangeEvent) => void) | undefined;
  layoutHeight: number | null;
  heightAnimation: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  removalAnimation: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  children: React.ReactNode;
}

const VisualHeightChange = ({
  onLayout,
  layoutHeight,
  heightAnimation,
  removalAnimation,
  children,
}: VisualHeightChangeProps) => {
  return (
    <View
      onLayout={onLayout}
      style={{
        zIndex: 100,
        overflow: "hidden",
        borderRadius: 10,
        ...(layoutHeight !== null ? { height: layoutHeight } : {}),
      }}
    >
      {/* Change height visually  */}
      <Animated.View
        style={[
          { overflow: "hidden", borderRadius: 10 },
          heightAnimation,
          removalAnimation,
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

export default VisualHeightChange;
