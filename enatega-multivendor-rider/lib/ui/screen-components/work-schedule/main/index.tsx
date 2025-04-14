import { UPDATE_WORK_SCHEDULE } from "@/lib/apollo/mutations/rider.mutation";
import { useUserContext } from "@/lib/context/global/user.context";
import { FlashMessageComponent } from "@/lib/ui/useable-components";
import SpinnerComponent from "@/lib/ui/useable-components/spinner";

import { TimeSlot, WorkSchedule } from "@/lib/utils/interfaces";
import { ApolloError, useMutation } from "@apollo/client";

import { useApptheme } from "@/lib/context/global/theme.context";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Switch } from "react-native-switch";

const { width } = Dimensions.get("window");

const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

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

export default function ScheduleScreen() {
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
  const [timeZone, setTimeZone] = useState("");

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current; // Opacity
  const translateYAnim = useRef(new Animated.Value(20)).current; // Slide up
  const parallaxAnim = useRef(new Animated.Value(0)).current; // Parallax effect

  // Context
  const { dataProfile } = useUserContext();

  // API Hook
  const [updateSchedule, { loading: isUpatingSchedule }] =
    useMutation(UPDATE_WORK_SCHEDULE);

  // Handler
  const onHandlerSubmit = async () => {
    try {
      const overlapping_day = hasOverlappingSlots(schedule ?? []);

      if (overlapping_day) {
        FlashMessageComponent({
          message: `${t(overlapping_day)} ${t("has overlapping slots")}`,
        });
        return;
      }

      // eslint-disable-next-line unused-imports/no-unused-vars
      const cleaned_work_schedule = schedule?.map(({ __typename, ...day }) => ({
        ...day,
        slots: day.slots.map((slot) => {
          // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
          const { __typename: slot_timename, ...cleanSlot } = slot;
          return cleanSlot;
        }),
      }));

      await updateSchedule({
        variables: {
          riderId: dataProfile?._id,
          workSchedule: cleaned_work_schedule,
          timeZone,
        },
        onCompleted: () => {
          FlashMessageComponent({
            message: t("Work Schedule has been updated successfully"),
          });
        },
        onError: (error) => {
          FlashMessageComponent({
            message:
              error.graphQLErrors[0]?.message ?? t("Something went wrong"),
          });
        },
      });
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (err) {
      const error = err as ApolloError;
      // FlashMessageComponent({
      //   message: error?.message || t("Something went wrong"),
      // });
      console.log("error work0schedule", error);
    }
  };

  // Handlers
  const toggleDay = (index: number) => {
    const updatedSchedule = [...(schedule ?? [])];
    updatedSchedule[index].enabled = !updatedSchedule[index].enabled;
    setSchedule(updatedSchedule);
  };

  const hasOverlappingSlots = (schedule: WorkSchedule[]): string => {
    // Helper function to convert time string (HH:mm) to minutes
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    for (const daySchedule of schedule) {
      if (!daySchedule.enabled) continue; // Skip disabled days

      const slots = daySchedule.slots;

      // Sort slots by start time to ensure proper order
      const sortedSlots = [...slots].sort(
        (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
      );

      for (let i = 0; i < sortedSlots.length - 1; i++) {
        const currentEnd = timeToMinutes(sortedSlots[i].endTime);
        const nextStart = timeToMinutes(sortedSlots[i + 1].startTime);

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
    value: string,
  ) => {
    const updatedSchedule = JSON.parse(JSON.stringify(schedule));

    // Get the current slot
    const slot = updatedSchedule[dayIndex].slots[slotIndex];

    // Helper function to convert time string (HH:mm) to minutes
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const newTime = timeToMinutes(value);

    if (type === "startTime") {
      // Ensure new startTime is before endTime
      if (slot.endTime && newTime >= timeToMinutes(slot.endTime)) {
        FlashMessageComponent({
          message: t("Start time must be earlier than end time"),
        });
        return;
      }
    } else if (type === "endTime") {
      // Ensure new endTime is after startTime
      if (slot.startTime && newTime <= timeToMinutes(slot.startTime)) {
        FlashMessageComponent({
          message: t("End time must be greater than start time"),
        });
        return;
      }
    }

    // Check for overlaps with other slots in the same day
    const isOverlapping = updatedSchedule[dayIndex].slots.some(
      (otherSlot: TimeSlot, idx: number) => {
        if (idx === slotIndex) return false; // Skip checking the current slot

        const otherStart = timeToMinutes(otherSlot.startTime);
        const otherEnd = timeToMinutes(otherSlot.endTime);

        if (type === "startTime") {
          return newTime < otherEnd && newTime >= otherStart;
        } else {
          return newTime > otherStart && newTime <= otherEnd;
        }
      },
    );

    if (isOverlapping) {
      FlashMessageComponent({
        message: t("Time slot overlaps with another existing slot"),
      });
      return;
    }

    // Update the slot value
    updatedSchedule[dayIndex].slots[slotIndex][type] = value;
    setSchedule(updatedSchedule);
    closeDropdown(); // Close dropdown after selection
  };

  const addSlot = (dayIndex: number) => {
    const updatedSchedule = schedule ? [...schedule] : [];
    updatedSchedule[dayIndex].slots.push({
      startTime: "09:00",
      endTime: "23:45",
      __typename: "TimeSlot",
    });
    setSchedule(updatedSchedule);
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    const updatedSchedule = schedule ? [...schedule] : [];
    updatedSchedule[dayIndex].slots.splice(slotIndex, 1);
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
    setSchedule(
      (dataProfile?.workSchedule?.length ?? 0) > 0
        ? JSON.parse(JSON.stringify(dataProfile?.workSchedule))
        : daysOfWeek.map((day) => ({
            day,
            enabled: false,
            slots: [{ startTime: "09:00", endTime: "17:00" }],
          })),
    );

    // Auto-detect user's time zone on first render
    const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimeZone(detectedTimeZone);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={closeDropdown}>
      <View className="flex-1 items-center">
        <View
          className="p-2 h-[80%] w-full"
          style={{ backgroundColor: appTheme.screenBackground }}
        >
          <FlatList
            data={schedule}
            keyExtractor={(item) => item.day}
            renderItem={({ item, index }) => {
              const translatedDay = t(item.day);
              console.log(
                "🚀 ~ ScheduleScreen ~ translatedDay:",

                item.day,
                translatedDay,
              );
              return (
                <View
                  className=" border p-4 mb-3 rounded-lg"
                  style={{
                    backgroundColor: appTheme.themeBackground,
                    borderColor: appTheme.borderLineColor,
                  }}
                >
                  {/* Day Header with Toggle */}
                  <View className="flex-row justify-between items-center">
                    <Text
                      className="text-lg font-bold"
                      style={{ color: appTheme.fontMainColor }}
                    >
                      {t(item.day)}
                    </Text>
                    <Switch
                      value={item.enabled}
                      onValueChange={() => toggleDay(index)}
                      activeText={""}
                      inActiveText={""}
                      circleSize={20}
                      barHeight={25}
                      backgroundActive={appTheme.primary}
                      backgroundInactive={appTheme.gray}
                      circleBorderWidth={0}
                    />
                  </View>

                  {/* Time Slots */}
                  {item.enabled && (
                    <View className="mt-2">
                      {item.slots.map((slot, slotIndex) => {
                        const isStartTapped =
                          dropdown?.dayIndex === index &&
                          dropdown?.slotIndex === slotIndex &&
                          dropdown?.type === "start";
                        const isEndTapped =
                          dropdown?.dayIndex === index &&
                          dropdown?.slotIndex === slotIndex &&
                          dropdown?.type === "end";

                        return (
                          <View
                            key={slotIndex}
                            className="flex-row items-center justify-between mt-2 gap-x-2"
                          >
                            {/* Start Time Button */}
                            <TouchableOpacity
                              onPress={() =>
                                setDropdown({
                                  dayIndex: index,
                                  slotIndex,
                                  type: "start",
                                })
                              }
                              className={`w-[40%] bg-white p-2 rounded-md`}
                              style={
                                isStartTapped ? style.tappedSlot : style.slot
                              }
                            >
                              <Text className="text-center">
                                {slot.startTime}
                              </Text>
                            </TouchableOpacity>

                            <Text className="mx-">-</Text>

                            {/* End Time Button */}
                            <TouchableOpacity
                              onPress={() =>
                                setDropdown({
                                  dayIndex: index,
                                  slotIndex,
                                  type: "end",
                                })
                              }
                              className="w-[40%] bg-white p-2 rounded-md"
                              style={
                                isEndTapped ? style.tappedSlot : style.slot
                              }
                            >
                              <Text className="text-center">
                                {slot.endTime}
                              </Text>
                            </TouchableOpacity>

                            {/* Remove Slot Button */}
                            {item.slots.length > 1 && slotIndex !== 0 && (
                              <TouchableOpacity
                                onPress={() => removeSlot(index, slotIndex)}
                                className="w-8 h-8 justify-center items-center border border-red-600 rounded-full"
                              >
                                <Text className="text-red-600 font-bold">
                                  −
                                </Text>
                              </TouchableOpacity>
                            )}

                            {/* Add Slot Button */}
                            {slotIndex === 0 && (
                              <TouchableOpacity
                                onPress={() => addSlot(index)}
                                className="w-8 h-8 justify-center items-center border rounded-full"
                                style={{ borderColor: appTheme.primary }}
                              >
                                <Text
                                  className=" font-bold text-center"
                                  style={{ color: appTheme.primary }}
                                >
                                  +
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            }}
          />
        </View>
        <TouchableOpacity
          className="h-12 w-full rounded-3xl py-3"
          style={{ width: width * 0.9, backgroundColor: appTheme.primary }}
          onPress={() => onHandlerSubmit()}
        >
          {isUpatingSchedule ? (
            <SpinnerComponent />
          ) : (
            <Text
              className="text-center  text-lg font-medium"
              style={{ color: appTheme.fontMainColor }}
            >
              {t("Update Schedule")}
            </Text>
          )}
        </TouchableOpacity>

        {/* Animated Dropdown */}
        {dropdown && (
          <Animated.View
            className="mb-[6rem]"
            style={{
              position: "absolute",
              bottom: -80,
              left: 5,
              right: 5,
              backgroundColor: "white",
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
                { useNativeDriver: false },
              )}
              scrollEventThrottle={16}
            >
              {timeOptions.map((time) => (
                <TouchableOpacity
                  key={time}
                  onPress={() =>
                    updateTime(
                      dropdown.dayIndex,
                      dropdown.slotIndex,
                      dropdown.type === "start" ? "startTime" : "endTime",
                      time,
                    )
                  }
                  className="p-2 border-b border-gray-300"
                >
                  <Text className="font-[Inter] text-center text-lg">
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const style = StyleSheet.create({
  slot: {
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  tappedSlot: {
    borderWidth: 1,
    borderColor: "#22c55e",
  },
});
