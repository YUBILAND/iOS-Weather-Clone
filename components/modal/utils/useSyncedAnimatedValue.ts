import { SharedValue, useAnimatedReaction } from "react-native-reanimated";

export const useSyncAnimatedValue = (
  value: boolean,
  isActive: SharedValue<boolean>
) => {
  useAnimatedReaction(
    () => value,
    (newValue, prevValue) => {
      if (newValue !== prevValue) {
        isActive.value = newValue;
      }
    }
  );
};
