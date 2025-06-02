import { colors } from "@/assets/colors/colors";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { View, Text, Pressable } from "react-native";

interface PlayPauseIconProps {
  handlePress: () => void;
  isPlaying: boolean;
}
const PlayPauseIcon = ({ handlePress, isPlaying }: PlayPauseIconProps) => (
  <Pressable
    onPress={handlePress}
    className="items-center justify-center"
    style={{
      width: 30,
      height: 30,
      borderRadius: 100,
      backgroundColor: colors.bgBlack(0.2),
    }}
  >
    {isPlaying ? (
      <FontAwesome6 name="pause" size={16} />
    ) : (
      <FontAwesome6 name="play" size={16} />
    )}
  </Pressable>
);

export default PlayPauseIcon;
