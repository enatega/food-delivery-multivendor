import { TWeekDays } from '../types/days';

export interface ITimeSlot {
  startTime: string | null;
  endTime: string | null;
  maxOrders: number | null;
  _id?: string;
}

export interface ITimingForm {
  day: TWeekDays;
  times: ITimeSlot[];
}

export interface ITimeSlotResponseGQL {
  startTime: string[];
  endTime: string[];
}

export interface ITimingResponseGQL {
  day: TWeekDays;
  times: ITimeSlotResponseGQL[];
}
