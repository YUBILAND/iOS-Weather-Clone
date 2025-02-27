import { militaryHour } from "@/hooks/hooks";

//  convert 60 tick time to 100 tick x axis
export function regularTimeOnXAxis(timeString: string) {
  const minutePortion = parseInt(timeString.split(":")[1].split(" ")[0]);
  const timeOnXAxis = militaryHour(timeString) + minutePortion / 60;
  return timeOnXAxis;
}
