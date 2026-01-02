// // //
// // import { useApptheme } from "@/lib/context/theme.context";
// // import { Text, View } from "react-native";

// // export default function PrintOrderMain() {
// //   // Hooks
// //   const { appTheme } = useApptheme();
// //   return (
// //     <View
// //       className="flex flex-col h-full items-center"
// //       style={{ backgroundColor: appTheme.themeBackground }}
// //     >
// //       <Text>Print Order Screen</Text>
// //     </View>
// //   );
// // }

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Button,
//   FlatList,
//   Alert,
//   Platform,
//   ToastAndroid,
// } from "react-native";
// import { ReactNativePosPrinter } from "react-native-thermal-pos-printer";
// import {
//   requestBluetoothPermissions,
//   checkBluetoothEnabled,
//   formatReceipt,
// } from "../../../../../utils/methods/thermal-print";

// export default function PrintOrderMain() {
//   const [devices, setDevices] = useState([]);
//   const [scanning, setScanning] = useState(false);

//   // Scan for printers
//   const initAndScan = async () => {
//     setScanning(true);
//     const permissionsGranted = await requestBluetoothPermissions();
//     if (!permissionsGranted) {
//       setScanning(false);
//       return;
//     }

//     const bluetoothEnabled = await checkBluetoothEnabled();
//     if (!bluetoothEnabled) {
//       setScanning(false);
//       return;
//     }

//     try {
//       await ReactNativePosPrinter.init();
//       const list = await ReactNativePosPrinter.getDeviceList();
//       setDevices(list);
//       if (list.length === 0) {
//         Alert.alert(
//           "No Printers Found",
//           "No Bluetooth printers were detected nearby."
//         );
//       }
//     } catch (err) {
//       console.error("Scan error:", err);
//       Alert.alert("Error", "Failed to scan for printers.");
//     } finally {
//       setScanning(false);
//     }
//   };

//   // Connect and print formatted receipt
//   const connectAndPrint = async (printer) => {
//     try {
//       Alert.alert("Connecting", `Connecting to ${printer.name}...`);
//       await printer.connect({ timeout: 7000 });

//       if (Platform.OS === "android") {
//         ToastAndroid.show(`Connected to ${printer.name}`, ToastAndroid.SHORT);
//       } else {
//         Alert.alert("Connected", `Connected to ${printer.name}`);
//       }

//       // Dummy receipt data
//       const itemsText = `
// 1x Margherita Pizza     $12.00
// 2x Coke                 $6.00
// 1x Garlic Bread         $5.00
// `;

//       const receiptText = formatReceipt(
//         "john.doe@email.com", // email
//         "+1 234 567 8900", // phone
//         "123 Main Street, NY", // address
//         "ORD-10245", // orderId
//         "Delivery", // orderType
//         "Credit Card", // paymentMethod
//         itemsText, // itemsText
//         1.8, // tax
//         2.0, // tip
//         3.5, // deliveryCharges
//         30.3, // orderAmount
//         30.3, // paidAmount
//         "$" // currencySymbol
//       );

//       await printer.printText(receiptText + "\n\n", {
//         encoding: "utf8",
//         align: "LEFT",
//         size: 18,
//       });

//       await printer.disconnect();
//       Alert.alert("Success", "Receipt printed successfully!");
//     } catch (err) {
//       console.error("Print failed:", err);
//       Alert.alert(
//         "Print Failed",
//         "Failed to print the receipt. Please check the printer."
//       );
//     }
//   };

//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       <Button
//         title={scanning ? "Scanning..." : "Scan Printers"}
//         onPress={initAndScan}
//         disabled={scanning}
//       />

//       <FlatList
//         keyExtractor={(item) => item.address}
//         data={devices}
//         ListEmptyComponent={() => (
//           <Text style={{ marginTop: 20, textAlign: "center" }}>
//             {scanning ? "Scanning for printers..." : "No printers found."}
//           </Text>
//         )}
//         renderItem={({ item }) => (
//           <View
//             style={{
//               marginVertical: 10,
//               padding: 10,
//               borderWidth: 1,
//               borderRadius: 6,
//             }}
//           >
//             <Text style={{ fontWeight: "bold" }}>Name: {item.name}</Text>
//             <Text>Address: {item.address}</Text>
//             <Button
//               title="Print Receipt"
//               onPress={() => connectAndPrint(item)}
//             />
//           </View>
//         )}
//       />
//     </View>
//   );
// }
import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  Alert,
  Platform,
  ToastAndroid,
} from "react-native";
import { ReactNativePosPrinter } from "react-native-thermal-pos-printer";
import { useNavigation } from "@react-navigation/native";
import {
  requestBluetoothPermissions,
  checkBluetoothEnabled,
  formatReceipt,
} from "../../../../../utils/methods/thermal-print";
import { router, useLocalSearchParams } from "expo-router";
import useOrders from "@/lib/hooks/useOrders";
import { IOrder } from "@/lib/utils/interfaces/order.interface";

export default function PrintOrderMain() {
  const { loading, error, data } = useOrders();
  const [devices, setDevices] = useState([]);
  const [connectedPrinter, setConnectedPrinter] = useState(null);
  const [scanning, setScanning] = useState(false);

  const navigation = useNavigation();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  /* ---------------- Scan Printers ---------------- */
  const initAndScan = async () => {
    setScanning(true);

    if (!(await requestBluetoothPermissions())) {
      setScanning(false);
      return;
    }

    if (!(await checkBluetoothEnabled())) {
      setScanning(false);
      return;
    }

    try {
      await ReactNativePosPrinter.init();
      const list = await ReactNativePosPrinter.getDeviceList();
      console.log("Discovered printers:", list);
      setDevices(list);

      if (!list.length) {
        Alert.alert(
          "No Printers Found",
          "No Bluetooth printers were detected."
        );
      }
    } catch (err) {
      console.error("Scan error:", err);
      Alert.alert("Scan Failed", "Unable to scan printers.");
    } finally {
      setScanning(false);
    }
  };

  /* ---------------- Connect Printer ---------------- */
  const connectPrinter = async (item) => {
    const { device } = item;

    try {
      Alert.alert("Connecting", `Connecting to ${device.name}...`);

      await ReactNativePosPrinter.connectPrinter(device.address, {
        type: device.type,
      });

      setConnectedPrinter(device);

      Platform.OS === "android"
        ? ToastAndroid.show("Printer connected", ToastAndroid.SHORT)
        : Alert.alert("Connected", "Printer connected successfully");
    } catch (err) {
      console.error("Connection failed:", err);
      Alert.alert("Connection Failed", "Unable to connect to the printer.");
    }
  };

  /* ---------------- Go to Preview ---------------- */
  const goToPreview = () => {
    const order = data.restaurantOrders.find(
      (order: IOrder) => order._id === orderId
    );
    const receiptText = formatReceipt(order);

    router.push({
      pathname: "/home/receipt-preview",
      params: {
        receiptText,
        orderId: orderId || "",
      },
    });
  };

  /* ---------------- UI ---------------- */
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button
        title={scanning ? "Scanning..." : "Scan Printers"}
        onPress={initAndScan}
        disabled={scanning}
      />

      <FlatList
        data={devices}
        keyExtractor={(item) => item.device.address}
        ListEmptyComponent={() => (
          <Text style={{ marginTop: 20, textAlign: "center" }}>
            {scanning ? "Scanning for printers..." : "No printers found"}
          </Text>
        )}
        renderItem={({ item }) => {
          const { device } = item;
          const isConnected = connectedPrinter?.address === device.address;

          return (
            <View
              style={{
                padding: 12,
                marginVertical: 8,
                borderWidth: 1,
                borderRadius: 6,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{device.name}</Text>
              <Text>{device.address}</Text>

              {isConnected ? (
                <Button title="Preview Receipt" onPress={goToPreview} />
              ) : (
                <Button
                  title="Connect & Pair"
                  onPress={() => connectPrinter(item)}
                />
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
