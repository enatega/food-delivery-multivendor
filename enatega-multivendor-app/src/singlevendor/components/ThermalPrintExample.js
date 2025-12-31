import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import {
  ReactNativePosPrinter,
  ThermalPrinterDevice,
} from "react-native-thermal-pos-printer";

export default function ThermalPrintExample() {
  const [devices, setDevices] = useState([]);

  // initialize and scan printers
  const initAndScan = async () => {
    try {
      await ReactNativePosPrinter.init(); 
      const list = await ReactNativePosPrinter.getDeviceList(); 
      console.log("Devices found:", list);
      setDevices(list);
    } catch (err) {
      console.error("Scan error:", err);
    }
  };

  // connect and print to a printer
  const connectAndPrint = async (printer) => {
    try {
      await printer.connect({ timeout: 5000 }); // connect
      await printer.printText("🧾 RECEIPT\n", { align: "CENTER", size: 24 });
      await printer.printText("Item 1   $10.00\n", { align: "LEFT" });
      await printer.printText("Item 2   $15.00\n", { align: "LEFT" });
      await printer.printText("\nTOTAL: $25.00\n", { align: "RIGHT", size: 20 });
      await printer.disconnect();
      alert("Printed successfully!");
    } catch (err) {
      console.error("Print failed:", err);
    }
  };

  return (
    <View>
      <Button title="Scan Printers" onPress={initAndScan} />

      <FlatList
        keyExtractor={(item) => item.address}
        data={devices}
        renderItem={({ item }) => (
          <View style={{ margin: 10 }}>
            <Text>Name: {item.name}</Text>
            <Text>Address: {item.address}</Text>
            <Button
              title="Print Receipt"
              onPress={() => connectAndPrint(item)}
            />
          </View>
        )}
      />
    </View>
  );
}
//  const connectAndPrint = async (printer) => {
//     try {
//       await printer.connect({ timeout: 5000 }) // connect

//       const itemsText = `
//       1x Margherita Pizza     $12.00
//       2x Coke                 $6.00
//       1x Garlic Bread         $5.00
//     `

//       const receiptText = formatReceipt0(
//         'john.doe@email.com', // email
//         '+1 234 567 8900', // phone
//         '123 Main Street, NY', // address
//         'ORD-10245', // orderId
//         'Delivery', // orderType
//         'Credit Card', // paymentMethod
//         itemsText, // itemsText
//         1.8, // tax
//         2.0, // tip
//         3.5, // deliveryCharges
//         30.3, // orderAmount
//         30.3, // paidAmount
//         '$' // currencySymbol
//       )

//       await printer.printText(receiptText)
//       await printer.disconnect()
//       alert('Printed successfully!')
//     } catch (err) {
//       console.error('Print failed:', err)
//     }
//   }
