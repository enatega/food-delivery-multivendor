import { TWeekDays } from "../types/restaurant";

export interface WorkSchedule {
  day: TWeekDays;
  times: TimeSlot[];
}

export interface TimeSlot {
  startTime: string[];
  endTime: string[];
}
