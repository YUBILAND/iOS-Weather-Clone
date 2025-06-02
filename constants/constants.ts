import { CompassDirections } from "@/components/wind-forecast/utils/windConstants";

export const apiKey = "7295bc21a1cd4c43a94220808250802";

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
    "patchy light rain",
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
    "moderate or heavy sleet",
    "light sleet",
    "moderate or heavy sleet night",
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
    "light rain night",
    "patchy light rain night",
  ],

  sun: ["sunny", "clear"],

  cloudy: ["overcast", "cloudy"],

  fog: ["mist", "fog"],

  windy: ["windy", "windy night"],
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
  windy: require("../assets/images/windy.png"),
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
  | "fog"
  | "windy";

export type WeatherData = {
  current: Current;
  location: Location;
  forecast: Forecast;
};

export type Current = {
  temp_c: number;
  temp_f: number;
  wind_mph: number;
  humidity: number;
  condition: Condition;
  is_day: boolean;
  air_quality: {
    o3: number;
    pm2_5: number;
  };
  uv: number;
  wind_dir: CompassDirections;
  wind_degree: number;
  windchill_c: number;
  precip_in: number;
  gust_mph: number;
  vis_miles: number;
  pressure_in: number;
  dewpoint_c: number;
};

export type Condition = {
  text: WeatherType;
  code: number;
};

export type Location = {
  country: string;
  id: number;
  name: string;
  tz_id: string; // region / city
  localtime: string;
  lat: number;
  lon: number;
};

export type Forecast = {
  forecastday: ForecastObject[];
};

export type ForecastObject = {
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    condition: Condition;
    maxwind_mph: number;
    maxwind_kph: number;
    totalprecip_in: number;
  };
  date: string;
  astro: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    moon_illumination: string;
  };
  hour: HourObject[];
};

export type HourObject = Omit<WeatherData["current"], "air_quality"> & {
  time: string;
  chance_of_rain: number;
  temp_c: number;
  temp_f: number;
  wind_mph: number;
  humidity: number;
  uv: number;
  wind_degree: number;
  windchill_c: number;
  precip_in: number;
  gust_mph: number;
  vis_miles: number;
  vis: number;
};

export interface GraphKeyType {
  temp_c: number;
  temp_f: number;
  chance_of_rain: number;
  uv: number;
  wind_mph: number;
  gust_mph: number;
  wind_degree: number;
  windchill_c: number;
  precip_in: number;
  vis_miles: number;
  humidity: number;
  pressure_in: number;
  dewpoint_c: number;
}

export interface ChartPressStateNames {
  celsius: number;
  chanceOfRain: number;
  uvIndex: number;
  windSpeed: number;
  windChill: number;
  precip: number;
  vis: number;
  humidity: number;
  airPressure: number;
}

export const weekday = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
