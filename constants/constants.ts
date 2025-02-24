export const apiKey = "7295bc21a1cd4c43a94220808250802";

// export const weatherImages = {

//   [require("../assets/images/partlycloudy.png")] : ["partly cloudy"],

//   "partly cloudy": require("../assets/images/partlycloudy.png"),

//   "moderate rain": require("../assets/images/drizzle.png"),
//   "patchy rain possible": require("../assets/images/drizzle.png"),
//   "patchy rain nearby": require("../assets/images/drizzle.png"),
//   "light rain": require("../assets/images/drizzle.png"),
//   "light freezing rain": require("../assets/images/drizzle.png"),
//   "moderate rain at times": require("../assets/images/drizzle.png"),

//   "heavy rain": require("../assets/images/heavyrain.png"),
//   "heavy rain at times": require("../assets/images/heavyrain.png"),
//   "moderate or heavy freezing rain": require("../assets/images/heavyrain.png"),
//   "moderate or heavy rain shower": require("../assets/images/heavyrain.png"),
//   "moderate or heavy rain with thunder": require("../assets/images/heavyrain.png"),

//   "light snow": require("../assets/images/snow.png"),
//   "moderate snow": require("../assets/images/snow.png"),
//   "heavy snow": require("../assets/images/snow.png"),
//   "blowing snow": require("../assets/images/snow.png"),
//   "moderate or heavy snow showers": require("../assets/images/snow.png"),
//   blizzard: require("../assets/images/snow.png"),

//   sunny: require("../assets/images/sun.png"),
//   clear: require("../assets/images/sun.png"),

//   overcast: require("../assets/images/cloud.png"),
//   cloudy: require("../assets/images/cloud.png"),

//   mist: require("../assets/images/mist.png"),
//   fog: require("../assets/images/mist.png"),

// };

export const weatherImages = {
  sunrise: ["sunrise"],
  sunset: ["sunset"],

  partlycloudy: ["partly cloudy"],

  drizzle: [
    "moderate rain",
    "patchy rain possible",
    "patchy rain nearby",
    "light rain",
    "light freezing rain",
    "moderate rain at times",
    "patchy light drizzle",
    "light drizzle",
  ],

  heavyrain: [
    "heavy rain",
    "heavy rain at times",
    "moderate or heavy freezing rain",
    "moderate or heavy rain shower",
    "moderate or heavy rain with thunder",
  ],

  snow: [
    "light snow",
    "light snow showers",
    "light snow showers night",
    "moderate snow",
    "heavy snow",
    "blowing snow",
    "moderate or heavy snow showers",
    "blizzard",
    "patchy light snow night",
    "light sleet night",
    "patchy light snow",
    "patchy snow nearby",
    "patchy snow nearby night",
    "patchy moderate snow night",
    "blowing snow night",
    "light snow night",
  ],

  "clear-night": ["sunny night", "clear night"],

  "partlycloudy-night": [
    "overcast night",
    "cloudy night",
    "partly cloudy night",
  ],

  "drizzle-night": [
    "mist night",
    "fog night",
    "moderate rain night",
    "patchy rain nearby night",
    "heavy rain night",
    "light drizzle night",
  ],

  sun: ["sunny", "clear"],

  cloudy: ["overcast", "cloudy"],

  fog: ["mist", "fog"],
};

type WeatherKey = {
  [key: string]: number;
};

export const weatherKey: WeatherKey = {
  sunrise: require("../assets/images/sunrise.png"),
  sunset: require("../assets/images/sunset.png"),
  partlycloudy: require("../assets/images/partlycloudy.png"),
  drizzle: require("../assets/images/drizzle.png"),
  heavyrain: require("../assets/images/heavyrain.png"),
  snow: require("../assets/images/snow.png"),
  "clear-night": require("../assets/images/clear-night.png"),
  "partlycloudy-night": require("../assets/images/partlycloudy-night.png"),
  "drizzle-night": require("../assets/images/drizzle-night.png"),
  sun: require("../assets/images/sun.png"),
  cloudy: require("../assets/images/cloudy.png"),
  fog: require("../assets/images/fog.png"),
};

export type WeatherType =
  | "partly cloudy"
  | "moderate rain"
  | "patchy rain possible"
  | "patchy rain nearby"
  | "light rain"
  | "moderate rain at times"
  | "heavy rain"
  | "heavy rain at times"
  | "moderate or heavy freezing rain"
  | "moderate or heavy rain shower"
  | "moderate or heavy rain with thunder"
  | "light snow"
  | "moderate snow"
  | "heavy snow"
  | "blowing snow"
  | "blizzard"
  | "other"
  | "sunny"
  | "clear"
  | "overcast"
  | "cloudy"
  | "mist"
  | "fog";

export type WeatherData = {
  current: Current;
  location: Location;
  forecast: Forecast;
};

export type Current = {
  temp_c: string;
  wind_kph: string;
  humidity: string;
  condition: Condition;
  is_day: boolean;
  air_quality: {
    o3: number;
    pm2_5: number;
  };
  uv: number;
};

export type Condition = {
  text: WeatherType;
};

export type Location = {
  country: string;
  id: number;
  name: string;
  tz_id: string; // region / city
};

export type Forecast = {
  forecastday: ForecastObject[];
};

export type ForecastObject = {
  day: {
    maxtemp_c: string;
    mintemp_c: string;
    avgtemp_c: string;
    condition: Condition;
  };
  date: string;
  astro: {
    sunrise: string;
    sunset: string;
  };
  hour: HourObject[];
};

export type HourObject = WeatherData["current"] & {
  time: string;
  chance_of_rain: number;
};
