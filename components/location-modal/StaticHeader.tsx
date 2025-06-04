import React from "react";
import { View, Text, ScrollView } from "react-native";
import Search from "../atoms/Search";
import VisibleText from "./VisibleText";
import { BlurView } from "expo-blur";
import Animated from "react-native-reanimated";
import DefaultText from "../atoms/DefaultText";
import { FlatList } from "react-native-gesture-handler";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface StaticHeaderProps {
  hasCrossedPoint: boolean;
  showSearch: boolean;
  searchProps: any;
}

const StaticHeader = ({
  hasCrossedPoint,
  showSearch,
  searchProps,
}: StaticHeaderProps) => {
  console.log("rerendering?");
  return (
    <BlurView intensity={0}>
      {/* Hides when scrolled up  */}

      <VisibleText
        text="Weather2"
        visible={hasCrossedPoint}
        exists={!showSearch}
        fontSize={32}
      />

      <View className=" py-4 relative z-40 flex-row items-center gap-x-2">
        <Search {...searchProps} />
      </View>
    </BlurView>
  );
};

export default React.memo(StaticHeader);
