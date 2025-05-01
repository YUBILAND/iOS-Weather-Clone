import { useOtherUnits } from "@/hooks/useOtherUnits";
import { RootState } from "@/state/store";
import React from "react";
import { Pressable, View, Image, ImageSourcePropType } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { EyeIcon } from "react-native-heroicons/outline";
import { Circle } from "react-native-svg";
import { useSelector } from "react-redux";
import CardTitle from "../atoms/CardTitle";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import { getPressurePercentage } from "./utils/getPressurePercentage";
import { getPressure } from "@/hooks/useDisplayUnits";
import { getOddPressureDirectionImages } from "./utils/getOddPressureDirectionImages";
import { getCurrentHour, getCurrentTime } from "@/hooks/hooks";

interface AirPressureCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
}

const AirPressureCard = ({
  cityName,
  showModal,
  iconSize,
}: AirPressureCardProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { current } = data[cityName];
  const pressureUnit = useOtherUnits()["pressure"];

  const currentAirPressureNumber =
    pressureUnit === "inHg"
      ? getPressure(current.pressure_in)
      : Math.round(getPressure(current.pressure_in));

  const currentAirPressureUnit = pressureUnit;

  const percentage = getPressurePercentage(current.pressure_in);

  const imageArray = getOddPressureDirectionImages(data[cityName], 0, false);

  const currentLineIndex = getCurrentHour(data[cityName].location.tz_id);
  console.log(currentLineIndex);

  return (
    <OpacityCard>
      <Pressable
        className="px-4 gap-y-2 h-full"
        onPress={() => {
          showModal();
        }}
      >
        <CardTitle
          title={"Air Pressure"}
          icon={<EyeIcon size={iconSize} color={"white"} />}
        />

        <View className="items-center">
          <AnimatedCircularProgress
            rotation={230}
            arcSweepAngle={260}
            size={115}
            style={{ marginBottom: -20 }}
            width={8}
            fill={percentage}
            lineCap="square"
            tintColor="transparent"
            backgroundColor="#3d5875"
            padding={4}
            renderCap={({ center }) => (
              <Circle cx={center.x} cy={center.y} r={8} fill={"white"} />
            )}
          >
            {() => (
              <View className="items-center mb-3">
                {/* <DefaultText style={{ fontSize: 20 }}>Arrow</DefaultText> */}
                <Image
                  style={{ width: 30, height: 30 }}
                  source={
                    imageArray[
                      Math.floor(currentLineIndex / 2) + 1
                    ] as ImageSourcePropType
                  }
                />
                <DefaultText style={{ fontSize: 20, fontWeight: 800 }}>
                  {currentAirPressureNumber}
                </DefaultText>
                <DefaultText style={{ fontSize: 14 }}>
                  {currentAirPressureUnit}
                </DefaultText>
              </View>
            )}
          </AnimatedCircularProgress>

          <View className="w-full flex-row justify-around">
            <DefaultText>Low</DefaultText>
            <DefaultText>High</DefaultText>
          </View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(AirPressureCard);
