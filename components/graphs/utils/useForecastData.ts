export type ForecastData = {
  mainLine: number;
  secondLine?: number;
  thirdLine?: number;
}[];

export const useForecastData = (forecastWithoutMidnight: ForecastData) => {
  const lastForecast =
    forecastWithoutMidnight[forecastWithoutMidnight.length - 1];
  const forecastWithMidnight = [
    ...forecastWithoutMidnight,
    {
      mainLine: lastForecast.mainLine,
      ...(lastForecast.secondLine !== undefined && {
        secondLine: lastForecast.secondLine,
      }),
      ...(lastForecast.thirdLine !== undefined && {
        thirdLine: lastForecast.thirdLine,
      }),
    },
  ];

  return forecastWithMidnight;
};
