const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

// Get the default config from Expo
const config = getDefaultConfig(__dirname);

// Apply NativeWind and reanimated configurations
const nativeWindConfig = withNativeWind(config, { input: "./global.css" });
const finalConfig = wrapWithReanimatedMetroConfig(nativeWindConfig);

module.exports = finalConfig;
