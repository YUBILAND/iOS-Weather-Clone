import { fetchWeatherApi } from "openmeteo";

// From Open-Meteo Website
export const getNextHourRain = async (lat: number, lon: number) => {
  const params = {
    latitude: lat,
    longitude: lon,
    hourly: "visibility",
    minutely_15: "rain",
    timezone: "America/New_York",
    past_days: 0,
    forecast_days: 3,
    forecast_minutely_15: 5,
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  try {
    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const minutely15 = response.minutely15()!;
    const hourly = response.hourly()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      minutely15: {
        time: [
          ...Array(
            (Number(minutely15.timeEnd()) - Number(minutely15.time())) /
              minutely15.interval()
          ),
        ].map(
          (_, i) =>
            new Date(
              (Number(minutely15.time()) +
                i * minutely15.interval() +
                utcOffsetSeconds) *
                1000
            )
        ),
        rain: minutely15.variables(0)!.valuesArray()!,
      },
      hourly: {
        time: [
          ...Array(
            (Number(hourly.timeEnd()) - Number(hourly.time())) /
              hourly.interval()
          ),
        ].map(
          (_, i) =>
            new Date(
              (Number(hourly.time()) +
                i * hourly.interval() +
                utcOffsetSeconds) *
                1000
            )
        ),
        visibility: hourly.variables(0)!.valuesArray()!,
      },
    };

    // `weatherData` now contains a simple structure with arrays for datetime and weather data
    //   for (let i = 0; i < weatherData.minutely15.time.length; i++) {
    //     console.log(
    //       "time is",
    //       weatherData.minutely15.time[i].toISOString(),
    //       "rain is ",
    //       weatherData.minutely15.rain[i]
    //     );
    //   }

    //   for (let i = 0; i < weatherData.hourly.time.length; i++) {
    //     console.log(
    //       weatherData.hourly.time[i].toISOString(),
    //       "visibility is",
    //       Math.round(weatherData.hourly.visibility[i] / 1609)
    //     );
    //   }

    const rain15MinData = Array.from(weatherData.minutely15.rain);

    const vis3DayData = Array.from(
      weatherData.hourly.visibility.map((vis) => vis / 1609)
    );

    // console.log(rain15MinData);

    return { rain15MinData, vis3DayData };
  } catch {
    console.log("Wasn't able to retrieve data from open-meteo");
    return null;
  }
};
