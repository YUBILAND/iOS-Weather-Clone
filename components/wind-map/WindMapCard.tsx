import { RootState } from "@/state/store";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { EyeIcon } from "react-native-heroicons/outline";
import { useSelector } from "react-redux";
import CardBottomText from "../atoms/CardBottomText";
import CardStat from "../atoms/CardStat";
import CardTitle from "../atoms/CardTitle";
import OpacityCard from "../atoms/OpacityCard";
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";

interface WindMapCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
}
const initialRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const WindMapCard = ({ cityName, showModal, iconSize }: WindMapCardProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { current } = data[cityName];

  const currentVisibility = Math.round(current.vis_miles).toString() + " mi";

  const message = "random message";

  return (
    <OpacityCard>
      <Pressable
        className="px-4 gap-y-2 h-full"
        onPress={() => {
          showModal();
        }}
      >
        <CardTitle
          title={"Wind Map"}
          icon={<EyeIcon size={iconSize} color={"white"} />}
        />

        <View style={styles.container}>
          {/* <MapView
            style={styles.map}
            initialRegion={initialRegion}
            provider={PROVIDER_DEFAULT}
          /> */}
        </View>
      </Pressable>
    </OpacityCard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default React.memo(WindMapCard);
