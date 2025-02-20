import axios from "axios";
import { apiKey } from "@/constants/constants";

const forecastEndpoint = (city: string, days: number) =>
  `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${days}&aqi=yes&alerts=no`;

const locationsEndpoint = (city: string) =>
  `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${city}`;

const apiCall = async (endpoint: string) => {
  const options = {
    method: "GET",
    url: endpoint,
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (err) {
    console.log("error", err);
    return null;
  }
};

export const fetchWeatherForecast = (city: string, days: number) => {
  let forecastUrl = forecastEndpoint(city, days);
  return apiCall(forecastUrl);
};

export const fetchLocations = (city: string) => {
  let locationsUrl = locationsEndpoint(city);
  return apiCall(locationsUrl);
};
