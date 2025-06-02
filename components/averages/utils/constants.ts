import { getPrecipitation, getTemperature } from "@/hooks/useDisplayUnits";

// Sample Data Temperature Monthly Averages
export const monthlyAvgArrExample = [
  { text: "Jan", low: -4, high: 3 },
  { text: "Feb", low: -3, high: 5 },
  { text: "Mar", low: 0, high: 9 },
  { text: "Apr", low: 6, high: 16 },
  { text: "May", low: 12, high: 21 },
  { text: "Jun", low: 17, high: 27 },
  { text: "Jul", low: 20, high: 29 },
  { text: "Aug", low: 20, high: 28 },
  { text: "Sep", low: 16, high: 24 },
  { text: "Oct", low: 10, high: 18 },
  { text: "Nov", low: 4, high: 12 },
  { text: "Dec", low: -1, high: 6 },
];
// Change to Correct Temperature Unit
export const useMonthlyAvgArr = () =>
  monthlyAvgArrExample.map((item) => ({
    ...item,
    low: getTemperature(item.low),
    high: getTemperature(item.high),
  }));

// Sample Data Temperature Monthly Averages
export const monthlyPrecipArrExample = [
  { text: "Jan", precip: 3.1 },
  { text: "Feb", precip: 2.85 },
  { text: "Mar", precip: 4.05 },
  { text: "Apr", precip: 3.9 },
  { text: "May", precip: 3.9 },
  { text: "Jun", precip: 3.45 },
  { text: "Jul", precip: 4.05 },
  { text: "Aug", precip: 3.95 },
  { text: "Sep", precip: 3.8 },
  { text: "Oct", precip: 3.55 },
  { text: "Nov", precip: 3 },
  { text: "Dec", precip: 4 },
];
// Change to Correct Temperature Unit
export const useMonthlyPrecipArr = () =>
  monthlyPrecipArrExample.map((item) => ({
    ...item,
    precip: getPrecipitation(item.precip),
  }));

// Using Free API Data so using Sample Data
export const averageRangeExample = [
  { low: 5.3, high: 14.2 },
  { low: 5.1, high: 14.1 },
  { low: 4.9, high: 13.9 },
  { low: 4.7, high: 13.7 },
  { low: 4.6, high: 13.6 },
  { low: 4.8, high: 13.8 },
  { low: 5.8, high: 15.1 },
  { low: 7.6, high: 17.3 },
  { low: 9.9, high: 19.5 },
  { low: 12.2, high: 21.2 },
  { low: 13.9, high: 22.3 },
  { low: 15.2, high: 23.1 },
  { low: 15.7, high: 23.5 },
  { low: 15.5, high: 23.4 },
  { low: 14.7, high: 22.9 },
  { low: 13.6, high: 22.1 },
  { low: 12.0, high: 20.3 },
  { low: 10.1, high: 18.0 },
  { low: 8.4, high: 16.0 },
  { low: 7.1, high: 14.2 },
  { low: 6.2, high: 13.0 },
  { low: 5.7, high: 12.1 },
  { low: 5.4, high: 11.5 },
  { low: 5.2, high: 11.0 },
];
// Blue Line Sample Data
export const averagePrecipExample = [
  { average: 0.05 },
  { average: 0.1 },
  { average: 0.15 },
  { average: 0.2 },
  { average: 0.25 },
  { average: 0.35 },
  { average: 0.4 },
  { average: 0.45 },
  { average: 0.55 },
  { average: 0.6 },
  { average: 0.65 },
  { average: 0.75 },
  { average: 0.8 },
  { average: 0.9 },
  { average: 0.95 },
  { average: 1 },
  { average: 1.05 },
  { average: 1.1 },
  { average: 1.2 },
  { average: 1.35 },
  { average: 1.5 },
  { average: 1.55 },
  { average: 1.6 },
  { average: 1.7 },
  { average: 1.8 },
  { average: 1.9 },
  { average: 2 },
  { average: 2.2 },
  { average: 2.25 },
  { average: 2.5 },
  { average: 2.8 },
  { average: 2.85 },
  { average: 2.9 },
  { average: 3 },
  { average: 3.1 },
  { average: 3.15 },
  { average: 3.25 },
  { average: 3.3 },
  { average: 3.4 },
  { average: 3.5 },
];
// Gray Line Sample Data
export const currentPrecipExample = [
  { average: 0 },
  { average: 0 },
  { average: 0 },
  { average: 0 },
  { average: 0 },
  { average: 0 },
  { average: 0.15 },
  { average: 0.15 },
  { average: 0.15 },
  { average: 0.15 },
  { average: 0.15 },
  { average: 0.15 },
  { average: 0.9 },
  { average: 0.9 },
  { average: 0.9 },
  { average: 0.9 },
  { average: 0.9 },
  { average: 0.9 },
  { average: 0.9 },
  { average: 0.9 },
  { average: 1.75 },
  { average: 1.75 },
  { average: 1.75 },
  { average: 1.75 },
  { average: 1.75 },
  { average: 1.75 },
  { average: 1.75 },
  { average: 1.75 },
  { average: 1.75 },
  { average: 1.75 },
  { average: 1.75 },

  // { average: 1.9 },
  // { average: 2.15 },
  // { average: 2.15 },
  // { average: 2.15 },
  // { average: 2.15 },
];

// Temperature Gradient Colors
export const temperatureGradient = [
  "rgba(255, 171, 4, 0.7)",
  "rgba(42, 123, 155, 0.9)",
  // "rgba(87, 199, 133, 0.8)",
  // "rgba(237, 221, 83, 0.7)",
];
export const temperatureGradientLine = [
  "rgba(255, 171, 4, 1)",
  "rgba(42, 123, 155, 1)",
  // "rgba(87, 199, 133, 0.8)",
  // "rgba(237, 221, 83, 0.7)",
];

// Text for Modal Description
export const getText = () => {
  const summaryText =
    "For April 8, the normal temperature range is -1 to 20 and the average high is 13 Todays high temperature is 7";
  const monthlyAveragesText = `For April, the average daily low is 6, and the average daily high is 16`;
  const normalRangeText = `In weather terms, "visibility" refers to the distance at which an object or light can be clearly seen and identified, essentially measuring how far you can see clearly depending on the atmospheric conditions, like fog, haze, or precipitation, which can significantly impact visibility levels; low visibility means you can see only a short distance, while high visibility indicates clear conditions with a long viewing range.`;
  const averageTempText = `The average high is the mean high temperature for April 8 in every year since 1970. Monthly averages reflect daily highs and lows since 1970. For example, the January monthly average uses January 1 through January 31 for every year since 1970.`;
  const precipText =
    "Precipitation averages are based on precipitation since 1970. When there is snow, precipitation averages use liquid equivalent moisture, which is the amount of water if snow were melted, rather than the depth of snow. Monthly averages reflect average total precipitation since 1970. For example, the January monthly average uses January 1 through January 31 for every year since 1970.";

  return {
    summaryText,
    monthlyAveragesText,
    normalRangeText,
    averageTempText,
    precipText,
  };
};

export type SelectAverage = "temperature" | "precipitation";
