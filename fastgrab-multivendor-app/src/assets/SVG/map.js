import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";

function MapIcon({ onPress, ...props }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {/* Lottie Animation */}
      <LottieView
        source={require("../SVG/location.json")}
        autoPlay
        loop
        style={styles.lottie}
        {...props}
      />
    </TouchableOpacity>
  );
}

export default MapIcon;

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
  },
  lottie: {
    position: "absolute",
    width: 32,
    height: 32,
  },
});
