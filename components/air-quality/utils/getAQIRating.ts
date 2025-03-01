export const getAQIRating = (AQI: number) =>
  AQI <= 50
    ? "Good"
    : AQI <= 100
    ? "Moderate"
    : AQI <= 150
    ? "Unhealthy for Sensitive Groups"
    : AQI <= 200
    ? "Unhealthy"
    : AQI <= 300
    ? "Very unhealthy"
    : "Hazardous";
