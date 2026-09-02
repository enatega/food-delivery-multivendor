import { ITimingForm } from '@/lib/utils/interfaces/timing.interface';

export const TIMING_INITIAL_VALUE: ITimingForm[] = [
  { day: 'MON', times: [{ startTime: null, endTime: null, maxOrders: 50 }] },
  { day: 'TUE', times: [{ startTime: null, endTime: null, maxOrders: 50 }] },
  { day: 'WED', times: [{ startTime: null, endTime: null, maxOrders: 50 }] },
  { day: 'THU', times: [{ startTime: null, endTime: null, maxOrders: 50 }] },
  { day: 'FRI', times: [{ startTime: null, endTime: null, maxOrders: 50 }] },
  { day: 'SAT', times: [{ startTime: null, endTime: null, maxOrders: 50 }] },
  { day: 'SUN', times: [{ startTime: null, endTime: null, maxOrders: 50 }] },
];
