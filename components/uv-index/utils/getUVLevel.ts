export const getUVLevel = (uvi: number) => {
  // 'worklet' makes it run on UI thread
  "worklet";
  if (uvi < 3) {
    return "Low";
  } else if (uvi < 6) {
    return "Moderate";
  } else if (uvi < 8) {
    return "High";
  } else if (uvi < 11) {
    return "Very High";
  } else {
    return "Extreme";
  }
};
