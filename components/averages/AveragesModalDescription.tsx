import { WeatherData } from "@/constants/constants";
import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import ComparisonComponent from "../modal/ComparisonComponent";
import ModalTextBox from "../modal/ModalTextBox";
import PrecipOption from "../modal/PrecipOption";
import TempOption from "../modal/TempOption";
import {
  getText,
  useMonthlyAvgArr,
  useMonthlyPrecipArr,
} from "./utils/constants";
import PrecipMonthlyAverages from "../modal/PrecipMonthlyAverages";
import { SelectAverage } from "./AveragesModal";

interface AveragesModalDescriptionProps {
  data: WeatherData;
  selectedAverage: SelectAverage;
}

const AveragesModalDescription = ({
  data,
  selectedAverage,
}: AveragesModalDescriptionProps) => {
  const {
    summaryText,
    monthlyAveragesText,
    normalRangeText,
    averageTempText,
    precipText,
  } = getText();

  const monthlyAvgArr = useMonthlyAvgArr();

  const yearlyLow = Math.min(...monthlyAvgArr.map((item) => item.low));
  const yearlyHigh = Math.max(...monthlyAvgArr.map((item) => item.high));

  const monthlyPrecipArr = useMonthlyPrecipArr();

  return (
    <>
      <ModalTextBox title="Summary">
        <DefaultText>{summaryText}</DefaultText>
      </ModalTextBox>

      {selectedAverage === "temperature" ? (
        <>
          <ModalTextBox title="Monthly Averages">
            <DefaultText>{monthlyAveragesText}</DefaultText>
            <HorizontalLine />

            <ComparisonComponent
              rangeHigh={yearlyHigh}
              rangeLow={yearlyLow}
              arr={monthlyAvgArr}
            />
          </ModalTextBox>

          <ModalTextBox title="About the Normal Range">
            <DefaultText>{normalRangeText}</DefaultText>
          </ModalTextBox>
          <ModalTextBox title="About Average Temperatures">
            <DefaultText>{averageTempText}</DefaultText>
          </ModalTextBox>
        </>
      ) : (
        <>
          <ModalTextBox title="Monthly Averages">
            <DefaultText>{monthlyAveragesText}</DefaultText>
            <HorizontalLine />

            <PrecipMonthlyAverages arr={monthlyPrecipArr} />
          </ModalTextBox>

          <ModalTextBox title="About Average Precipitation">
            <DefaultText>{precipText}</DefaultText>
          </ModalTextBox>
        </>
      )}

      <ModalTextBox title="Options">
        <TempOption />
      </ModalTextBox>
      <ModalTextBox title="Options">
        <PrecipOption />
      </ModalTextBox>
    </>
  );
};

export default AveragesModalDescription;
