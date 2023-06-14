import { useTheme } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale } from "../../utils/scaling";

const useStyle = () => {
  const { colors } = useTheme();
  const inset = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    wrapperView: {
      backgroundColor: colors.background,
      paddingTop: headerHeight,
      paddingBottom: inset.bottom,
    },
    topCurve: {
      position: "absolute",
      opacity: 0.2,
      left: -75,
      borderTopRightRadius: scale(90),
      borderBottomEndRadius: scale(200),
      top: -20,
      width: scale(250),
      height: scale(260),
      borderRadius: 100,
      backgroundColor: colors.curve,
    },
    bottomCurve: {
      position: "absolute",
      height: scale(185),
      width: scale(170),
      borderTopRightRadius: scale(110),
      borderTopLeftRadius: scale(90),
      borderBottomRightRadius: scale(100),
      borderBottomLeftRadius: scale(110),
      right: -90,
      backgroundColor: colors.curve,
      opacity: 0.2,
      bottom: -80,
      zIndex: -1,
    },
  });
};

export default useStyle;
