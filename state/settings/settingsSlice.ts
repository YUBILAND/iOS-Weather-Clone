import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Settings {
  americanTime: boolean;
}

const initialState: Settings = {
  americanTime: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setAmericanTime: (state, action: PayloadAction<boolean>) => {
      state.americanTime = action.payload;
    },
  },
});

export default settingsSlice.reducer;
