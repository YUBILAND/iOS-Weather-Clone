import { useFont } from "@shopify/react-native-skia";
import SpaceMono from "../assets/fonts/SpaceMono-Regular.ttf";

const getFont = () => {
  return useFont(SpaceMono, 12);
};

export default getFont;
