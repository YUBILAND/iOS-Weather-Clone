import { TempUnit } from "@/components/location-modal/SettingsDropdown";
import { defaultOtherUnits, OtherUnitsType } from "@/state/settings/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    console.log(value);

    return value ? JSON.parse(value) : []; // should be array
  } catch (error) {
    console.log("Error getting value: ", error);
    return []; // Return empty array in case of an error
  }
};

export const storeData = async (
  key: string,
  cityName: string | string[],
  append: boolean
) => {
  try {
    if (!append) {
      await AsyncStorage.setItem(key, JSON.stringify(cityName));
    } else {
      const existingArray = await getData(key);

      let screens: string[] = existingArray;

      screens.push(cityName[0]);

      await AsyncStorage.setItem(key, JSON.stringify(screens));
    }
  } catch (error) {
    console.log("Error storing value: ", error);
  }
};

export const deleteData = async (
  key: string,
  weatherScreens: string[],
  index: number
) => {
  try {
    // Delete city from weatherScreens

    const newScreens = weatherScreens.filter((_, idx) => idx !== index);

    // Set new weatherscreens array
    await AsyncStorage.setItem(key, JSON.stringify(newScreens));
  } catch (error) {
    console.log("Error deleting value: ", error);
  }
};

export const swapData = async (key: string, weatherScreens: string[]) => {
  console.log("OKAY");
  try {
    await AsyncStorage.setItem(key, JSON.stringify(weatherScreens));
  } catch (error) {
    console.log("Error swapping value: ", error);
  }
};

// Temp Unit Operations
export const storeTempUnit = async (tempUnit: TempUnit) => {
  try {
    await AsyncStorage.setItem("tempUnit", tempUnit);
  } catch (error) {
    console.log(error);
  }
};
export const getTempUnit = async () => {
  try {
    const tempUnit = (await AsyncStorage.getItem(
      "tempUnit"
    )) as TempUnit | null;

    return tempUnit ? tempUnit : "celsius";
  } catch (error) {
    console.log("Error getting temp unit: ", error);
    return "celsius"; // Return empty array in case of an error
  }
};

// Time Unit Operations
export const storeIs12Hr = async (is12Hr: boolean) => {
  try {
    await AsyncStorage.setItem("is12Hr", is12Hr.toString());
  } catch (error) {
    console.log(error);
  }
};
export const getIs12Hr = async () => {
  try {
    const is12Hr = (await AsyncStorage.getItem("is12Hr")) as string | null;

    return is12Hr === "true";
  } catch (error) {
    console.log("Error getting time unit: ", error);
    return false; // Return empty array in case of an error
  }
};

// Other Unit Operations
export const storeOtherUnits = async (otherUnits: OtherUnitsType) => {
  try {
    const existing = await AsyncStorage.getItem("otherUnits");
    const parsed: OtherUnitsType = existing
      ? JSON.parse(existing)
      : defaultOtherUnits;

    const updated = {
      ...parsed,
      ...otherUnits,
    };

    console.log("UPDATED IS", updated);

    await AsyncStorage.setItem("otherUnits", JSON.stringify(updated));
  } catch (error) {
    console.log(error);
  }
};
export const getOtherUnits = async () => {
  try {
    const otherUnits = await AsyncStorage.getItem("otherUnits");
    // console.log("grabbing from storage is", otherUnits);
    return otherUnits ? JSON.parse(otherUnits) : defaultOtherUnits;
  } catch (error) {
    console.log("Error getting other units: ", error);
    return defaultOtherUnits; // Return empty array in case of an error
  }
};
