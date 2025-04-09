import { TempUnit } from "@/components/location-modal/SettingsDropdown";
import { getIs12Hr, getOtherUnits, getTempUnit } from "@/utils/asyncStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { defaultOtherUnits, OtherUnitsType } from "./constants";

interface Settings {
  tempUnit: TempUnit;
  is12Hr: boolean;
  otherUnits: OtherUnitsType;
}

const initialState: Settings = {
  tempUnit: "celsius",
  is12Hr: false,
  otherUnits: defaultOtherUnits,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTempUnit: (state, action: PayloadAction<TempUnit>) => {
      state.tempUnit = action.payload;
    },
    setIs12Hr: (state, action: PayloadAction<boolean>) => {
      state.is12Hr = action.payload;
    },
    setOtherUnits: (state, action: PayloadAction<OtherUnitsType>) => {
      state.otherUnits = {
        ...state.otherUnits,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTempUnit.fulfilled, (state, action) => {
        // When the async operation succeeds, update the state with the fetched value
        state.tempUnit = action.payload;
      })
      .addCase(fetchTempUnit.rejected, (state, action) => {
        // Optionally handle rejected case (e.g., show an error message)
        console.error(action.payload);
      })
      .addCase(fetchIs12Hr.fulfilled, (state, action) => {
        // When the async operation succeeds, update the state with the fetched value
        state.is12Hr = action.payload;
      })
      .addCase(fetchIs12Hr.rejected, (state, action) => {
        // Optionally handle rejected case (e.g., show an error message)
        console.error(action.payload);
      })
      .addCase(fetchOtherUnits.fulfilled, (state, action) => {
        // When the async operation succeeds, update the state with the fetched value
        state.otherUnits = action.payload;
      })
      .addCase(fetchOtherUnits.rejected, (state, action) => {
        // Optionally handle rejected case (e.g., show an error message)
        console.error(action.payload);
      });
  },
});

export const fetchTempUnit = createAsyncThunk(
  "settings/fetchTempUnit",
  async (_, { rejectWithValue }) => {
    try {
      // Assuming getTempUnit is a function that fetches the unit from AsyncStorage or elsewhere
      let userTempUnit: TempUnit = await getTempUnit();
      return userTempUnit; // Successfully fetched data
    } catch (error) {
      return rejectWithValue("Failed to fetch temp unit"); // Handle errors
    }
  }
);

export const fetchIs12Hr = createAsyncThunk(
  "settings/fetchTimeUnit",
  async (_, { rejectWithValue }) => {
    try {
      // Assuming getTempUnit is a function that fetches the unit from AsyncStorage or elsewhere
      let userIs12Hr: boolean = await getIs12Hr();
      return userIs12Hr; // Successfully fetched data
    } catch (error) {
      return rejectWithValue("Failed to fetch time unit"); // Handle errors
    }
  }
);

export const fetchOtherUnits = createAsyncThunk(
  "settings/fetchOtherUnits",
  async (_, { rejectWithValue }) => {
    try {
      // Assuming getTempUnit is a function that fetches the unit from AsyncStorage or elsewhere
      let userOtherUnits: OtherUnitsType = await getOtherUnits();
      return userOtherUnits; // Successfully fetched data
    } catch (error) {
      return rejectWithValue("Failed to fetch other unit"); // Handle errors
    }
  }
);

export const { setTempUnit, setIs12Hr, setOtherUnits } = settingsSlice.actions;

export default settingsSlice.reducer;
