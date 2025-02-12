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
  [require("../assets/images/partlycloudy.png")]: ["partly cloudy"],

  [require("../assets/images/drizzle.png")]: [
    "moderate rain",
    "patchy rain possible",
    "patchy rain nearby",
    "light rain",
    "light freezing rain",
    "moderate rain at times",
  ],

  [require("../assets/images/heavyrain.png")]: [
    "heavy rain",
    "heavy rain at times",
    "moderate or heavy freezing rain",
    "moderate or heavy rain shower",
    "moderate or heavy rain with thunder",
  ],

  [require("../assets/images/snow.png")]: [
    "light snow",
    "moderate snow",
    "heavy snow",
    "blowing snow",
    "moderate or heavy snow showers",
    "blizzard",
  ],

  [require("../assets/images/sun.png")]: ["sunny", "clear"],

  [require("../assets/images/cloudy.png")]: ["overcast", "cloudy"],

  [require("../assets/images/fog.png")]: ["mist", "fog"],
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
