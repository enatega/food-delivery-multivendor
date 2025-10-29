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

export default function usePrintOrder() {
  const configuration = useContext(ConfigurationContext);
  const { printer, setPrinter } = useContext(Restaurant.Context);
  const { loading, error, data } = useOrders();

  // States
  const [pairedDevices, setPairedDevices] = useState<any[]>([]);
  const [status, setStatus] = useState("Idle");

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
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
    if (!loading && !error) {
      await requestBluetoothPermissions();

      const order = data.restaurantOrders.find(
        (order: IOrder) => order._id === id
      );

        const devices = await ThermalPrinterModule.getBluetoothDeviceList();
        if(devices?.length !== 0) {
          alert("No printer found. Please connect to the thermal printer by pairing using Bluetooth.")
        }

      await printReceipt({
        ...order,
        currencySymbol: configuration?.currencySymbol,
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
