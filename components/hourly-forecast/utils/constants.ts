export type DailyStats = {
  time: string;
  celsius: string | number;
  condition: string;
  fullDate: string;
  code: number;
  is_day: boolean;
  chance_of_rain?: number;
};
