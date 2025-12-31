import { PermissionsAndroid, Platform } from "react-native";

export async function requestBluetoothPermissions() {
  if (Platform.OS === "android") {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
  }
}


export const formatReceipt = (email, phone, address, orderId,orderType, paymentMethod, itemsText, tax, tip, deliveryCharges, orderAmount, paidAmount,currencySymbol) => {
  const text = `
    *** ORDER RECEIPT ***
    ---------------------------
    Customer: ${email || "-"}
    Phone: ${phone || "-"}
    Address: ${address}
    Order ID: ${orderId}
    Payment Method: ${paymentMethod}
    Order Type: ${orderType}
    ---------------------------
    ${itemsText}
    ---------------------------
    Tax:           ${currencySymbol}${tax.toFixed(2)}
    Tip:           ${currencySymbol}${tip.toFixed(2)}
    Delivery ch.:  ${currencySymbol}${deliveryCharges.toFixed(2)}
    ---------------------------
    Total:         ${currencySymbol}${orderAmount.toFixed(2)}
    Paid:          ${currencySymbol}${paidAmount.toFixed(2)}
    ---------------------------
    Thank you for your business!
`;

  return text.trim();
};
