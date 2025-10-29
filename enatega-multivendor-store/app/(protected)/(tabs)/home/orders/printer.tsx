import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from "react-native";
import ThermalPrinterModule from "react-native-thermal-printer";

export default function BluetoothPrinter() {
  const [pairedDevices, setPairedDevices] = useState<any[]>([]);
  const [status, setStatus] = useState("Idle");

  useEffect(() => {
    requestBluetoothPermissions();
  }, []);

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    }
  };

  const getPairedPrinters = async () => {
    try {
      const devices = await ThermalPrinterModule.getBluetoothDeviceList();
      setPairedDevices(devices);
      setStatus(`Found ${devices.length} paired devices`);
    } catch (err: any) {
      setStatus("Error fetching paired devices: " + err.message);
    }
  };

  const printTest = async (printerName: string) => {
    try {
      const text = `
        *** STORE RECEIPT ***
        Order #12345
        ---------------
        2x Burger       $10.00
        1x Fries        $3.00
        ---------------
        Total:          $13.00
        Thank you!
      `;
      await ThermalPrinterModule.printBluetooth({
        payload: text,
        // printerName, // required
        // cut: false,
        // beep: false,
      });
      setStatus(`Printed successfully on ${printerName}`);
    } catch (err: any) {
      setStatus("Print failed: " + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{status}</Text>
      <Button title="Scan for Printers" onPress={getPairedPrinters} />
      {pairedDevices.map((d, idx) => (
        <Button
          key={idx}
          title={`Print Test on ${d.name}`}
          onPress={() => printTest(d.name)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  status: { marginBottom: 20, fontSize: 16, textAlign: "center" },
});
