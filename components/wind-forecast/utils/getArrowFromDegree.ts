import { arrowToDegreeArray } from "./windConstants";

export const getArrowFromDegree = (degree: number) => {
  const index = Math.round(degree / 45);

  return arrowToDegreeArray[index * 45];
};
