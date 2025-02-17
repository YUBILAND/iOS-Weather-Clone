import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { fetchWeatherData } from "@/state/api/apiSlice";

const Test = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { location, forecast, current, loading, error } = useSelector(
    (state: RootState) => state.weather
  );

  // Fetch the weather data when the component mounts
  useEffect(() => {
    dispatch(fetchWeatherData());
  }, [dispatch]);

  // Show a loading spinner if the data is being fetched
  if (loading) {
    return <Text>Loading...</Text>;
  }

  // Show an error message if the API call fails
  if (error) {
    return <Text>Error: {error as string}</Text>;
  }
  return (
    <View>
      <Text>{location?.name}</Text>
    </View>
  );
};

export default Test;
