import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// Hooks
import { useApptheme } from "@/lib/context/theme.context";

interface TimerProps {
  duration: number; // Duration in seconds
}

const CountdownTimer: React.FC<TimerProps> = ({ duration }) => {
  // Hooks
  const { appTheme } = useApptheme();

  // States
  const [timeLeft, setTimeLeft] = useState(duration);

  // UseEffects
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Convert seconds to HH:MM:SS format
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return {
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);
  const isOverdue = hours === "00" && minutes === "00" && seconds === "00";

  return (
    <View style={styles.container}>
      <View style={styles.timerRow}>
        <View style={styles.box}>
          <Text
            style={[
              styles[isOverdue ? "timerTextEnd" : "timerText"],
              { color: appTheme.fontMainColor },
            ]}
          >
            {hours}
          </Text>
        </View>
        <Text style={styles.colon}>:</Text>
        <View style={styles.box}>
          <Text
            style={[
              styles[isOverdue ? "timerTextEnd" : "timerText"],
              { color: appTheme.fontMainColor },
            ]}
          >
            {minutes}
          </Text>
        </View>
        <Text style={styles.colon}>:</Text>
        <View style={styles.box}>
          <Text
            style={[
              styles[isOverdue ? "timerTextEnd" : "timerText"],
              { color: appTheme.fontMainColor },
            ]}
          >
            {seconds}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  box: {
    width: 30,
    height: 30,
    backgroundColor: "transparent",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    fontSize: 20,
    fontWeight: "bold",
    // color: "red",
  },
  timerTextEnd: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
  },
  colon: {
    fontWeight: "bold",
    color: "red",
    marginHorizontal: 5,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    marginTop: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
});

export default CountdownTimer;
