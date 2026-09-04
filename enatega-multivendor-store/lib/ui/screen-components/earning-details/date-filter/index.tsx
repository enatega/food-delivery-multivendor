// Utils
import { useApptheme } from "@/lib/context/theme.context";
import { CustomContinueButton } from "@/lib/ui/useable-components";

// Interfaces
import {
  IEarningDetailsMainProps,
  IEarningsDateFilterProps,
} from "@/lib/utils/interfaces/rider-earnings.interface";

// Icons
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

// Core
import { Text, TouchableOpacity, View } from "react-native";

// React Native Calendars
import { Calendar, DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import { useEarningsTheme } from "../../earnings/theme";

export default function EarningDetailsDateFilter({
  dateFilter,
  setDateFilter,
  handleFilterSubmit,
  isFiltering,
  isDateFilterVisible,
  setIsDateFilterVisible,
  refetchDeafult,
}: IEarningDetailsMainProps & IEarningsDateFilterProps) {
  // Hooks
  const { t } = useTranslation();
  const { appTheme } = useApptheme();
  const earningsTheme = useEarningsTheme();

  // Handlers
  const handleDayPress = (day: DateData) => {
    const { dateString } = day;

    // If the user clicks on the already selected start date, reset selection
    if (dateFilter.startDate === dateString && !dateFilter.endDate) {
      setDateFilter({ startDate: "", endDate: "" });
      return;
    }

    // If no startDate or both startDate and endDate exist, reset the selection
    if (!dateFilter.startDate || (dateFilter.startDate && dateFilter.endDate)) {
      setDateFilter({ startDate: dateString, endDate: "" });
    } else {
      // If startDate exists but no endDate, set endDate only if it's after startDate
      if (new Date(dateString) >= new Date(dateFilter.startDate)) {
        setDateFilter((prev) => ({ ...prev, endDate: dateString }));
      } else {
        // Swap if the user selects an earlier date for the endDate
        setDateFilter({ startDate: dateString, endDate: "" });
      }
    }
  };

  // Generate the marked dates
  const getMarkedDates = () => {
    const markedDates: MarkedDates = {};

    if (dateFilter.startDate) {
      markedDates[dateFilter.startDate] = {
        startingDay: true,
        marked: true,
        color: earningsTheme.accent,
        dotColor: earningsTheme.accent,
        selectedColor: earningsTheme.accent,
        selectedTextColor: earningsTheme.canvas,
        textColor: earningsTheme.canvas,
      };
    }

    if (dateFilter.endDate) {
      markedDates[dateFilter.endDate] = {
        endingDay: true,
        marked: true,
        color: earningsTheme.accent,
        dotColor: earningsTheme.accent,
        selectedColor: earningsTheme.accent,
        selectedTextColor: earningsTheme.canvas,
        textColor: earningsTheme.canvas,
      };

      // Mark the dates in between
      const currentDate = new Date(dateFilter.startDate!);
      const endDate = new Date(dateFilter.endDate);

      while (currentDate < endDate) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dateString = currentDate.toISOString().split("T")[0];
        if (dateString !== dateFilter.endDate) {
          markedDates[dateString] = {
            color: earningsTheme.accentSoft,
            textColor: earningsTheme.primaryText,
          };
        }
      }
    }

    return markedDates;
  };

  const datesBeGetter = getMarkedDates();
  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 18, paddingTop: 12 }}>
      <View className="flex flex-row items-center justify-between w-full">
        <TouchableOpacity
          onPress={() => setIsDateFilterVisible((prev) => !prev)}
          accessibilityRole="button"
          accessibilityState={{ expanded: isDateFilterVisible }}
        >
          <View
            style={{
              alignItems: "center",
              backgroundColor: earningsTheme.accentSoft,
              borderRadius: 10,
              flexDirection: "row",
              minHeight: 42,
              paddingHorizontal: 12,
            }}
          >
            <Ionicons
              name="calendar-outline"
              color={earningsTheme.accent}
              size={20}
            />
            <Text
              style={{
                color: earningsTheme.primaryText,
                fontSize: 14,
                fontWeight: "700",
                marginStart: 8,
              }}
            >
              {t("Date Filter")}
            </Text>
            <Ionicons
              name={isDateFilterVisible ? "chevron-up" : "chevron-down"}
              color={earningsTheme.mutedText}
              size={16}
              style={{ marginStart: 8 }}
            />
          </View>
        </TouchableOpacity>
        {(dateFilter.startDate || dateFilter.endDate) && (
          <TouchableOpacity
            onPress={() => {
              setDateFilter({ endDate: "", startDate: "" });
              refetchDeafult({
                startDate: "",
                endDate: "",
              });
            }}
          >
            <View className="flex flex-row items-center gap-1">
              <Ionicons
                name="close-circle-outline"
                color={appTheme.error}
                size={19}
              />
              <Text style={{ color: earningsTheme.mutedText, fontSize: 13 }}>
                {t("Clear Filters")}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      {isDateFilterVisible && (
        <View
          style={{
            backgroundColor: earningsTheme.surface,
            borderRadius: 14,
            marginTop: 12,
            overflow: "hidden",
            padding: 10,
          }}
        >
          <Calendar
            initialDate={""}
            onDayPress={(day: DateData) => handleDayPress(day)}
            markedDates={{
              ...datesBeGetter,
            }}
            markingType="period"
            theme={{
              arrowColor: earningsTheme.accent,
              backgroundColor: earningsTheme.surface,
              calendarBackground: earningsTheme.surface,
              dayTextColor: earningsTheme.primaryText,
              monthTextColor: earningsTheme.primaryText,
              textDisabledColor: earningsTheme.divider,
              textSectionTitleColor: earningsTheme.mutedText,
              todayTextColor: earningsTheme.accent,
            }}
          />
          <CustomContinueButton
            onPress={() => handleFilterSubmit()}
            title={isFiltering ? t("Please Wait") : t("Apply Filter")}
            disabled={isFiltering}
          />
        </View>
      )}
    </View>
  );
}
