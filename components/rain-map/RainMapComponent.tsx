import { useWeatherData } from "@/hooks/useWeatherData";
import React, { ForwardedRef, useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import MapView, { PROVIDER_DEFAULT, Region, UrlTile } from "react-native-maps";
import DefaultText from "../atoms/DefaultText";
import { useTileData } from "./utils/useTileData";
import RainTiles from "./RainTiles";

interface RainMapComponentProps {
  cityName: string;
  disableScroll?: boolean;
  initialRegion: Region;
  mapRef?: ForwardedRef<MapView>;
  markers?: React.ReactNode;
  epochArr?: number[] | null;
  visibleTileIndex?: number;
  handleMarkerSize?: (latDelta: number) => void;
}

const RainMapComponent = ({
  cityName,
  disableScroll = false,
  initialRegion,
  mapRef,
  markers,
  epochArr,
  visibleTileIndex,
  handleMarkerSize,
}: RainMapComponentProps) => {
  //   Rerenders MapView from key so first weather data shows
  const displayTileOnMount =
    epochArr && epochArr.length > 0 ? "ready" : "loading";

  const MapViewProps = {
    style: styles.map,
    initialRegion,
    provider: PROVIDER_DEFAULT,
    scrollEnabled: !disableScroll,
    ref: mapRef,
    onRegionChange: (region: Region) => {
      handleMarkerSize ? handleMarkerSize(region.latitudeDelta) : null;
    },
  };

  return (
    <MapView key={displayTileOnMount} {...MapViewProps}>
      {epochArr && visibleTileIndex != undefined && (
        <RainTiles epochArr={epochArr} visibleTileIndex={visibleTileIndex} />
      )}
      {markers}
    </MapView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default RainMapComponent;
