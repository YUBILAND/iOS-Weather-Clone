import { RootState } from "@/state/store";
import React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { CalendarDaysIcon } from "react-native-heroicons/outline";
import { useSelector } from "react-redux";
import ColoredBar from "../atoms/ColoredBar";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import { getUVRating } from "./utils/getUVRating";
import { getUVMessage } from "./utils/getUVMessage";
import { FontAwesome } from "@expo/vector-icons";
import CardTitle from "../atoms/CardTitle";
import CardBottomText from "../atoms/CardBottomText";
import Animated, { AnimatedStyle } from "react-native-reanimated";

interface UVIndexCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
  collapseFromTopStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

const UVIndexCard = ({
  cityName,
  showModal,
  iconSize,
  collapseFromTopStyle,
}: UVIndexCardProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { current } = data[cityName];

  const UV = Math.round(current?.uv);

  const rating = getUVRating(UV);
  const message = getUVMessage(UV);

  return (
    <OpacityCard className="px-4 h-full">
      <Pressable className="gap-y-2 " onPress={showModal}>
        <CardTitle
          title={"UV Index"}
          icon={<FontAwesome name="sun-o" size={iconSize} color={"white"} />}
        />

        <View className="overflow-hidden">
          <Animated.View style={collapseFromTopStyle}>
            <DefaultText
              className="font-semibold"
              style={{ fontSize: 30, lineHeight: 30 }}
            >
              {UV}
            </DefaultText>
            <DefaultText
              className=" font-semibold"
              style={{ fontSize: 18, lineHeight: 18 }}
            >
              {rating}
            </DefaultText>

            <ColoredBar
              cityName={cityName}
              index={UV}
              maxIndex={12}
              label={"UV"}
              colorsArr={[
                "#00df72",
                "#f5e536",
                "#fc9003",
                "#f51458",
                "#ad02f6",
              ]}
              locationsArr={[0, 0.3, 0.6, 0.8, 1]}
            />

            <CardBottomText className="pt-2" text={message} />
          </Animated.View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(UVIndexCard);
