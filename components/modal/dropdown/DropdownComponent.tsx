// import React, { useState } from "react";
// import { StyleSheet, Text, View, Image } from "react-native";
// import { Dropdown } from "react-native-element-dropdown";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import { colors } from "@/assets/colors/colors";

// const data = [
//   { label: "Temperature", value: "1" },
//   { label: "UV Index", value: "2" },
//   { label: "Wind", value: "3" },
//   { label: "Precipitation", value: "4" },
//   { label: "Feels like", value: "5" },
//   { label: "Humidity", value: "6" },
//   { label: "Visibility", value: "7" },
//   { label: "Atmospheric Pressure", value: "8" },
// ];

// const DropdownComponent = () => {
//   const [value, setValue] = useState(null);
//   const [isFocus, setIsFocus] = useState(false);

//   return (
//     <View style={styles.container}>
//       {/* {renderLabel()} */}
//       <Dropdown
//         style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
//         placeholderStyle={styles.placeholderStyle}
//         selectedTextStyle={styles.selectedTextStyle}
//         itemContainerStyle={styles.itemContainerStyle}
//         iconStyle={styles.iconStyle}
//         containerStyle={styles.containerStyle}
//         itemTextStyle={styles.itemTextStyle}
//         data={data}
//         maxHeight={300}
//         labelField="label"
//         valueField="value"
//         placeholder={""}
//         value={value}
//         showsVerticalScrollIndicator={false}
//         onFocus={() => setIsFocus(true)}
//         onBlur={() => setIsFocus(false)}
//         onChange={(item) => {
//           setValue(item.value);
//           setIsFocus(false);
//         }}
//         renderLeftIcon={() => (
//           // <AntDesign
//           //   style={styles.icon}
//           //   color={isFocus ? "blue" : "black"}
//           //   name="Safety"
//           //   size={20}
//           // />
//           <Image
//             source={require("../../assets/images/cloudy.png")}
//             className="w-6 h-6"
//           />
//         )}
//       />
//     </View>
//   );
// };

// export default DropdownComponent;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: colors.mediumGray,
//     padding: 16,
//     borderRadius: 20,
//     width: 80,
//     position: "relative",
//     overflow: "visible",
//   },
//   dropdown: {
//     position: "absolute",
//     right: 0,
//     width: 200,
//   },
//   icon: {
//     marginRight: 5,
//   },
//   label: {
//     position: "absolute",
//     backgroundColor: colors.mediumGray,
//     right: 40,
//     top: 8,
//     zIndex: 999,
//     paddingHorizontal: 8,
//     fontSize: 14,
//     width: 200,
//   },
//   placeholderStyle: {
//     fontSize: 16,
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//     padding: 0,
//   },
//   iconStyle: {
//     width: 30,
//     height: 30,
//   },

//   itemContainerStyle: {
//     backgroundColor: colors.mediumGray,
//     borderRadius: 40,
//   },
//   containerStyle: {
//     backgroundColor: colors.mediumGray,
//     borderRadius: 20,
//     overflow: "hidden",
//   },
//   itemTextStyle: {
//     backgroundColor: colors.mediumGray,
//     fontWeight: 600,
//     color: "white",
//   },
// });

import React, { useRef, useState } from "react";
import { StyleSheet, Dimensions, View, Image } from "react-native";
import { Dropdown, IDropdownRef } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors } from "@/assets/colors/colors";

const data = [
  { label: "Temperature", value: "1" },
  { label: "UV Index", value: "2" },
  { label: "Wind", value: "3" },
  { label: "Precipitation", value: "4" },
  { label: "Feels like", value: "5" },
  { label: "Humidity", value: "6" },
  { label: "Visibility", value: "7" },
  { label: "Atmospheric Pressure", value: "8" },
];

const { width } = Dimensions.get("window");

const DropdownComponent = () => {
  const [value, setValue] = useState<string>();
  const ref = useRef<IDropdownRef>(null);

  const renderLeftIcon = () => {
    return (
      <Image
        source={require("../../assets/images/cloudy.png")}
        className="w-6 h-6"
      />
    );
  };

  const renderRightIcon = () => {
    return (
      <View style={styles.iconStyle}>
        <AntDesign name="down" size={20} color="white" />
      </View>
    );
  };

  return (
    <Dropdown
      ref={ref}
      style={styles.dropdown}
      containerStyle={styles.containerStyle}
      iconStyle={styles.iconStyle}
      itemContainerStyle={styles.itemContainerStyle}
      itemTextStyle={styles.itemTextStyle}
      selectedTextStyle={styles.selectedTextStyle}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      value={value}
      placeholder={""}
      onChange={(item) => {
        setValue(item.value);
      }}
      onChangeText={() => {}} // Keep search keyword
      renderLeftIcon={renderLeftIcon}
      renderRightIcon={renderRightIcon}
    />
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    width: 80,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.mediumGray,
    paddingLeft: 15,
    paddingRight: 20,
  },
  containerStyle: {
    width: 200,
    marginLeft: -120,
    marginTop: 5,
    borderWidth: 0,
    borderRadius: 20,
    overflow: "hidden",
  },
  iconStyle: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  itemContainerStyle: {
    backgroundColor: colors.mediumGray,
  },
  itemTextStyle: {
    color: "white",
    paddingLeft: 20,
    backgroundColor: colors.mediumGray,
  },
  selectedTextStyle: {
    backgroundColor: colors.mediumGray,
  },
});
