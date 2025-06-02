import { RootState } from "@/state/store";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { useSelector } from "react-redux";
import CardTitle from "../atoms/CardTitle";
import OpacityCard from "../atoms/OpacityCard";
import RainMapComponent from "./RainMapComponent";
import { useTileData } from "./utils/useTileData";

interface RainMapCardProps {
  cityName: string;
  // showModal: () => void;
  iconSize: number;
  collapseFromTopStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

const RainMapCard = ({
  cityName,
  iconSize,
  collapseFromTopStyle,
}: RainMapCardProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { current, location } = data[cityName];

  const initialRegion = {
    latitude: location.lat,
    longitude: location.lon,
    // Zoom Level
    latitudeDelta: 0.6,
    longitudeDelta: 0.3,
  };

  const { epochArr } = useTileData();

  return (
    <OpacityCard className="h-96">
      <Pressable
        className="px-4 gap-y-2 h-full"
        // onPress={() => {
        //   showModal();
        // }}
      >
        <CardTitle
          title={"Rain Map"}
          icon={<FontAwesome name="umbrella" size={iconSize} color={"white"} />}
        />

        <View style={styles.container}>
          <Animated.View style={collapseFromTopStyle}>
            <RainMapComponent
              cityName={cityName}
              initialRegion={initialRegion}
              disableScroll
              epochArr={epochArr}
              visibleTileIndex={0}
            />
          </Animated.View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default React.memo(RainMapCard);
