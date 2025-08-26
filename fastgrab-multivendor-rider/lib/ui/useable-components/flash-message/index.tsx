import { showMessage } from "react-native-flash-message";
import { IFlashMessageComponentProps } from "@/lib/utils/interfaces/flash-message.interface";

export default function FlashMessageComponent(
  props: IFlashMessageComponentProps,
) {
  showMessage({
    message: props.message,
    backgroundColor: "rgba(52, 52, 52, .9)", // Dark semi-transparent background
    position: "center", // Center position
    style: {
      borderRadius: 40,
      minHeight: 50,
    },
  });
}
