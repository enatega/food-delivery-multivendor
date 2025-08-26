import * as Yup from 'yup';
import { getTimeInMinutesFromString } from '../methods/time-in-minute';

// Helper function to convert "HH:mm" to minutes

export const TimingSchema = Yup.array()
  .of(
    Yup.object().shape({
      day: Yup.string().required('Day is required'),
      times: Yup.array()
        .nullable()
        .of(
          Yup.object().shape({
            startTime: Yup.string()
              .nullable()
              .required('Start Time is required')
              .matches(/^\d{2}:\d{2}$/, 'Invalid Start Time format'),
            endTime: Yup.string()
              .nullable()
              .required('End Time is required')
              .matches(/^\d{2}:\d{2}$/, 'Invalid End Time format')
              .test(
                'is-greater',
                'Must be after Start Time',
                function (endTime) {
                  const { startTime } = this.parent;
                  const startMinutes = getTimeInMinutesFromString(startTime);
                  const endMinutes = getTimeInMinutesFromString(endTime);
                  return startMinutes !== null && endMinutes !== null
                    ? endMinutes > startMinutes
                    : true;
                }
              ),
          })
        )
        .test(
          'is-sequential',
          'Time slots must be in sequence',
          function (timeSlots) {
            if (!timeSlots || timeSlots.length === 0) return true; // Allow empty or null

            for (let i = 0; i < timeSlots.length; i++) {
              const { startTime, endTime } = timeSlots[i];

              // Ensure both startTime and endTime are defined
              if (!startTime || !endTime) return false;

              const startMinutes = getTimeInMinutesFromString(startTime);
              const endMinutes = getTimeInMinutesFromString(endTime);

              // Check if the current time slot is valid
              if (endMinutes !== null && startMinutes !== null) {
                if (endMinutes <= startMinutes) {
                  return this.createError({
                    path: `${this.path}[${i}].endTime`,
                    message: 'Must be after Start Time',
                  });
                }
              }

              if (i > 0) {
                const prevEndTime = timeSlots[i - 1].endTime;
                const prevEndMinutes = getTimeInMinutesFromString(prevEndTime);

                if (prevEndMinutes !== null && startMinutes !== null) {
                  if (startMinutes <= prevEndMinutes) {
                    return this.createError({
                      path: `${this.path}[${i}].startTime`,
                      message: 'Must be after the previous End Time',
                    });
                  }
                }
              }
            }
            return true;
          }
        ),
    })
  )
  .required();
