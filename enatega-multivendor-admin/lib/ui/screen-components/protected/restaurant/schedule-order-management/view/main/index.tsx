/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
// Core
import { Form, Formik } from 'formik';
import { useContext, useMemo, useState, useEffect } from 'react';

// Interface and Types
import { TWeekDays } from '@/lib/utils/types/days';

// Components
import CustomButton from '@/lib/ui/useable-components/button';
import { InputSwitch } from 'primereact/inputswitch';
import { Dropdown } from 'primereact/dropdown';
import { ITimeSlot } from '@/lib/utils/interfaces/timing.interface';

// Context
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

// Toast
import useToast from '@/lib/hooks/useToast';

// GraphQL
import { useQuery, useMutation } from '@apollo/client';
import { useTranslations } from 'next-intl';
import { GET_RESTAURANT_SCHEDULE } from '@/lib/api/graphql/queries/restaurants';
import { UPDATE_RESTAURANT_SCHEDULE } from '@/lib/api/graphql/mutations/restaurant';

// Loaders
import { ProgressSpinner } from 'primereact/progressspinner';
import ErrorState from '@/lib/ui/useable-components/error-state';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

interface IScheduleForm {
  day: TWeekDays;
  times: ITimeSlot[];
  _id?: string;
  isOpen: boolean;
}

const SCHEDULE_INITIAL_VALUE: IScheduleForm[] = [
  {
    day: 'MON',
    times: [{ startTime: '09:00', endTime: '17:00', maxOrders: 50 }],
    isOpen: true,
  },
  {
    day: 'TUE',
    times: [{ startTime: '09:00', endTime: '17:00', maxOrders: 50 }],
    isOpen: true,
  },
  {
    day: 'WED',
    times: [{ startTime: '09:00', endTime: '17:00', maxOrders: 50 }],
    isOpen: true,
  },
  {
    day: 'THU',
    times: [{ startTime: '09:00', endTime: '17:00', maxOrders: 50 }],
    isOpen: true,
  },
  {
    day: 'FRI',
    times: [{ startTime: '09:00', endTime: '17:00', maxOrders: 50 }],
    isOpen: true,
  },
  {
    day: 'SAT',
    times: [{ startTime: '09:00', endTime: '17:00', maxOrders: 50 }],
    isOpen: true,
  },
  { day: 'SUN', times: [], isOpen: false },
];

const ScheduleOrderMain = () => {
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const restaurantId = restaurantLayoutContextData?.restaurantId || '';

  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();

  const { data, loading, error, refetch } = useQuery(GET_RESTAURANT_SCHEDULE, {
    fetchPolicy: 'cache-and-network',
    variables: { restaurantId },
    skip: !restaurantId,
  });

  const [mutateSchedule, { loading: mutationLoading }] = useMutation(
    UPDATE_RESTAURANT_SCHEDULE,
    {
      onCompleted: () => {
        showToast({
          type: 'success',
          title: t('Success'),
          message: t('Schedule updated successfully'),
          duration: 3000,
        });
        refetch();
      },
      onError: (err) => {
        console.log(err.graphQLErrors);
        const message =
          err.graphQLErrors?.[0]?.message ||
          err.message ||
          t('Something went wrong');
        showToast({
          type: 'error',
          title: t('Error'),
          message: message,
          duration: 3000,
        });
      },
    }
  );

  // Generate time options for dropdowns (30-minute intervals)
  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourStr = hour.toString().padStart(2, '0');
        const minuteStr = minute.toString().padStart(2, '0');
        const time = `${hourStr}:${minuteStr}`;
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const label = `${displayHour}:${minuteStr} ${period}`;
        options.push({ label, value: time });
      }
    }
    return options;
  }, []);

  // Generate max orders options
  const maxOrdersOptions = useMemo(() => {
    const options = [];
    for (let i = 10; i <= 100; i += 10) {
      options.push({ label: i.toString(), value: i });
    }
    return options;
  }, []);

  const [initialValues, setInitialValues] = useState<IScheduleForm[]>(
    SCHEDULE_INITIAL_VALUE
  );

  useEffect(() => {
    if (data?.getRestaurantSchedule) {
      const schedule = data.getRestaurantSchedule.map((daySchedule: any) => ({
        day: daySchedule.day,
        _id: daySchedule._id,
        isOpen: daySchedule.isOpen,
        times: daySchedule.times.map((time: any) => ({
          startTime: time.startTime[0],
          endTime: time.endTime[0],
          maxOrders: time.maxOrder,
          _id: time._id,
        })),
      }));
      setInitialValues(schedule);
    }
  }, [data]);

  const handleRemoveSlot = async (
    dayId: string,
    slotId: string,
    dayIndex: number,
    timeIndex: number,
    setFieldValue: any,
    values: any
  ) => {
    // Optimistic UI update or wait for API?
    // User requested specific API call for delete.
    if (!slotId) {
      // If it's a new unsaved slot (no ID), just remove locally
      const prev = [...values[dayIndex].times];
      prev.splice(timeIndex, 1);
      setFieldValue(`${dayIndex}.times`, prev);
      return;
    }

    try {
      await mutateSchedule({
        variables: {
          id: restaurantId,
          scheduleTimings: [
            {
              _id: dayId, // Day object ID
              times: [
                {
                  _id: slotId, // Slot ID to delete
                  startTime: [],
                  endTime: [],
                  maxOrder: null,
                },
              ],
            },
          ],
        },
      });
      // Correctly handled by onCompleted refetch, but we might want to update local state too if refetch is slow?
      // Refetch is safer to ensure sync.
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSlot = async (
    dayId: string,
    dayIndex: number,
    values: IScheduleForm[]
  ) => {
    try {
      // 1. Prepare current times for the specific day
      const times = values[dayIndex].times.map((time) => ({
        startTime: [time.startTime],
        endTime: [time.endTime],
        maxOrder: time.maxOrders,
        _id: time._id, // Include existing IDs
      }));

      // 2. Add new default slot
      times.push({
        startTime: ['09:00'], // Default start
        endTime: ['17:00'], // Default end
        maxOrder: 50, // Default max orders
        _id: undefined, // New slot has no ID yet
      });

      // 3. Prepare payload for the *specific day only* (or all days if required by backend?)
      // The user prompt implies sending a list of scheduleTimings.
      // Safest is to send the update for THIS day as a single item in the array.
      // Or should we send all days?
      // Based on "Save" logic we send all. But for "+" on one day, maybe just that day is enough?
      // The prompt example for "Save" showed one day object.
      // I will send only the modified day to be efficient and match the "delete" pattern which targetted specific IDs.

      const payload = [
        {
          _id: dayId, // ID of the day
          isOpen: values[dayIndex].isOpen,
          times: times,
        },
      ];

      await mutateSchedule({
        variables: {
          id: restaurantId,
          scheduleTimings: payload,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Form Submission (Save Button)
  const handleSubmit = (values: IScheduleForm[]) => {
    const payload = values.map((day) => ({
      _id: day._id,
      isOpen: day.isOpen,
      times: day.times.map((time) => ({
        _id: time._id,
        startTime: [time.startTime],
        endTime: [time.endTime],
        maxOrder: time.maxOrders,
      })),
    }));

    mutateSchedule({
      variables: {
        id: restaurantId,
        scheduleTimings: payload,
      },
    });
  };

  if (loading && !data) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <ProgressSpinner strokeWidth="3" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title={t('Error')}
        message={
          error?.graphQLErrors?.[0]?.message ||
          error?.message ||
          t('Something went wrong')
        }
        onRetry={refetch}
        retryLabel={t('Retry')}
        loading={loading}
      />
    );
  }

  return (
    <div className="mt-7">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, handleSubmit, dirty }) => (
          <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Table */}
            <div
              className={`overflow-x-auto border border-b-none border-gray-300 rounded-lg ${mutationLoading ? 'pointer-events-none opacity-50' : ''}`}
            >
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className=" border-b border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      {t('Day')}
                    </th>
                    <th className=" border-b border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      {t('Start time')}
                    </th>
                    <th className=" border-b border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      {t('End time')}
                    </th>
                    <th className=" border-b border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      {t('Max orders')}
                    </th>
                    <th className=" border-b border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      {t('Action')}
                    </th>
                    <th className="border-b border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      {t('Day Off')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {values?.map((value, dayIndex) => {
                    return (
                      <>
                        {value.isOpen && value.times?.length > 0 ? (
                          value.times.map(
                            (time: ITimeSlot, timeIndex: number) => (
                              <tr
                                key={`${dayIndex}-${timeIndex}`}
                                className="border-b border-gray-300"
                              >
                                {timeIndex === 0 ? (
                                  <td
                                    className="border-r border-gray-300 px-4 py-3 align-top"
                                    rowSpan={value.times.length}
                                  >
                                    <span className="text-sm font-medium">
                                      {t(value.day)}
                                    </span>
                                  </td>
                                ) : null}
                                <td className=" px-4 py-3">
                                  <Dropdown
                                    value={time.startTime}
                                    options={timeOptions}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `${dayIndex}.times[${timeIndex}].startTime`,
                                        e.value
                                      )
                                    }
                                    placeholder={t('Select time')}
                                    className="w-32 border border-gray-300 rounded"
                                    disabled={mutationLoading}
                                  />
                                </td>
                                <td className=" px-4 py-3">
                                  <Dropdown
                                    value={time.endTime}
                                    options={timeOptions}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `${dayIndex}.times[${timeIndex}].endTime`,
                                        e.value
                                      )
                                    }
                                    placeholder={t('Select time')}
                                    className="w-32 border border-gray-300 rounded"
                                    disabled={mutationLoading}
                                  />
                                </td>
                                <td className=" px-4 py-3">
                                  <Dropdown
                                    value={time.maxOrders}
                                    options={maxOrdersOptions}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `${dayIndex}.times[${timeIndex}].maxOrders`,
                                        e.value
                                      )
                                    }
                                    placeholder={t('Select')}
                                    className="w-24 border border-gray-300 rounded"
                                    disabled={mutationLoading}
                                  />
                                </td>
                                <td className=" px-4 py-3">
                                  {timeIndex === 0 ? (
                                    <button
                                      onClick={() =>
                                        handleAddSlot(
                                          value._id as string,
                                          dayIndex,
                                          values
                                        )
                                      }
                                      type="button"
                                      disabled={mutationLoading}
                                      className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-primary-color text-primary-color hover:bg-primary-color hover:text-white transition-colors"
                                    >
                                      <FontAwesomeIcon
                                        icon={faPlus}
                                        className="h-3 w-3"
                                      />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleRemoveSlot(
                                          value._id as string,
                                          time._id as string,
                                          dayIndex,
                                          timeIndex,
                                          setFieldValue,
                                          values
                                        );
                                      }}
                                      disabled={mutationLoading}
                                      className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                      <FontAwesomeIcon
                                        icon={faMinus}
                                        className="h-3 w-3"
                                      />
                                    </button>
                                  )}
                                </td>
                                {timeIndex === 0 ? (
                                  <td
                                    className="border-l border-gray-300 px-4 py-3 align-top"
                                    rowSpan={value.times.length}
                                  >
                                    <InputSwitch
                                      checked={value.isOpen}
                                      onChange={() => {
                                        setFieldValue(
                                          `${dayIndex}.isOpen`,
                                          !value.isOpen
                                        );
                                      }}
                                    />
                                  </td>
                                ) : null}
                              </tr>
                            )
                          )
                        ) : (
                          <tr key={dayIndex}>
                            <td className=" border-b border-gray-300 px-4 py-3 align-top">
                              <span className="text-sm font-medium">
                                {t(value.day)}
                              </span>
                            </td>
                            <td
                              colSpan={3}
                              className=" border-b border-gray-300 px-4 py-3"
                            >
                              <span className="inline-block rounded-full bg-black px-3 py-1 text-xs text-white">
                                {t('Closed all Day')}
                              </span>
                            </td>
                            <td className=" border-b border-gray-300 px-4 py-3">
                              {/* Empty action cell for closed days */}
                            </td>
                            <td className="border-b border-gray-300 px-4 py-3 align-top">
                              <InputSwitch
                                checked={value.isOpen}
                                onChange={() => {
                                  setFieldValue(
                                    `${dayIndex}.isOpen`,
                                    !value.isOpen
                                  );
                                  // If turning on and no times exist, add a default time
                                  if (
                                    !value.isOpen &&
                                    value.times.length === 0
                                  ) {
                                    setFieldValue(`${dayIndex}.times`, [
                                      {
                                        startTime: '09:00',
                                        endTime: '17:00',
                                        maxOrders: 50,
                                      },
                                    ]);
                                  }
                                }}
                              />
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6">
              <CustomButton
                className="h-11 rounded-md border-gray-300 bg-black px-10 text-white"
                label={t('Save')}
                rounded={false}
                disabled={loading || mutationLoading || !dirty}
                type="submit"
                loading={mutationLoading}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ScheduleOrderMain;
