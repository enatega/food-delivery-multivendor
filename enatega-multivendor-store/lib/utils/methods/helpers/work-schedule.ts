import { WorkSchedule } from "../../interfaces";

export const timeToMinutes = (time: string | string[]) => {
  if (Array.isArray(time)) {
    time = time[0];
  }

  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export default function transformSchedule(
  schedule: WorkSchedule[] | undefined,
  _id: string,
) {
  if (!schedule) return { updateTimingsId: null, openingTimes: [] };

  return {
    updateTimingsId: _id || null,
    openingTimes: schedule.map((daySchedule) => ({
      day: daySchedule.day.toUpperCase().substring(0, 3) || null,
      times:
        daySchedule.times.length === 0 ?
          []
        : daySchedule.times.map((slot) => {
            // Ensure we're working with string format first
            const startTimeStr =
              Array.isArray(slot.startTime) ?
                slot.startTime.join(":")
              : slot.startTime;
            const endTimeStr =
              Array.isArray(slot.endTime) ?
                slot.endTime.join(":")
              : slot.endTime;

            // Ensure proper splitting of hours and minutes
            const [startHours = "00", startMinutes = "00"] =
              startTimeStr.split(":");
            const [endHours = "00", endMinutes = "00"] = endTimeStr.split(":");

            return {
              startTime: [startHours, startMinutes],
              endTime: [endHours, endMinutes],
            };
          }),
    })),
  };
}
