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
import { ReactNativePosPrinter } from "react-native-thermal-pos-printer";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReceiptPreviewMain() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { receiptText } = route.params;

  const [printing, setPrinting] = useState(false);
  const insets = useSafeAreaInsets();

  /* ---------------- Print Receipt ---------------- */
  const printReceipt = async () => {
    try {
      setPrinting(true);

      //   await ReactNativePosPrinter.printText(
      //     receiptText + "\n\n",
      //     {
      //       encoding: "utf8",
      //       align: "LEFT",
      //       size: 18,
      //     }
      //   );

      await ReactNativePosPrinter.printText(receiptText, {
        
        size: 8, // really small font to save paper
        align: 'LEFT', // left-aligned text
        bold: false, // no bold by default
      });
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
