import { Colors } from "@/lib/utils/constants";
import { IFlashMessageComponentProps } from "@/lib/utils/interfaces/flash-message.interface";
import { showMessage } from "react-native-flash-message";

export default function FlashMessageComponent(
  props: IFlashMessageComponentProps,
) {
  showMessage({
    message: props.message,
    backgroundColor: Colors.light.primary,
    position: "top",
    style: {
      borderRadius: 40,
      minHeight: 50,
    },
    titleStyle: {
      color: Colors.light.fontMainColor,
    },
  });
}
