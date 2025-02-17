import { fetchWeatherForecast } from "@/api/weather";
import {
  Current,
  Forecast,
  Location,
  WeatherData,
} from "@/constants/constants";
import { getData, storeData } from "@/utils/asyncStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ApiState {
  data: {
    [id: string]: WeatherData;
  };
  loading: boolean;
  error: string | null;
}

const initialState: ApiState = {
  data: {},
  loading: true,
  error: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    // setLocation: (state, action: PayloadAction<Location>) => {
    //   state.location = action.payload;
    // },
    // setForecast: (state, action: PayloadAction<Forecast>) => {
    //   state.forecast = action.payload;
    // },
    // setCurrent: (state, action: PayloadAction<Current>) => {
    //   state.current = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWeatherData.fulfilled,
        (
          state,
          action: PayloadAction<Array<{ id: string; data: WeatherData }>>
        ) => {
          state.loading = false;
          action.payload.forEach(({ id, data }) => {
            state.data[id] = data; // Store data under the ID for each city
          });
        }
      )
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const fetchWeatherData = createAsyncThunk(
  "weather/incrementAsync",
  async (cityName: string | undefined, { rejectWithValue }) => {
    let myCity: string[] = await getData("city");
    let forecastDays = 10;
    let finalCityName = null;

    if (cityName) {
      // user input takes priority
      finalCityName = [cityName];
    } else if (myCity.length) {
      // next is whats in local storage
      finalCityName = myCity;
    } else {
      // default city
      finalCityName = ["Tokyo"];
    }

    try {
      let weatherData: { id: string; data: WeatherData }[] = [];

      if (cityName) {
        //want to add to list
        const weather = await fetchWeatherForecast(cityName, forecastDays);
        weatherData = [{ id: cityName, data: weather }];
        await storeData("city", finalCityName, true);
      } else {
        const weatherPromises = finalCityName.map(async (city) => {
          const weather = await fetchWeatherForecast(city, forecastDays);
          return { id: city, data: weather };
        });

        weatherData = await Promise.all(weatherPromises);
        await storeData("city", finalCityName, false);
      }

      // Store the updated list of cities in AsyncStorage

      return weatherData; // Return an array of weather data for each city
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message); // Reject with the error message
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// export const { setLocation, setForecast, setCurrent } = weatherSlice.actions;
export default weatherSlice.reducer;
