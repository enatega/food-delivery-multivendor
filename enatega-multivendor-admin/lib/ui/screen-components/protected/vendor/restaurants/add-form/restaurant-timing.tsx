'use client';
// Core
import { ErrorMessage, Form, Formik, FormikErrors } from 'formik';
import { useContext } from 'react';

// Interface and Types
import { TWeekDays } from '@/lib/utils/types/days';
import { IRestaurantsRestaurantTimingComponentProps } from '@/lib/utils/interfaces';

// Components
import CustomButton from '@/lib/ui/useable-components/button';
import CustomTimeInput from '@/lib/ui/useable-components/time-input';
import Toggle from '@/lib/ui/useable-components/toggle';
import {
  ITimeSlot,
  ITimeSlotResponseGQL,
  ITimingForm,
  ITimingResponseGQL,
} from '@/lib/utils/interfaces/timing.interface';

// Context
import { VendorLayoutRestaurantContext } from '@/lib/context/vendor/restaurant.context';

// Utilities and Constants
import { TIMING_INITIAL_VALUE } from '@/lib/utils/constants';
import { TimingSchema } from '@/lib/utils/schema/timing';

// Toast
import useToast from '@/lib/hooks/useToast';

// GraphQL
import { GET_RESTAURANT_PROFILE } from '@/lib/api/graphql';
import { UPDATE_TIMINGS } from '@/lib/api/graphql/mutations/timing';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslations } from 'next-intl';

const RestaurantTiming = ({
  stepperProps,
}: IRestaurantsRestaurantTimingComponentProps) => {
  const { onStepChange } = stepperProps ?? {
    onStepChange: () => {},
  };

  const {
    restaurantContextData,
    onSetRestaurantContextData,
    onSetRestaurantFormVisible,
  } = useContext(VendorLayoutRestaurantContext);
  const restaurantId = restaurantContextData?.id || '';

  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();

  const { data, loading } = useQuery(GET_RESTAURANT_PROFILE, {
    variables: { id: restaurantId },
  });

  //for conversion from ["HH","MM"] to 'HH:MM' format
  const openingTimes: ITimingForm[] =
    data?.restaurant?.openingTimes?.map((opening: ITimingResponseGQL) => {
      const times = opening?.times?.map((timing: ITimeSlotResponseGQL) => {
        const formatTime = (time: string[]) =>
          `${time[0].padStart(2, '0')}:${time[1].padStart(2, '0')}`;

        return {
          startTime: formatTime(timing.startTime),
          endTime: formatTime(timing.endTime),
        };
      });

      return {
        day: opening.day as TWeekDays,
        times,
      };
    }) ?? [];

  const initialValues: ITimingForm[] =
    openingTimes.length > 0 ? openingTimes : TIMING_INITIAL_VALUE;

  const [mutate, { loading: mutationLoading }] = useMutation(UPDATE_TIMINGS);

  // Form Submission
  const handleSubmit = (values: ITimingForm[]) => {
    //conversion from 'HH:MM' to ["HH","MM"]
    const formattedData = [...values]?.map((v) => {
      const tempTime = [...v.times];
      const formattedTime = tempTime?.map((time) => {
        return {
          startTime: time.startTime?.split(':'),
          endTime: time.endTime?.split(':'),
        };
      });
      return {
        ...v,
        times: formattedTime,
      };
    });

    mutate({
      variables: {
        id: restaurantId,
        openingTimes: formattedData,
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: t('Success'),
          message: t('Timing updated'),
          duration: 3000,
        });

        onSetRestaurantFormVisible(false);
        onStepChange(0);
        onSetRestaurantContextData({});
      },
      onError: (error) => {
        let message = '';
        try {
          message = error.graphQLErrors[0]?.message;
        } catch (err) {
          message = t('ActionFailedTryAgain');
        }
        showToast({
          type: 'error',
          title: t('Error'),
          message,
          duration: 3000,
        });
      },
    });
  };

  return (
    <div className="flex flex-col gap-2 rounded">
      <div className="mb-2 flex flex-col">
        <span className="text-lg">{t('Store Timing')}</span>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={TimingSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="flex flex-col gap-6">
            {values?.map((value, dayIndex) => {
              return (
                <div key={dayIndex} className="flex items-start gap-5">
                  {/* left side */}
                  <div className="mt-2 flex items-center gap-4">
                    <Toggle
                      onClick={() => {
                        const newTimes =
                          value?.times?.length > 0
                            ? []
                            : [
                                {
                                  startTime: '00:00',
                                  endTime: '23:59',
                                },
                              ];
                        setFieldValue(`${dayIndex}.times`, newTimes);
                      }}
                      checked={value?.times?.length > 0}
                    />
                    <span className="w-10 text-sm">{value.day}</span>
                  </div>

                  {/* center */}
                  {value?.times?.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {value?.times?.map((time: ITimeSlot, timeIndex) => {
                        return (
                          <div
                            key={timeIndex}
                            className="flex items-start gap-4"
                          >
                            <div className="flex flex-col gap-0 sm:flex-row sm:gap-4">
                              <div className="max-w-4min-w-44 relative flex w-full min-w-44 flex-col">
                                <CustomTimeInput
                                  name={`${dayIndex}.times[${timeIndex}].startTime`}
                                  showLabel={false}
                                  value={time.startTime}
                                  onChange={(value: string) => {
                                    setFieldValue(
                                      `${dayIndex}.times[${timeIndex}].startTime`,
                                      value
                                    );
                                  }}
                                  isLoading={loading}
                                  placeholder={t('Start Time')}
                                  style={{
                                    borderColor:
                                      (
                                        errors?.[dayIndex]?.times?.[
                                          timeIndex
                                        ] as FormikErrors<ITimeSlot>
                                      )?.startTime &&
                                      touched?.[dayIndex]?.times?.[timeIndex]
                                        ?.startTime
                                        ? 'red'
                                        : '',
                                  }}
                                />
                                <ErrorMessage
                                  name={`${dayIndex}.times[${timeIndex}].startTime`}
                                >
                                  {(msg) => (
                                    <div className="absolute bottom-[-15px] ml-1 text-[10px] text-red-500">
                                      {msg}
                                    </div>
                                  )}
                                </ErrorMessage>
                              </div>

                              <span className="self-center text-xs">-</span>

                              <div className="max-w-4min-w-44 relative flex w-full min-w-44 flex-col">
                                <CustomTimeInput
                                  name={`${dayIndex}.times[${timeIndex}].endTime`}
                                  showLabel={false}
                                  value={time.endTime}
                                  onChange={(value: string) => {
                                    setFieldValue(
                                      `${dayIndex}.times[${timeIndex}].endTime`,
                                      value
                                    );
                                  }}
                                  isLoading={loading}
                                  placeholder={t('End Time')}
                                  style={{
                                    borderColor:
                                      (
                                        errors?.[dayIndex]?.times?.[
                                          timeIndex
                                        ] as FormikErrors<ITimeSlot>
                                      )?.endTime &&
                                      touched?.[dayIndex]?.times?.[timeIndex]
                                        ?.endTime
                                        ? 'red'
                                        : '',
                                  }}
                                />
                                <ErrorMessage
                                  name={`${dayIndex}.times[${timeIndex}].endTime`}
                                >
                                  {(msg) => (
                                    <div className="absolute bottom-[-15px] text-[10px] text-red-500">
                                      {msg}
                                    </div>
                                  )}
                                </ErrorMessage>
                              </div>
                            </div>

                            {/* right side */}
                            {timeIndex > 0 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const prev = [...values[dayIndex].times];
                                  prev.splice(timeIndex, 1);
                                  setFieldValue(`${dayIndex}.times`, prev);
                                }}
                                className="mt-2 flex h-6 w-6 select-none items-center justify-center rounded-full border border-red-500 text-red-500 hover:cursor-pointer hover:bg-red-400 hover:text-white"
                              >
                                -
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const prev = [...values[dayIndex].times];
                                  prev.push({ startTime: null, endTime: null });
                                  setFieldValue(`${dayIndex}.times`, prev);
                                }}
                                type="button"
                                className="mt-2 flex h-6 w-6 select-none items-center justify-center rounded-full border border-primary-color text-primary-color hover:cursor-pointer hover:bg-secondary-color hover:text-white"
                              >
                                +
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex min-h-10 flex-1 items-center justify-start">
                      <span className="select-none rounded-full bg-black px-3 py-1 text-xs text-white">
                        {t('Closed all Day')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            <CustomButton
              className="mb-[2px] mr-auto mt-auto flex h-11 rounded-md border-gray-300 bg-[black] px-10 text-white"
              label={t('Save')}
              rounded={false}
              disabled={loading}
              type="submit"
              loading={mutationLoading}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RestaurantTiming;
