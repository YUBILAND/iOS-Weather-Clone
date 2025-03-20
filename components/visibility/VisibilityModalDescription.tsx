import { WeatherData } from "@/constants/constants";
import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import ModalOption from "../modal/ModalOption";
import ModalTextBox from "../modal/ModalTextBox";
import HorizontalBar from "../uv-index/HorizontalBar";
import { getDailyVisibilityArr } from "./utils/getDailyVisibilityArr";
import { getWeekVisibilityArr } from "./utils/getWeekVisibilityArr";

interface VisibilityModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const VisibilityModalDescription = ({
  data,
  currentIndex,
}: VisibilityModalDescriptionProps) => {
  const weekVisibilitylArr = getWeekVisibilityArr(data, "vis_miles");
  const weekHigh = Math.max(...weekVisibilitylArr);
  const weekLow = Math.min(...weekVisibilitylArr);

  const todaysVisibilityArr = getDailyVisibilityArr(data, "vis_miles", 0);
  const todaysHigh = Math.max(...todaysVisibilityArr);
  const todaysLow = Math.min(...todaysVisibilityArr);

  const tomorrowsVisibilityArr = getDailyVisibilityArr(data, "vis_miles", 1);
  const tomorrowsHigh = Math.max(...tomorrowsVisibilityArr);
  const tomorrowsLow = Math.min(...tomorrowsVisibilityArr);

  const maxHigh = Math.max(todaysHigh, tomorrowsHigh);

  const dailyOverviewMessage = "random message";
  return (
    <View className="px-4">
      <ModalTextBox title="Daily Overview">
        <DefaultText>{dailyOverviewMessage}</DefaultText>
      </ModalTextBox>

      {currentIndex === 0 && (
        <>
          <ModalTextBox title="Compared to yesterday" removeHorizontalPadding>
            <View className="gap-y-2 px-4">
              <DefaultText>
                Today's UV index is similar to yesterdays
              </DefaultText>
            </View>

            <HorizontalLine />

            <View className="gap-y-2 px-4">
              <HorizontalBar
                title="Today"
                bgColor="light"
                currentHigh={Math.round(todaysHigh).toString() + " mph"}
                percentage={todaysHigh / maxHigh}
              />
              <HorizontalBar
                title="Tomorrow"
                bgColor="dark"
                currentHigh={Math.round(tomorrowsHigh).toString() + " mph"}
                percentage={tomorrowsHigh / maxHigh}
              />
            </View>
          </ModalTextBox>
        </>
      )}

      <ModalTextBox title="About Visibility">
        <DefaultText>
          In weather terms, "visibility" refers to the distance at which an
          object or light can be clearly seen and identified, essentially
          measuring how far you can see clearly depending on the atmospheric
          conditions, like fog, haze, or precipitation, which can significantly
          impact visibility levels; low visibility means you can see only a
          short distance, while high visibility indicates clear conditions with
          a long viewing range.
        </DefaultText>
      </ModalTextBox>
      <ModalOption title={"Option"} />
    </View>
  );
};

export default VisibilityModalDescription;
