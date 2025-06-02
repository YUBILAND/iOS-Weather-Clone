import { fetchWeatherForecast } from "@/api/weather";
import { getNextHourRain } from "@/components/weather-screen/utils/getNextHourRain";
import { WeatherData } from "@/constants/constants";
import { useWeatherData } from "@/hooks/useWeatherData";
import { getData, storeData } from "@/utils/asyncStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type ExtraData = {
  rain15MinData: number[];
  vis3DayData: number[];
};

interface ApiState {
  data: {
    [id: string]: WeatherData;
  };
  extraData: {
    [id: string]: { rainData: number[]; visData: number[] };
  };
  loading: boolean;
  error: string | null;
  extraLoading: boolean;
  extraError: string | null;
}

const initialState: ApiState = {
  data: {},
  extraData: {},
  loading: true,
  error: null,
  extraLoading: true,
  extraError: null,
};

type WeatherDataAction = PayloadAction<
  Array<{ id: string; data: WeatherData }>
>;

type ExtraDataAction = PayloadAction<
  Array<{
    id: string;
    extraData: ExtraData;
  }>
>;

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherDataArr.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWeatherDataArr.fulfilled,
        (state, action: WeatherDataAction) => {
          state.loading = false;
          action.payload.forEach(({ id, data }) => {
            state.data[id] = data; // Store data under the ID for each city
          });
        }
      )
      .addCase(fetchWeatherDataArr.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchExtraDataArr.pending, (state) => {
        state.extraLoading = true;
        state.extraError = null;
      })
      .addCase(
        fetchExtraDataArr.fulfilled,
        (state, action: ExtraDataAction) => {
          state.extraLoading = false;
          action.payload.forEach(({ id, extraData }) => {
            state.extraData[id] = {
              rainData: extraData.rain15MinData,
              visData: extraData.vis3DayData,
            }; // Store data under the ID for each city
          });
        }
      )
      .addCase(fetchExtraDataArr.rejected, (state, action) => {
        state.extraLoading = false;
        state.extraError = action.payload as string;
      });
  },
});

export const fetchWeatherScreens = createAsyncThunk(
  "weather/fetchWeatherScreens",
  async (_, { rejectWithValue }) => {
    try {
      // Fetch list of cities from local storage
      let storedCities: string[] = await getData("city");
      const cityList = storedCities.length ? storedCities : ["Tokyo"];
      return cityList; // Return an array of weather data for each city
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message); // Reject with the error message
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const appendCity = createAsyncThunk(
  "weather/appendCity",
  async (cityName: string, { rejectWithValue }) => {
    try {
      // Fetch list of cities from local storage
      await storeData("city", [cityName], true);
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message); // Reject with the error message
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchWeatherDataArr = createAsyncThunk(
  "weather/incrementAsync",
  async (
    {
      cityName,
      forecastDays = 3,
    }: { cityName?: string; forecastDays?: number } = {},
    { dispatch, rejectWithValue }
  ) => {
    try {
      if (cityName) {
        // Append user-provided city to local storage
        await dispatch(appendCity(cityName));
      }
      // Fetch list of cities from local storage
      const cityList = await dispatch(fetchWeatherScreens()).unwrap();

      // Get weather data arr
      const weatherPromises = cityList.map(async (city) => {
        const weather = await fetchWeatherForecast(city, forecastDays);
        return { id: city, data: weather };
      });

      const weatherData = await Promise.all(weatherPromises);
      // await storeData("city", cityList, false);

      // if (cityName) {
      //   // Append user-provided city to local storage
      //   dispatch(appendCity(cityName))

      //   const cityList = await dispatch(fetchWeatherScreens()).unwrap();

      //   // Get weather data arr
      //   const weather = await fetchWeatherForecast(cityName, forecastDays);
      //   weatherData = [{ id: cityName, data: weather }];

      // } else {
      //   // Fetch list of cities from local storage
      //   const cityList = await dispatch(fetchWeatherScreens()).unwrap();

      //   const weatherPromises = cityList.map(async (city) => {
      //     const weather = await fetchWeatherForecast(city, forecastDays);
      //     return { id: city, data: weather };
      //   });

      //   weatherData = await Promise.all(weatherPromises);
      //   await storeData("city", cityList, false);
      // }

      return weatherData; // Return an array of weather data for each city
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message); // Reject with the error message
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchExtraDataArr = createAsyncThunk(
  "weather/fetchExtraDataArr",
  async (weatherScreens: string[], { getState, rejectWithValue }) => {
    const data = (getState() as RootState).weather.data;

    try {
      const extraDataArr = await Promise.all(
        weatherScreens.map(async (city) => {
          const cityData = data[city];
          const cityLat = cityData.location.lat;
          const cityLon = cityData.location.lon;

          const extraData = await getNextHourRain(cityLat, cityLon);

          if (!extraData) throw new Error(`Failed to fetch for ${city}`);

          return { id: city, extraData: extraData };
        })
      );

      return extraDataArr;
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message); // Reject with the error message
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// export const fetchWeatherDataArr = createAsyncThunk(
//   "weather/incrementAsync",
//   async (
//     {
//       cityName,
//       forecastDays = 3,
//     }: { cityName?: string; forecastDays?: number } = {},
//     { rejectWithValue }
//   ) => {
//     try {
//       let weatherData: { id: string; data: WeatherData }[] = [];

//       if (cityName) {
//         // Append user-provided city to local storage
//         const weather = await fetchWeatherForecast(cityName, forecastDays);
//         weatherData = [{ id: cityName, data: weather }];
//         await storeData("city", [cityName], true);
//       } else {
//         // Fetch list of cities from local storage
//         let storedCities: string[] = await getData("city");
//         let cityList = null;
//         if (storedCities.length) {
//           // next is whats in local storage
//           cityList = storedCities;
//         } else {
//           // default city
//           cityList = ["Tokyo"];
//         }

//         const weatherPromises = cityList.map(async (city) => {
//           const weather = await fetchWeatherForecast(city, forecastDays);
//           return { id: city, data: weather };
//         });

//         weatherData = await Promise.all(weatherPromises);
//         await storeData("city", cityList, false);
//       }

//       // Store the updated list of cities in AsyncStorage

//       return weatherData; // Return an array of weather data for each city
//     } catch (error: unknown) {
//       if (error instanceof Error) return rejectWithValue(error.message); // Reject with the error message
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// export const { setLocation, setForecast, setCurrent } = weatherSlice.actions;
export default weatherSlice.reducer;
