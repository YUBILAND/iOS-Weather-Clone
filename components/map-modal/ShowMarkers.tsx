import React from "react";
import { Marker } from "react-native-maps";
import CustomMarker from "./CustomMarker";
import { getWeatherName } from "@/utils/exampleForecast";
import { useWeatherData } from "@/hooks/useWeatherData";
import { getTemperature } from "@/hooks/useDisplayUnits";

interface ShowMarkersProps {
  weatherScreens: string[];
  activeIndex: number;
  handleMarkerClick: (lat: number, lon: number, index: number) => void;
  markerSize: "big" | "small";
}
const ShowMarkers = ({
  weatherScreens,
  activeIndex,
  handleMarkerClick,
  markerSize,
}: ShowMarkersProps) => {
  const outerColor = "white";
  const innerColor = "rgb(96 165 250)";

  return weatherScreens.map((city, index) => {
    const data = useWeatherData();
    const { location: cityLocation, current: cityCurrent } = data[city];
    return (
      <Marker
        key={index}
        coordinate={{ latitude: cityLocation.lat, longitude: cityLocation.lon }}
      >
        <CustomMarker
          temperature={getTemperature(cityCurrent.temp_c)}
          weatherImageName={getWeatherName(cityCurrent.condition.code)}
          outerColor={outerColor}
          innerColor={innerColor}
          active={activeIndex === index}
          pressMarker={() =>
            handleMarkerClick(cityLocation.lat, cityLocation.lon, index)
          }
          markerSize={markerSize}
        />
      </Marker>
    );
  });
};

export default React.memo(ShowMarkers);
