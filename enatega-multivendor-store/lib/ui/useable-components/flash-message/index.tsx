import { Colors } from "@/lib/utils/constants";
import { IFlashMessageComponentProps } from "@/lib/utils/interfaces/flash-message.interface";
import { showMessage } from "react-native-flash-message";

export default function FlashMessageComponent(
  props: IFlashMessageComponentProps
) {
  showMessage({
    message: props.message,
    backgroundColor: Colors.light.primary,
    position: "top",
    style: {
      borderRadius: 40,
      marginLeft: 20,
      marginRight: 20,
      marginTop: 30,
      minHeight: 40, // force consistent height
      paddingVertical: 10, // add padding
    },
    titleStyle: {
      color: Colors.light.fontMainColor,
      fontSize: 14, // force consistent font size
      textAlign: "center",
    },
    floating: true, // removes platform-based default margins
  });

  // showMessage({
  //   message: props.message,
  //   backgroundColor: Colors.light.primary,
  //   position: "top",
  //   style: {
  //     borderRadius: 40,
  //     marginLeft: 20,
  //     marginRight: 20,
  //     marginTop: 30,
  //     minHeight: 20,
  //   },
  //   titleStyle: {
  //     color: Colors.light.fontMainColor,
  //   },
  // });
}
