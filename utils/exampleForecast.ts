import { ImageSourcePropType } from "react-native";

export const days: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// async function getData() {
//   const url = "https://www.weatherapi.com/docs/weather_conditions.json";
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`Response status: ${response.status}`);
//     }

//     const json = await response.json();
//     // console.log(json);
//     return json;
//   } catch (error: any) {
//     console.error(error.message);
//     return null;
//   }
// }

// async function fetchAndHandleData() {
//   const data = await getData();
//   if (data) {
//     const codes = data.map((item: { code: any }) => item.code);
//   } else {
//     console.log("Error: Data could not be fetched.");
//   }
// }

// fetchAndHandleData();

// const dayCodes = {
//   clear: [1000],
//   partlyCloudy: [1003],
//   cloudy: [1006, 1009],
//   foggy: [1030, 1135, 1147],
//   rainy: [
//     1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246,
//   ],
//   snowy: [1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258],
//   sleet: [1069, 1204, 1207, 1249, 1252],
//   freezingRain: [1072, 1168, 1171, 1198, 1201],
//   icePellets: [1237, 1261, 1264],
//   thunderstorms: [1087, 1273, 1276, 1279, 1282],
// };

const weatherCodes = {
  clear: [1000],
  partlyCloudy: [1003],
  cloudy: [1006, 1009],
  foggy: [1030, 1135, 1147],
  // lightRain: [1063, 1150, 1153, 1180, 1183, 1240],
  // moderateRain: [1186, 1189, 1243],
  // heavyRain: [1192, 1195, 1246],
  rainy: [
    1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246,
  ],
  snowy: [1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258],
  sleet: [1069, 1204, 1207, 1249, 1252],
  freezingRain: [1072, 1168, 1171, 1198, 1201],
  icePellets: [1237, 1261, 1264],
  thunderstorms: [1087, 1273, 1276, 1279, 1282],
};

const imageLocation = "../assets/images/";
export const dayCodeToImg: { [key: string]: ImageSourcePropType } = {
  clear: require(imageLocation + "sun" + ".png"),
  partlyCloudy: require(imageLocation + "partlycloudy" + ".png"),
  cloudy: require(imageLocation + "cloudy" + ".png"),
  foggy: require(imageLocation + "mist" + ".png"),
  rainy: require(imageLocation + "drizzle" + ".png"),
  snowy: require(imageLocation + "snow" + ".png"),
  sleet: require(imageLocation + "snow" + ".png"),
  freezingRain: require(imageLocation + "heavyrain" + ".png"),
  icePellets: require(imageLocation + "heavyrain" + ".png"),
  thunderstorms: require(imageLocation + "heavyrain" + ".png"),
};
const nightCodeToImg: { [key: string]: ImageSourcePropType } = {
  clear: require("../assets/images/clear-night.png"),
  partlyCloudy: require("../assets/images/partlycloudy-night.png"),
  cloudy: require("../assets/images/cloud.png"),
  foggy: require("../assets/images/mist.png"),
  rainy: require("../assets/images/drizzle-night.png"),
  snowy: require("../assets/images/snow.png"),
  sleet: require("../assets/images/snow.png"),
  freezingRain: require("../assets/images/heavyrain.png"),
  icePellets: require("../assets/images/heavyrain.png"),
  thunderstorms: require("../assets/images/heavyrain.png"),
};

export const getWeatherName = (weatherCode: number) => {
  if (weatherCode === 1) {
    return "sunrise";
  }
  if (weatherCode === 0) {
    return "sunset";
  }
  for (const [weatherName, codes] of Object.entries(weatherCodes)) {
    if (codes.includes(weatherCode)) {
      return weatherName;
    }
  }
  return "clear"; // Fallback image
};
export const weatherNameToImage = (weatherName: string, isDay: boolean) => {
  if (weatherName === "sunrise") {
    return require("../assets/images/sunrise.png");
  }
  if (weatherName === "sunset") {
    return require("../assets/images/sunset.png");
  }
  return isDay ? dayCodeToImg[weatherName] : nightCodeToImg[weatherName];
};

const weatherImageLocation = "../assets/weather-image/";
const dayCardBg: { [key: string]: ImageSourcePropType } = {
  clear: require(weatherImageLocation + "clear" + ".png"),
  partlyCloudy: require(weatherImageLocation + "partly" + ".png"),
  cloudy: require(weatherImageLocation + "cloudy" + ".png"),
  foggy: require(weatherImageLocation + "foggy" + ".png"),
  // lightRain: require(weatherImageLocation + "light-rain" + ".png"),
  // moderateRain: require(weatherImageLocation + "rainy" + ".png"),
  // heavyRain: require(weatherImageLocation + "rainy" + ".png"),
  rainy: require(weatherImageLocation + "rainy" + ".png"),

  snowy: require(weatherImageLocation + "snowy" + ".png"),
  sleet: require(weatherImageLocation + "sleet" + ".png"),
  freezingRain: require(weatherImageLocation + "sleet" + ".png"),
  icePellets: require(weatherImageLocation + "sleet" + ".png"),
  thunderstorms: require(weatherImageLocation + "thunder" + ".png"),
};
const nightCardBg: { [key: string]: ImageSourcePropType } = {
  clear: require(weatherImageLocation + "clear-night" + ".png"),
  partlyCloudy: require(weatherImageLocation + "partly-night" + ".png"),
  cloudy: require(weatherImageLocation + "cloudy-night" + ".png"),
  foggy: require(weatherImageLocation + "foggy-night" + ".png"),
  rainy: require(weatherImageLocation + "rainy-night" + ".png"),
  snowy: require(weatherImageLocation + "snowy-night" + ".png"),
  sleet: require(weatherImageLocation + "snowy-night" + ".png"),
  freezingRain: require(weatherImageLocation + "snowy-night" + ".png"),
  icePellets: require(weatherImageLocation + "snowy-night" + ".png"),
  thunderstorms: require(weatherImageLocation + "thunder-night" + ".png"),
};

export const weatherNameToCardBg = (weatherName: string, isDay: boolean) => {
  return isDay ? dayCardBg[weatherName] : nightCardBg[weatherName];
};
