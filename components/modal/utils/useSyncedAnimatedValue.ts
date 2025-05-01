import { SharedValue, useAnimatedReaction } from "react-native-reanimated";

// Checks and compares current shared value to previous shared value
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
