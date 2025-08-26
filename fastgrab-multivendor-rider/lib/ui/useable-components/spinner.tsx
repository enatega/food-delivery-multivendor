// Core
import { ActivityIndicator } from "react-native";

//Interface
import { ISpinnerComponentProps } from "@/lib/utils/interfaces";

// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";
function SpinnerComponent(props: ISpinnerComponentProps) {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <ActivityIndicator
      size="small"
      color={props.color ? props.color : appTheme.primary}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    />
  );
}

export default SpinnerComponent;
