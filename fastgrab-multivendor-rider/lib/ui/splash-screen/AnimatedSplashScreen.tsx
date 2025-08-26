// // Expo
// import "expo-dev-client";
// import * as SplashScreen from "expo-splash-screen";

// // Core
// import { StyleSheet, View } from "react-native";

// // React Native Reanimated
// import Animated, {
//   Easing,
//   runOnJS,
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated";

// // Components
// import SplashVideo from "./SplashVideo";

// // Hooks
// import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

// export default function AnimatedSplashScreen({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   // States
//   const [isAppReady, setAppReady] = useState(false);
//   const [isSplashVideoComplete, setSplashVideoComplete] = useState(false);
//   const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

//   // Hooks
//   const opacityAnimation = useSharedValue(1); // Shared value for opacity
//   const scaleAnimation = useSharedValue(1); // Shared value for scale

//   // Handlers
//   const onImageLoaded = useCallback(async () => {
//     try {
//       // Load stuff
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//       await SplashScreen.hideAsync();
//     } catch (e) {
//       const err = e as Error;
//       console.log(err);
//       // Handle errors
//     } finally {
//       setAppReady(true);
//     }
//   }, []);

//   const videoElement = useMemo(() => {
//     return (
//       <SplashVideo
//         onLoaded={onImageLoaded}
//         onFinish={() => {
//           setSplashVideoComplete(true); // Mark video as complete
//         }}
//       />
//     );
//   }, [onImageLoaded]);

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       opacity: opacityAnimation.value, // Use shared value for opacity
//       transform: [{ scale: scaleAnimation.value }], // Use shared value for scale
//     };
//   });

//   // UseEffects
//   useEffect(() => {
//     if (isAppReady && isSplashVideoComplete) {
//       // Start fade out and scale down animation when the app is ready and video has completed
//       opacityAnimation.value = withTiming(0, {
//         duration: 300,
//         easing: Easing.out(Easing.exp),
//       });

//       scaleAnimation.value = withTiming(
//         2,
//         {
//           duration: 300,
//           easing: Easing.out(Easing.exp),
//         },
//         () => {
//           runOnJS(setAnimationComplete)(true); // Update the animation completion state
//         },
//       );
//     }
//   }, [isAppReady, isSplashVideoComplete]);
//   return (
//     <View style={{ flex: 1 }}>
//       {isSplashAnimationComplete ? children : null}
//       <Animated.View
//         pointerEvents="none"
//         style={[
//           StyleSheet.absoluteFill,
//           animatedStyle,
//           { backgroundColor: "black" },
//         ]}
//       >
//         {videoElement}
//       </Animated.View>
//     </View>
//   );
// }
