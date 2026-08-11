import { StyleSheet } from "react-native";

export const map_styles = StyleSheet.create({
    map: {
      height: "100%",
      width: "100%",
    },
    backgroundStyle: {
      //zIndex: 0,
      backgroundColor: "transparent", // Change to your desired background color
    },
    // Added error banner styles for user feedback
    errorBanner: {
      position: "absolute",
      bottom: 10,
      left: 10,
      right: 10,
      backgroundColor: "rgba(255, 0, 0, 0.7)",
      padding: 8,
      borderRadius: 5,
      alignItems: "center",
    },
    errorText: {
      color: "white",
      fontWeight: "bold",
    },
    retryButton: {
      backgroundColor: "white",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 4,
      marginTop: 8,
    },
    retryButtonText: {
      color: "red",
      fontWeight: "bold",
    },
  });
  