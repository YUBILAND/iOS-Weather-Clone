import { arrowToDegreeArray } from "./graphConstants";

export const getArrowFromDegree = (degree: number) => {
  const index = Math.round(degree / 45);

  return arrowToDegreeArray[index * 45];
};
