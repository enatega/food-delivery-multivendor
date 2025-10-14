import { UPDATE_WORK_SCHEDULE } from "@/lib/apollo/mutations/work-schedule";
import { useUserContext } from "@/lib/context/global/user.context";

import { WorkSchedule } from "@/lib/utils/interfaces";
import { ApolloError, useMutation } from "@apollo/client";

import { STORE_PROFILE } from "@/lib/apollo/queries";
import { useApptheme } from "@/lib/context/theme.context";
import { timeToMinutes } from "@/lib/utils/methods/helpers/work-schedule";
import { TWeekDays } from "@/lib/utils/types/restaurant";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import UpdateTimeBtn from "../../update-time-btn";
import UpdateScheduleBtn from "../../updates-schedule-btn";
import WorkScheduleStack from "../work-schedule";

const { width } = Dimensions.get("window");

const daysOfWeek: TWeekDays[] = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
];

// Generate 24-hour time slots (every 15 minutes)
const generateTimeSlots = () => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const formattedTime = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      times.push(formattedTime);
    }
  }
  return times;
};
const timeOptions = generateTimeSlots();

export default function WorkScheduleMain() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  // States
  const [schedule, setSchedule] = useState<WorkSchedule[]>();
  const [dropdown, setDropdown] = useState<{
    dayIndex: number;
    slotIndex: number;
    type: "start" | "end";
  } | null>(null);
  const [isTogglingDay, setIsTogglingDay] = useState<number>(-1);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const parallaxAnim = useRef(new Animated.Value(0)).current;

  // Context
  const { dataProfile } = useUserContext();

  // API Hook
  const [updateSchedule, { loading: isUpatingSchedule }] = useMutation(
    UPDATE_WORK_SCHEDULE,
    {
      refetchQueries: [
        {
          query: STORE_PROFILE,
          variables: { id: dataProfile?._id },
        },
      ],
    }
  );

  // Handler
  const onHandlerSubmit = async () => {
    try {
      // Check for overlapping slots
      const overlapping_day = hasOverlappingSlots(schedule ?? []);
      if (overlapping_day) {
        return showMessage({
          message: `${t(overlapping_day)} ${t("has overlapping slots")}.`,
        });
      }
      // Clean the work schedule before submitting
      const cleanedWorkSchedule =
        schedule?.map(({ ...day }) => ({
          ...day,
          times: day.times
            .filter((time) => time.startTime && time.endTime)
            .map(({ ...cleanSlot }) => cleanSlot),
        })) ?? [];

      if (
        !cleanedWorkSchedule.length ||
        cleanedWorkSchedule.every((day) => !day.times.length)
      ) {
        return showMessage({
          message: t("No valid slots to submit"),
        });
      }

      const scheduleInput = transformSchedule(cleanedWorkSchedule);
      await updateSchedule({
        variables: scheduleInput,
        onCompleted: () => {
          showMessage({
            message: t("Work Schedule has been updated successfully"),
          });
        },
        onError: (error) => {
          return showMessage({
            message:
              error.graphQLErrors[0]?.message ?? t("Something went wrong"),
          });
        },
      });
    } catch (err) {
      const error = err as ApolloError;
      console.log(error);
    }
  };

  // Handlers
  const toggleDay = (index: number) => {
    setIsTogglingDay(index);

    const updatedSchedule = [...(schedule ?? [])];
    // If times array is empty, add default time slot
    if (updatedSchedule[index].times.length === 0) {
      updatedSchedule[index].times = [
        {
          startTime: ["09", "00"],
          endTime: ["17", "00"],
        },
      ];
    } else {
      // If times exist, clear them
      updatedSchedule[index].times = [];
    }
    setSchedule(updatedSchedule);
    setIsTogglingDay(-1);
  };

  function transformSchedule(schedule: WorkSchedule[] | undefined) {
    if (!schedule) return { updateTimingsId: null, openingTimes: [] };

    return {
      updateTimingsId: dataProfile?._id || null,
      openingTimes: schedule.map((daySchedule) => ({
        day: daySchedule.day.toUpperCase().substring(0, 3) || null,
        times:
          daySchedule.times.length === 0
            ? []
            : daySchedule.times.map((slot) => {
                // Ensure we're working with string format first
                const startTimeStr = Array.isArray(slot.startTime)
                  ? slot.startTime.join(":")
                  : slot.startTime;
                const endTimeStr = Array.isArray(slot.endTime)
                  ? slot.endTime.join(":")
                  : slot.endTime;

                // Ensure proper splitting of hours and minutes
                const [startHours = "00", startMinutes = "00"] =
                  typeof startTimeStr === "string" && startTimeStr
                    ? startTimeStr.split(":")
                    : ["00", "00"];
                const [endHours = "00", endMinutes = "00"] =
                  typeof endTimeStr === "string" && endTimeStr
                    ? endTimeStr.split(":")
                    : ["00", "00"];

                return {
                  startTime: [startHours, startMinutes],
                  endTime: [endHours, endMinutes],
                };
              }),
      })),
    };
  }

  const hasOverlappingSlots = (schedule: WorkSchedule[]): string => {
    for (const daySchedule of schedule) {
      if (daySchedule.times.length === 0) continue; // Skip days with no times

      const times = daySchedule.times;

      // Sort slots by start time to ensure proper order
      const sortedSlots = [...times].sort(
        (a, b) =>
          timeToMinutes(a.startTime.join(":")) -
          timeToMinutes(b.startTime.join(":"))
      );

      for (let i = 0; i < sortedSlots.length - 1; i++) {
        const currentEnd = timeToMinutes(sortedSlots[i].endTime.join(":"));
        const nextStart = timeToMinutes(sortedSlots[i + 1].startTime.join(":"));

        // If the next slot starts before the current one ends, there's an overlap
        if (nextStart < currentEnd) {
          return daySchedule.day;
        }
      }
    }

    return "";
  };

  const updateTime = (
    dayIndex: number,
    slotIndex: number,
    type: "startTime" | "endTime",
    value: string
  ) => {
    let updatedSchedule;
    let slot;
    if (schedule?.length) {
      updatedSchedule = [...schedule];
      slot = updatedSchedule[dayIndex].times[slotIndex];

      const [hours = "00", minutes = "00"] = value.split(":");

      // Validate start and end times
      const newTime = timeToMinutes(value);

      if (type === "startTime") {
        const endTimeStr = Array.isArray(slot.endTime)
          ? `${slot.endTime[0] || "00"}:${slot.endTime[1] || "00"}`
          : slot.endTime;
        if (slot?.endTime && newTime >= timeToMinutes(endTimeStr)) {
          return showMessage({
            message: "Start time must be earlier than end time",
          });
        }
      } else if (type === "endTime") {
        const startTimeStr = Array.isArray(slot.startTime)
          ? `${slot.startTime[0] || "00"}:${slot.startTime[1] || "00"}`
          : slot.startTime;
        if (slot?.startTime && newTime <= timeToMinutes(startTimeStr)) {
          return showMessage({
            message: "End time must be greater than start time",
          });
        }
      }

      // Check for overlapping slots
      const isOverlapping = updatedSchedule[dayIndex].times.some(
        (otherSlot, idx) => {
          if (idx === slotIndex) return false;

          const otherStart = timeToMinutes(
            Array.isArray(otherSlot.startTime)
              ? `${otherSlot.startTime[0] || "00"}:${otherSlot.startTime[1] || "00"}`
              : otherSlot.startTime
          );
          const otherEnd = timeToMinutes(
            Array.isArray(otherSlot.endTime)
              ? `${otherSlot.endTime[0] || "00"}:${otherSlot.endTime[1] || "00"}`
              : otherSlot.endTime
          );

          if (type === "startTime") {
            return newTime < otherEnd && newTime >= otherStart;
          } else {
            return newTime > otherStart && newTime <= otherEnd;
          }
        }
      );

      if (isOverlapping) {
        return showMessage({
          message: t("Time slot overlaps with another existing slot"),
        });
      }

      // Update the time value as an array [HH, MM]
      if (type === "startTime") {
        updatedSchedule[dayIndex].times[slotIndex].startTime = [hours, minutes];
      } else {
        updatedSchedule[dayIndex].times[slotIndex].endTime = [hours, minutes];
      }

      setSchedule(updatedSchedule);
      closeDropdown();
    }
  };

  const addSlot = (dayIndex: number) => {
    const updatedSchedule = schedule ? [...schedule] : [];
    updatedSchedule[dayIndex].times.push({
      startTime: ["09", "00"], // Properly initialize with hours and minutes
      endTime: ["17", "00"], // Properly initialize with hours and minutes
    });
    setSchedule(updatedSchedule);
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    const updatedSchedule = schedule ? [...schedule] : [];
    updatedSchedule[dayIndex].times.splice(slotIndex, 1);
    setSchedule(updatedSchedule);
  };

  const closeDropdown = () => {
    if (dropdown) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 20,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setDropdown(null); // Hide dropdown after animation
      });
    }
  };

  // Handle dropdown animations
  useEffect(() => {
    if (dropdown) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [dropdown]);

  useEffect(() => {
    if (dataProfile?.openingTimes) {
      const timings = dataProfile.openingTimes;

      setSchedule(
        timings.map((daySchedule) => ({
          day: daySchedule.day || null,
          times: daySchedule.times?.length
            ? daySchedule.times.map((slot) => {
                const [startHours = "09", startMinutes = "00"] =
                  slot.startTime || [];
                const [endHours = "17", endMinutes = "00"] = slot.endTime || [];

                return {
                  startTime: [startHours, startMinutes],
                  endTime: [endHours, endMinutes],
                };
              })
            : [],
          __typename: "OpeningTimes",
        }))
      );
    } else {
      setSchedule(
        daysOfWeek.map((day) => ({
          day,
          times: [],
          __typename: "OpeningTimes",
        }))
      );
    }
  }, [dataProfile?.openingTimes]);

  return (
    <TouchableWithoutFeedback onPress={closeDropdown}>
      <View className="flex-1 items-center">
        <View
          className="p-2 h-[80%] w-full"
          style={{ backgroundColor: appTheme.themeBackground }}
        >
          <FlatList
            data={schedule}
            keyExtractor={(item) => item.day}
            scrollEnabled={true}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => (
              <WorkScheduleStack
                key={String(index).concat("_workschedule_stack")}
                item={item}
                isTogglingDay={isTogglingDay}
                index={index}
                toggleDay={toggleDay}
                removeSlot={removeSlot}
                addSlot={addSlot}
                dropdown={dropdown}
                setDropdown={setDropdown}
              />
            )}
          />
        </View>
        <UpdateScheduleBtn
          isUpatingSchedule={isUpatingSchedule}
          onHandlerSubmit={onHandlerSubmit}
          width={width}
        />
        {/* Animated Dropdown */}
        {dropdown && (
          <Animated.View
            className="mb-[6rem]"
            style={{
              position: "absolute",
              bottom: -80,
              left: 5,
              right: 5,
              backgroundColor: appTheme.themeBackground,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 5,
              borderRadius: 8,
              padding: 10,
              opacity: fadeAnim,

              transform: [
                { translateY: translateYAnim },
                {
                  translateY: parallaxAnim.interpolate({
                    inputRange: [0, 300], // Adjust based on your dropdown height
                    outputRange: [0, -30], // Parallax effect range
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
          >
            <Text
              className="font-[Inter] text-lg font-bold mb-2"
              style={{ color: appTheme.fontMainColor }}
            >
              {t("Select Time Slot")}
            </Text>
            <ScrollView
              style={{ maxHeight: 300 }}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: parallaxAnim } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
            >
              {timeOptions.map((time, index) => (
                <UpdateTimeBtn
                  key={String(index).concat("_update_time_btn")}
                  updateTime={updateTime}
                  dropdown={dropdown}
                  time={time}
                />
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
