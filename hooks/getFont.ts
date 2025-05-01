import { useFont } from "@shopify/react-native-skia";
import SpaceMono from "../assets/fonts/SpaceMono-Regular.ttf";
import Roboto from "../assets/fonts/Roboto-Regular.ttf";

const getFont = (size = 12) => {
  return useFont(Roboto, size);

  return useFont(SpaceMono, size);
};

export default getFont;
