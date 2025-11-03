import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

// Hooks
import useOrders from "./useOrders";

// Interface
import { IOrder } from "../utils/interfaces/order.interface";

// Methods
import { printAsync, selectPrinterAsync } from "../utils/methods/print";

// Context
import { ConfigurationContext } from "../context/global/configuration.context";
import Restaurant from "../context/global/restaurant";
import ThermalPrinterModule from "react-native-thermal-printer";
import { formatReceipt } from "../utils/methods/format-receipt";
import { FlashMessageComponent } from "../ui/useable-components";

export default function usePrintOrder() {
  const configuration = useContext(ConfigurationContext);
  const { printer, setPrinter } = useContext(Restaurant.Context);
  const { loading, error, data } = useOrders();

  // States
  const [pairedDevices, setPairedDevices] = useState<any[]>([]);
  const [status, setStatus] = useState("Idle");

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === "android") {
      const permissions = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      if (
        permissions["android.permission.BLUETOOTH_CONNECT"] !== "granted" ||
        permissions["android.permission.BLUETOOTH_SCAN"] !== "granted" ||
        permissions["android.permission.ACCESS_FINE_LOCATION"] !== "granted"
      ) {
        // alert("Bluetooth permissions not granted");
        FlashMessageComponent({
          message: "Bluetooth permissions not granted",
        });
        return false;
      }
      return true;
    }
  };

  const printReceipt = async (order: IOrder) => {
    try {
      const text = formatReceipt(order);

      await ThermalPrinterModule.printBluetooth({
        payload: text,

        // printerName, // required
        // cut: false,
        // beep: false,
      });
      setStatus(`Printed successfully`);
    } catch (err: any) {
      setStatus("Print failed: " + err.message);
    }
  };

  const printOrder = async (id: string) => {
    try {
      if (!loading && !error) {
        const status = await requestBluetoothPermissions();
        if (!status) return;

        const devices = await ThermalPrinterModule.getBluetoothDeviceList();

        if (devices?.length === 0) {
          // alert("No printer found. Please connect to the thermal printer by pairing using Bluetooth.")
          FlashMessageComponent({
            message:
              "No printer found. Please connect to the thermal printer by pairing using Bluetooth.",
          });
          return;
        }

        /**
         * Please use some kind of get-by-id API to fetch the order details
         * Current approach is very unoptmized and will down drastically if store order exceeds certain number.
         */
        const order = data.restaurantOrders.find(
          (order: IOrder) => order._id === id
        );

        await printReceipt({
          ...order,
          currencySymbol: configuration?.currencySymbol,
        });
      }
    } catch (err) {
      FlashMessageComponent({
        message:
          err?.message || "Something went wrong while print the receipt.",
      });
    }
  };
  const selectPrinter = async () => {
    const result = await selectPrinterAsync();
    if (result) {
      setPrinter(result);
      await AsyncStorage.setItem("printer", JSON.stringify(result));
    }
  };
  return { printOrder, printer, selectPrinter };
}
