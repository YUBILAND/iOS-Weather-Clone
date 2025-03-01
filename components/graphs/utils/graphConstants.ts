const prefix = "../../../assets/icons/";

type ArrowKey = {
  [key: string]: number;
};

export const arrowToDegreeArray: ArrowKey = {
  0: require(prefix + "arrow-0.png"),
  45: require(prefix + "arrow-45.png"),
  90: require(prefix + "arrow-90.png"),
  135: require(prefix + "arrow-135.png"),
  180: require(prefix + "arrow-180.png"),
  225: require(prefix + "arrow-225.png"),
  270: require(prefix + "arrow-270.png"),
  315: require(prefix + "arrow-315.png"),
  360: require(prefix + "arrow-0.png"),
};
