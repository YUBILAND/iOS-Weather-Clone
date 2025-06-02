export const hour12ForecastOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  hour12: true,
  hour: "numeric",
  minute: "numeric",
};

export const hour24ForecastOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  hour12: false,
  hour: "numeric",
  minute: "numeric",
};

export const weekdayOption: Intl.DateTimeFormatOptions = {
  weekday: "long",
};

export const getSliderMins = (startingMinute: number, index: number) => {
  let mins = (startingMinute + 10 * index) % 60;
  return mins;
};

export const getSliderHr = (
  startingMinute: number,
  currentHour: number,
  index: number
) => {
  const hour =
    currentHour - (2 - Math.floor((startingMinute + 10 * index) / 60));
  return hour;
};
