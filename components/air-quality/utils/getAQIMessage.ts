export const getAQIMessage = (AQI: number) =>
  AQI <= 50
    ? "Air quality is good. It's a great day to be outside!"
    : AQI <= 100
    ? "Air quality is moderate. Generally acceptable, but sensitive individuals should take care."
    : AQI <= 150
    ? "Air quality is unhealthy for sensitive groups. Limit prolonged outdoor exertion."
    : AQI <= 200
    ? "Air quality is unhealthy. Everyone may begin to feel health effects."
    : AQI <= 300
    ? "Air quality is very unhealthy. Health alert: everyone may experience serious health effects."
    : "Air quality is hazardous. Emergency conditions—everyone is at risk.";
