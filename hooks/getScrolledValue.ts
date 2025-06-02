import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { runOnUI, useSharedValue } from "react-native-reanimated";

export const getScrolledValue = () => {
  const scrolledDownShared = useSharedValue(0);
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollYDistance = event.nativeEvent.contentOffset.y;
    runOnUI(() => (scrolledDownShared.value = scrollYDistance))();
  };

  return { scrolledDownShared, handleScroll };
};
