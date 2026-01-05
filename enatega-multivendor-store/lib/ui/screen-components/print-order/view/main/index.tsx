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
// import { useNavigation } from "@react-navigation/native";
// import {
//   requestBluetoothPermissions,
//   checkBluetoothEnabled,
//   formatReceipt,
// } from "../../../../../utils/methods/thermal-print";
// import { router, useLocalSearchParams } from "expo-router";
// import useOrders from "@/lib/hooks/useOrders";
// import { IOrder } from "@/lib/utils/interfaces/order.interface";

// export default function PrintOrderMain() {
//   const { loading, error, data } = useOrders();
//   const [devices, setDevices] = useState([]);
//   const [connectedPrinter, setConnectedPrinter] = useState(null);
//   const [scanning, setScanning] = useState(false);

//   const navigation = useNavigation();
//   const { orderId } = useLocalSearchParams<{ orderId?: string }>();
//   /* ---------------- Scan Printers ---------------- */
//   const initAndScan = async () => {
//     setScanning(true);

//     if (!(await requestBluetoothPermissions())) {
//       setScanning(false);
//       return;
//     }

//     if (!(await checkBluetoothEnabled())) {
//       setScanning(false);
//       return;
//     }

//     try {
//       await ReactNativePosPrinter.init();
//       const list = await ReactNativePosPrinter.getDeviceList();
//       console.log("Discovered printers:", list);
//       setDevices(list);

//       if (!list.length) {
//         Alert.alert(
//           "No Printers Found",
//           "No Bluetooth printers were detected."
//         );
//       }
//     } catch (err) {
//       console.error("Scan error:", err);
//       Alert.alert("Scan Failed", "Unable to scan printers.");
//     } finally {
//       setScanning(false);
//     }
//   };

//   /* ---------------- Connect Printer ---------------- */
//   const connectPrinter = async (item) => {
//     const { device } = item;

//     try {
//       Alert.alert("Connecting", `Connecting to ${device.name}...`);

//       await ReactNativePosPrinter.connectPrinter(device.address, {
//         type: device.type,
//       });

//       setConnectedPrinter(device);

//       Platform.OS === "android"
//         ? ToastAndroid.show("Printer connected", ToastAndroid.SHORT)
//         : Alert.alert("Connected", "Printer connected successfully");
//     } catch (err) {
//       console.error("Connection failed:", err);
//       Alert.alert("Connection Failed", "Unable to connect to the printer.");
//     }
//   };

//   /* ---------------- Go to Preview ---------------- */
//   const goToPreview = () => {
//     const order = data.restaurantOrders.find(
//       (order: IOrder) => order._id === orderId
//     );
//     const receiptText = formatReceipt(order);

//     router.push({
//       pathname: "/home/receipt-preview",
//       params: {
//         receiptText,
//         orderId: orderId || "",
//       },
//     });
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       <Button
//         title={scanning ? "Scanning..." : "Scan Printers"}
//         onPress={initAndScan}
//         disabled={scanning}
//       />

//       <FlatList
//         data={devices}
//         keyExtractor={(item) => item.device.address}
//         ListEmptyComponent={() => (
//           <Text style={{ marginTop: 20, textAlign: "center" }}>
//             {scanning ? "Scanning for printers..." : "No printers found"}
//           </Text>
//         )}
//         renderItem={({ item }) => {
//           const { device } = item;
//           const isConnected = connectedPrinter?.address === device.address;

//           return (
//             <View
//               style={{
//                 padding: 12,
//                 marginVertical: 8,
//                 borderWidth: 1,
//                 borderRadius: 6,
//               }}
//             >
//               <Text style={{ fontWeight: "bold" }}>{device.name}</Text>
//               <Text>{device.address}</Text>

//               {isConnected ? (
//                 <Button title="Preview Receipt" onPress={goToPreview} />
//               ) : (
//                 <Button
//                   title="Connect & Pair"
//                   onPress={() => connectPrinter(item)}
//                 />
//               )}
//             </View>
//           );
//         }}
//       />
//     </View>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  Platform,
  ToastAndroid,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { ReactNativePosPrinter } from "react-native-thermal-pos-printer";
import { useLocalSearchParams, router } from "expo-router";
import useOrders from "@/lib/hooks/useOrders";
import { IOrder } from "@/lib/utils/interfaces/order.interface";
import {
  requestBluetoothPermissions,
  checkBluetoothEnabled,
  formatReceipt,
} from "../../../../../utils/methods/thermal-print";

type ScreenState =
  | "loading"
  | "ready"
  | "error"
  | "bluetooth-off"
  | "permission-denied";

export default function PrintOrderMain() {
  const { data } = useOrders();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();

  const [devices, setDevices] = useState([]);
  const [screenState, setScreenState] = useState<ScreenState>("loading");
  const [connectingAddress, setConnectingAddress] = useState<string | null>(
    null
  );

  /* ---------------- Auto Scan ---------------- */
  useEffect(() => {
    scanPrinters();
  }, []);

  const scanPrinters = async () => {
    setScreenState("loading");
    setDevices([]);

    const permissionGranted = await requestBluetoothPermissions();
    if (!permissionGranted) {
      setScreenState("permission-denied");
      return;
    }

    const bluetoothEnabled = await checkBluetoothEnabled();
    if (!bluetoothEnabled) {
      setScreenState("bluetooth-off");
      return;
    }

    try {
      await ReactNativePosPrinter.init();
      const list = await ReactNativePosPrinter.getDeviceList();
      console.log("Discovered printers:", list);
      setDevices(list);
      setScreenState("ready");
    } catch (err) {
      console.error("Scan error:", err);
      setScreenState("error");
    }
  };

  /* ---------------- Connect & Auto Navigate ---------------- */
  const connectPrinter = async (item) => {
    const { device } = item;
    setConnectingAddress(device.address);

    try {
      await ReactNativePosPrinter.connectPrinter(device.address, {
        type: device.type,
      })
        .then(() => {
          onPrinterConnect();
        })
        .catch((e) => {
         
          setTimeout(() => {
            ReactNativePosPrinter.connectPrinter(device.address, {
              type: device.type,
            })
              .then(() => {
                onPrinterConnect();
              })
              .catch(() => {
                console.log("connect printer error:", e);
                Alert.alert(
                  `Connection Failed", "Unable to connect to ${device?.name}.`
                );
              });
          }, 500);
        });
    } catch (err) {
      Alert.alert(`Connection Failed", "Unable to connect to ${device?.name}.`);
    } finally {
    }
  };

  const onPrinterConnect = () => {
    setConnectingAddress(null);
    Platform.OS === "android"
      ? ToastAndroid.show("Printer connected", ToastAndroid.SHORT)
      : Alert.alert("Connected", "Printer connected successfully");

    const order = data.restaurantOrders.find((o: IOrder) => o._id === orderId);

    const receiptText = formatReceipt(order);

    router.replace({
      pathname: "/home/receipt-preview",
      params: {
        receiptText,
        orderId: orderId || "",
      },
    });
  };

  /* ---------------- Centered State UI ---------------- */
  const CenterState = ({
    title,
    subtitle,
  }: {
    title: string;
    subtitle?: string;
  }) => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
        {title}
      </Text>

      {subtitle && (
        <Text
          style={{
            fontSize: 14,
            color: "#666",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          {subtitle}
        </Text>
      )}

      <TouchableOpacity
        onPress={scanPrinters}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 28,
          borderRadius: 24,
          backgroundColor: "#000",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Scan Again</Text>
      </TouchableOpacity>
    </View>
  );

  /* ---------------- Screen States ---------------- */
  if (screenState === "loading") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12, fontSize: 16 }}>
          Searching for printers…
        </Text>
      </View>
    );
  }

  if (screenState === "permission-denied") {
    return (
      <CenterState
        title="Bluetooth Permission Required"
        subtitle="Please allow Bluetooth permission to search for printers."
      />
    );
  }

  if (screenState === "bluetooth-off") {
    return (
      <CenterState
        title="Bluetooth is Turned Off"
        subtitle="Please enable Bluetooth and try again."
      />
    );
  }

  if (screenState === "error") {
    return (
      <CenterState
        title="Something Went Wrong"
        subtitle="We couldn’t scan for printers."
      />
    );
  }

  /* ---------------- Main UI ---------------- */
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
        Select Printer
      </Text>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.device.address}
        ListEmptyComponent={() => (
          <CenterState
            title="No Printers Found"
            subtitle="Printer must be powered on and paired in Bluetooth settings."
          />
        )}
        renderItem={({ item }) => {
          const { device } = item;
          const isConnecting = connectingAddress === device.address;

          return (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 14,
                marginBottom: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#ddd",
                backgroundColor: "#fff",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600" }}>{device.name}</Text>
                <Text style={{ color: "#666", fontSize: 12 }}>
                  {device.address}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => connectPrinter(item)}
                disabled={isConnecting}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  backgroundColor: "#000",
                }}
              >
                {isConnecting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    Connect
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}
