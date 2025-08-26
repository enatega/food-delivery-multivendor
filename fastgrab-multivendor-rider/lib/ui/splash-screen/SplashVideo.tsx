// import { ResizeMode, Video } from "expo-av";
// import { useRef, useState } from "react";
// import { StyleSheet } from "react-native";

// export default function SplashVideo({ onLoaded, onFinish }) {
//   const video = useRef(null);
//   const [lastStatus, setStatus] = useState({
//     isLoaded: false,
//     didJustFinish: false,
//   });

//   return (
//     <Video
//       ref={video}
//       style={StyleSheet.absoluteFill}
//       // eslint-disable-next-line @typescript-eslint/no-require-imports
//       source={require("../../assets/video/mobile-splash.mp4")}
//       shouldPlay={!(lastStatus.isLoaded && lastStatus.didJustFinish)}
//       isLooping={false}
//       resizeMode={ResizeMode.COVER}
//       onPlaybackStatusUpdate={(status) => {
//         if (status.isLoaded) {
//           if (lastStatus.isLoaded !== status.isLoaded) {
//             onLoaded();
//           }
//           if (status.didJustFinish) {
//             onFinish();
//           }
//         }
//         setStatus({ isLoaded: status.isLoaded, didJustFinish: true });
//       }}
//     />
//   );
// }
