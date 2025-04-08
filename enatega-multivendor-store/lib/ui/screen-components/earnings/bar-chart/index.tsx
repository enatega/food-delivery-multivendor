// Core
import { Platform, View } from "react-native";

// Chart
import { BarChart, BarChartPropsType } from "react-native-gifted-charts";
export default function EarningsBarChart(props: BarChartPropsType) {
  return (
    <View className="mt-2">
      <BarChart
        barWidth={Platform.OS === "ios" ? 50 : 40}
        noOfSections={7}
        disableScroll={true}
        barBorderRadius={4}
        yAxisThickness={0}
        xAxisThickness={0}
        {...props}
      />
    </View>
  );
}
