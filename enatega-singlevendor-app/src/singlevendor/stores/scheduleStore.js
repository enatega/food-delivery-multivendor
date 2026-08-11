import { create } from 'zustand';

const useScheduleStore = create((set) => ({
  selectedSchedule: null,
  
  setSchedule: (schedule) => set({ selectedSchedule: schedule }),
  
  clearSchedule: () => set({ selectedSchedule: null }),
}));

export default useScheduleStore;
