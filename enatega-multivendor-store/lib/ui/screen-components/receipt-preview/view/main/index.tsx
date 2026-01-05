import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  Alert,
  Platform,
  ToastAndroid,
} from "react-native";
import {
  ESCPOSCommands,
  ReactNativePosPrinter,
  
} from "react-native-thermal-pos-printer";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { wrapText } from "@/lib/utils/methods/thermal-print";

export default function ReceiptPreviewMain() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { receiptText } = route.params;

  const [printing, setPrinting] = useState(false);
  const insets = useSafeAreaInsets();

  /* ---------------- Print Receipt ---------------- */
  // const printReceipt = async () => {
  //   try {
  //     setPrinting(true);

  //     //   await ReactNativePosPrinter.printText(
  //     //     receiptText + "\n\n",
  //     //     {
  //     //       encoding: "utf8",
  //     //       align: "LEFT",
  //     //       size: 18,
  //     //     }
  //     //   );

  //     await ReactNativePosPrinter.printText(`${receiptText}`, {

  //       size: 8, // really small font to save paper
  //       align: 'LEFT', // left-aligned text
  //       bold: false, // no bold by default
  //     });

  //     await ReactNativePosPrinter.feedLine();
  //     await ReactNativePosPrinter.feedLine();
  //     await ReactNativePosPrinter.feedLine();
  //     await ReactNativePosPrinter.feedLine();
  //     await ReactNativePosPrinter.feedLine();
  //     await ReactNativePosPrinter.feedLine();
  //     await ReactNativePosPrinter.feedLine();
  //     await ReactNativePosPrinter.feedLine();
  //     await ReactNativePosPrinter.feedLine();
  //     await ReactNativePosPrinter.feedLine();
  //     await ReactNativePosPrinter.feedLine();
  //     await ReactNativePosPrinter.feedLine();
  //     await ReactNativePosPrinter.cutPaper();
  //     Platform.OS === "android"
  //       ? ToastAndroid.show("Receipt printed", ToastAndroid.SHORT)
  //       : Alert.alert("Success", "Receipt printed successfully");

  //     navigation.goBack();
  //   } catch (err) {
  //     console.error("Print error:", err);
  //     Alert.alert(
  //       "Print Failed",
  //       "Unable to print receipt. Please ensure the printer is connected."
  //     );
  //   } finally {
  //     setPrinting(false);
  //   }
  // };

  const printReceipt = async () => {
  try {
    setPrinting(true);

    // Reset printer
    // await ReactNativePosPrinter.resetPrinter();
    
    // Use printText with proper options for Hebrew
    await ReactNativePosPrinter.printText(receiptText, {
      // encoding: "utf8",
      align: "LEFT",
      size: 9,
      fontType: "B", // Try different font types for better Hebrew support
      bold: false,
    });

    // Add line feeds
       await ReactNativePosPrinter.feedLine();
      await ReactNativePosPrinter.feedLine();
      await ReactNativePosPrinter.feedLine();
      await ReactNativePosPrinter.feedLine();
      await ReactNativePosPrinter.feedLine();
      await ReactNativePosPrinter.feedLine();

    
      await ReactNativePosPrinter.cutPaper();
    
    // Cut paper
    await ReactNativePosPrinter.cutPaper();

    Platform.OS === "android"
      ? ToastAndroid.show("Receipt printed", ToastAndroid.SHORT)
      : Alert.alert("Success", "Receipt printed successfully");

    navigation.goBack();
  } catch (err) {
    console.error("Print error:", err);
    Alert.alert(
      "Print Failed",
      "Unable to print receipt. Please ensure the printer is connected."
    );
  } finally {
    setPrinting(false);
  }
};

  // const printReceipt = async () => {
  //   try {
  //     setPrinting(true);

  //     // 1️⃣ Initialize printer (reset)
  //     await ReactNativePosPrinter.sendRawCommand([...ESCPOSCommands.INIT]);

  //     // 2️⃣ Align Left
  //     await ReactNativePosPrinter.sendRawCommand([
  //       ...ESCPOSCommands.ALIGN_LEFT,
  //     ]);

  //     // 3️⃣ Print the formatted receipt text
  //     console.log("Printing receipt text:", receiptText.split("\n"));

  //     // for (const line of receiptText.split("\n")) {
  //     //   const encodedLine = new TextEncoder().encode(line + "\n");
  //     //   console.log("Encoded line:", encodedLine);
  //     //   // await ReactNativePosPrinter.sendRawCommand([...encodedLine]);
  //     //   await ReactNativePosPrinter.printText(line, {
  //     //     // align: "LEFT",
  //     //     // size: "SMALL",
  //     //     // fontType: "A",
  //     //     // bold: false,
  //     //   });
  //     //   // move to next line

  //     // }

  //     await ReactNativePosPrinter.printText(receiptText, {
  //       // align: "LEFT",
  //       // size: "SMALL",
  //       // fontType: "A",
  //       // bold: false,
        
  //     });

  //     // await ReactNativePosPrinter.printText(
  //     //   '1x קולה גדול (קולה גדול) R15.00 1x 2nd: 1x קולה גדול (קולה גדול) R15.00 1x 3rd: 1x קולה גדול (קולה גדול) R15.00 1x 4Th:',
  //     //   {
  //     //     // align: "LEFT",
  //     //     // size: 10,
  //     //     // fontType: "B",
  //     //     // bold: false,

  //     //   }
  //     // );
  //     // move to next line
  //     // await ReactNativePosPrinter.feedLine();

  //     // 4️⃣ Add vertical padding (3–5 lines)
  //     await ReactNativePosPrinter.sendRawCommand([...ESCPOSCommands.LINE_FEED]);
  //     await ReactNativePosPrinter.sendRawCommand([...ESCPOSCommands.LINE_FEED]);
  //     await ReactNativePosPrinter.sendRawCommand([...ESCPOSCommands.LINE_FEED]);
  //     await ReactNativePosPrinter.sendRawCommand([...ESCPOSCommands.LINE_FEED]);
  //     await ReactNativePosPrinter.sendRawCommand([...ESCPOSCommands.LINE_FEED]);
  //     await ReactNativePosPrinter.sendRawCommand([...ESCPOSCommands.LINE_FEED]);
  //     await ReactNativePosPrinter.sendRawCommand([...ESCPOSCommands.LINE_FEED]);

  //     // 5️⃣ Cut paper
  //     await ReactNativePosPrinter.sendRawCommand([...ESCPOSCommands.CUT_PAPER]);

  //     Platform.OS === "android"
  //       ? ToastAndroid.show("Receipt printed", ToastAndroid.SHORT)
  //       : Alert.alert("Success", "Receipt printed successfully");

  //     navigation.goBack();
  //   } catch (err) {
  //     console.error("Print error:", err);
  //     Alert.alert(
  //       "Print Failed",
  //       "Unable to print receipt. Please ensure the printer is connected."
  //     );
  //   } finally {
  //     setPrinting(false);
  //   }
  // };

  /* ---------------- UI ---------------- */
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <ScrollView
        style={{
          flex: 1,
          borderWidth: 1,
          borderRadius: 6,
          padding: 12,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
          }}
        >
          {receiptText}
        </Text>
      </ScrollView>

      <View style={{ gap: 12, paddingBottom: insets.bottom }}>
        <Button
          title={printing ? "Printing..." : "Print Receipt"}
          onPress={printReceipt}
          disabled={printing}
        />

        <Button
          title="Cancel"
          color="gray"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
}
