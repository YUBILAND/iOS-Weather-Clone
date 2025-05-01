import { WeatherData } from "@/constants/constants";
import { getCurrentTime, stringToTime } from "@/hooks/hooks";
import { useIs12Hr } from "@/hooks/useIs12Hr";
import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import ModalTextBox from "../modal/ModalTextBox";
import ModalTransparentTextBox from "../modal/ModalTransparentTextBox";
import { getDayArr } from "../precipitation/utils/getDayArr";
import { getMinMaxArr } from "../utils/getMinMaxArr";
import HorizontalBar from "./HorizontalBar";

interface UVModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const UVModalDescription = ({
  data,
  currentIndex,
}: UVModalDescriptionProps) => {
  const is12Hr = useIs12Hr();

  const { arrMax: todaysUVHigh } = getMinMaxArr(getDayArr(data, 0, "uv"));
  const { arrMax: tomorrowsUVHigh } = getMinMaxArr(getDayArr(data, 1, "uv"));

  const maxUV = Math.max(Math.round(todaysUVHigh), Math.round(tomorrowsUVHigh));

  const currentDescription = `It is currently weak. From 10 to 2, it will become mid level`;

  const dailySummaryText = `The peak UV index today is similar to tomorrow.`;
  const uvIndexText = `The ultraviolet index, or UV index, is an international standard measurement of the strength of the sunburn-producing ultraviolet radiation at a particular place and time. It is primarily used in daily and hourly forecasts aimed at the general public.`;

  const firstIndex = currentIndex === 0;

  return (
    <View className="px-4">
      <ModalTransparentTextBox
        title={
          firstIndex
            ? "Now, " +
              stringToTime(is12Hr, getCurrentTime(data.location.tz_id))
            : "2025, Mar 4th"
        }
        description={currentDescription}
      />

      {firstIndex && (
        <>
          <ModalTextBox title="Daily Summary" removeHorizontalPadding>
            <View className="gap-y-2 px-4">
              <DefaultText>{dailySummaryText}</DefaultText>
            </View>

            <HorizontalLine />

            <View className="gap-y-2 px-4">
              <HorizontalBar
                title="Today"
                bgColor="light"
                currentHigh={Math.round(todaysUVHigh).toString()}
                percentage={todaysUVHigh / maxUV}
              />
              <HorizontalBar
                title="Tomorrow"
                bgColor="dark"
                currentHigh={Math.round(tomorrowsUVHigh).toString()}
                percentage={tomorrowsUVHigh / maxUV}
              />
            </View>
          </ModalTextBox>
        </>
      )}
      <ModalTextBox title={"About the UV Index"}>
        <DefaultText>{uvIndexText}</DefaultText>
      </ModalTextBox>
    </View>
  );
};

export default UVModalDescription;
