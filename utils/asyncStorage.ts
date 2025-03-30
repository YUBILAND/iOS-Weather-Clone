import AsyncStorage from "@react-native-async-storage/async-storage";

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);

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
  try {
    await AsyncStorage.setItem(key, JSON.stringify(weatherScreens));
  } catch (error) {
    console.log("Error swapping value: ", error);
  }
};
