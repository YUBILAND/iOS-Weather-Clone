import { WeatherData } from "@/constants/constants";
import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import ModalOption from "../modal/ModalOption";
import ModalTextBox from "../modal/ModalTextBox";
import HorizontalBar from "../uv-index/HorizontalBar";
import { getWeekVisibilityArr } from "../visibility/utils/getWeekVisibilityArr";
import { getDailyVisibilityArr } from "../visibility/utils/getDailyVisibilityArr";
import TemperatureBar from "../conditions/TemperatureBar";

interface AveragesModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const AveragesModalDescription = ({
  data,
  currentIndex,
}: AveragesModalDescriptionProps) => {
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

  const dailyOverviewMessage =
    "For April 8, the normal temperature range is -1 to 20 and the average high is 13 Todays high temperature is 7";

  const monthlyAvgArr = [
    { month: "Jan", low: -4, high: 3 },
    { month: "Feb", low: -3, high: 5 },
    { month: "Mar", low: 0, high: 9 },
    { month: "Apr", low: 6, high: 16 },
    { month: "May", low: 12, high: 21 },
    { month: "Jun", low: 17, high: 27 },
    { month: "Jul", low: 20, high: 29 },
    { month: "Aug", low: 20, high: 28 },
    { month: "Sep", low: 16, high: 24 },
    { month: "Oct", low: 10, high: 18 },
    { month: "Nov", low: 4, high: 12 },
    { month: "Dec", low: -1, high: 6 },
  ];

  const yearlyLow = Math.min(...monthlyAvgArr.map((item) => item.low));
  const yearlyHigh = Math.max(...monthlyAvgArr.map((item) => item.high));

  return (
    <View className="px-4">
      <ModalTextBox title="Summary">
        <DefaultText>{dailyOverviewMessage}</DefaultText>
      </ModalTextBox>

      <ModalTextBox title="Monthly Averages">
        <DefaultText>{dailyOverviewMessage}</DefaultText>
        <HorizontalLine />
        <View className="gap-y-2 px-4">
          {monthlyAvgArr.map((item, index) => {
            return (
              <View
                key={index}
                className="flex-row justify-between items-center"
              >
                <DefaultText className=" font-semibold">
                  {item.month}
                </DefaultText>

                <TemperatureBar
                  barWidth={160}
                  weekHigh={yearlyHigh}
                  weekLow={yearlyLow}
                  tempHigh={item.high}
                  tempLow={item.low}
                />
              </View>
            );
          })}
        </View>
      </ModalTextBox>

      <ModalTextBox title="About the Normal Range">
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

      <ModalTextBox title="About Average Temperatures">
        <DefaultText>
          The average high is the mean high temperature for April 8 in every
          year since 1970. Monthly averages reflect daily highs and lows since
          1970. For example, the January monthly average uses January 1 through
          January 31 for every year since 1970.
        </DefaultText>
      </ModalTextBox>
      <ModalOption title={"Option"} />
    </View>
  );
};

export default AveragesModalDescription;
