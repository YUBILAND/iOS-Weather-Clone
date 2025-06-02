import { useWeatherData } from "@/hooks/useWeatherData";
import { getWeatherName, weatherNameToCardBg } from "@/utils/exampleForecast";
import React, { useEffect } from "react";
import { ImageBackground, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface LocationCardItemContainerProps {
  children: React.ReactNode;
  idx: number;
  weatherScreens: string[];
  goToWeatherScreen: (index: number) => void;
  closeSetting: () => void;
  drag?: (() => void) | null;
  isEditingList: boolean;
}

const LocationCardItemContainer = ({
  children,
  weatherScreens,
  idx,
  goToWeatherScreen,
  closeSetting,
  drag,
  isEditingList,
}: LocationCardItemContainerProps) => {
  const data = useWeatherData();
  const background = weatherNameToCardBg(
    getWeatherName(data[weatherScreens[idx]]?.current.condition.code),
    data[weatherScreens[idx]]?.current.is_day
  );

  const handlePress = () => {
    goToWeatherScreen(idx);
    closeSetting();
  };

  const height1 = useSharedValue(100);
  useEffect(() => {
    height1.value = isEditingList ? 60 : 100;
  }, [isEditingList]);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      height: withTiming(height1.value, { duration: 300 }),
    };
  });

  return (
    <Animated.View style={[animatedStyle]}>
      <Pressable
        onLongPress={drag ?? null}
        onPress={handlePress}
        className=" rounded-2xl overflow-hidden"
      >
        <ImageBackground
          source={background}
          resizeMode="cover"
          className="px-4 pt-4 pb-2 h-full"
        >
          {children}
        </ImageBackground>
      </Pressable>
    </Animated.View>
  );
};

export default LocationCardItemContainer;
