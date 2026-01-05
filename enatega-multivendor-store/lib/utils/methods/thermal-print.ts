import React from "react";
import {
  PermissionsAndroid,
  Platform,
  Alert,
  ToastAndroid,
  Linking,
} from "react-native";
import { ReactNativePosPrinter } from "react-native-thermal-pos-printer";

/**
 * Request Bluetooth permissions (Android 12+)
 */
export async function requestBluetoothPermissions() {
  if (Platform.OS !== "android") return true;

  try {
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    const allGranted = Object.values(result).every(
      (status) => status === PermissionsAndroid.RESULTS.GRANTED
    );

    if (!allGranted) {
      Alert.alert(
        "Permissions Required",
        "Bluetooth permissions are required to connect to the printer."
      );
      return false;
    }

    return true;
  } catch (err) {
    console.error("Permission request error:", err);
    Alert.alert("Error", "Failed to request Bluetooth permissions.");
    return false;
  }
}

/**
 * Check if Bluetooth is enabled
 * Uses plugin error states (NO extra plugin needed)
 */
export async function checkBluetoothEnabled(): Promise<boolean> {
  try {
    await ReactNativePosPrinter.getDeviceList();
    return true;
  } catch (err: any) {
    const errorCode = err?.code;
    const message = err?.message?.toLowerCase?.() ?? "";

    // 1️⃣ Explicit native error codes (BEST CASE)
    switch (errorCode) {
      case "BLUETOOTH_DISABLED":
        showBluetoothDisabledAlert();
        return false;

      case "BLUETOOTH_NOT_AVAILABLE":
        Alert.alert(
          "Bluetooth Not Supported",
          "This device does not support Bluetooth printing."
        );
        return false;
    }

    // 2️⃣ Message-based fallback (REAL-WORLD CASE)
    // Example:
    // "Failed to get device list: Bluetooth is disabled"
    if (message.includes("bluetooth is disabled")) {
      showBluetoothDisabledAlert();
      return false;
    }

    if (message.includes("bluetooth not available")) {
      Alert.alert(
        "Bluetooth Not Supported",
        "This device does not support Bluetooth printing."
      );
      return false;
    }

    // 3️⃣ Unknown / unexpected error
    console.error("Bluetooth check error:", err);

    Alert.alert(
      "Bluetooth Error",
      "Unable to access Bluetooth. Please try again or restart your device."
    );

    return false;
  }
}

function showBluetoothDisabledAlert() {
  Alert.alert(
    "Bluetooth is Off",
    "Please enable Bluetooth to connect to the printer.",
    Platform.OS === "android"
      ? [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(),
          },
        ]
      : [{ text: "OK" }]
  );
}

/**
 * Print receipt using connected printer
 */
export async function printReceipt(printer, receiptText) {
  try {
    if (!printer) {
      Alert.alert("No Printer Selected");
      return;
    }

    await printer.connect({ timeout: 7000 });

    Platform.OS === "android"
      ? ToastAndroid.show("Printer connected", ToastAndroid.SHORT)
      : Alert.alert("Connected");

    await printer.printText(receiptText + "\n\n", {
      encoding: "utf8",
      align: "LEFT",
      size: 18,
    });

    await printer.disconnect();

    Alert.alert("Success", "Receipt printed successfully!");
  } catch (err) {
    console.error("Print error:", err);
    Alert.alert(
      "Print Failed",
      "Failed to print receipt. Please check the printer."
    );
  }
}

/**
 * Format receipt safely with defaults
 */
// export const formatReceipt = (
//   email,
//   phone,
//   address,
//   orderId,
//   orderType,
//   paymentMethod,
//   itemsText,
//   tax = 0,
//   tip = 0,
//   deliveryCharges = 0,
//   orderAmount = 0,
//   paidAmount = 0,
//   currencySymbol = "$"
// ) => {
//   return `
// *** ORDER RECEIPT ***
// ---------------------------
// Customer: ${email || "-"}
// Phone: ${phone || "-"}
// Address: ${address || "-"}
// Order ID: ${orderId || "-"}
// Payment Method: ${paymentMethod || "-"}
// Order Type: ${orderType || "-"}
// ---------------------------
// ${itemsText || "-"}
// ---------------------------
// Tax:           ${currencySymbol}${tax.toFixed(2)}
// Tip:           ${currencySymbol}${tip.toFixed(2)}
// Delivery ch.:  ${currencySymbol}${deliveryCharges.toFixed(2)}
// ---------------------------
// Total:         ${currencySymbol}${orderAmount.toFixed(2)}
// Paid:          ${currencySymbol}${paidAmount.toFixed(2)}
// ---------------------------
// Thank you for your business!
// `.trim();
// };

// export const formatReceipt = (order) => {
//   const address = order.isPickedup
//     ? "PICKUP"
//     : `${order.deliveryAddress?.label || ""} ${order.deliveryAddress?.deliveryAddress || order.deliveryAddress?.details || ""}`.trim();

//   const addressLines = address ? wrapAddress(address) : [];

//   const {
//     user: { email, phone, name } = {},
//     taxationAmount: tax = 0,
//     tipping: tip = 0,
//     paidAmount = 0,
//     orderAmount = 0,
//     deliveryCharges = 0,
//     currencySymbol = "R",
//     orderId,
//     paymentMethod,
//     instructions,
//   } = order;

//   const itemsText = order.items
//     ?.map((item) => {
//       if (!item) return "";

//       const addonsText =
//         item.addons
//           ?.map((addon) => {
//             console.log("item addons:", addon);
//             return `${addon.title}: ${addon.options
//               .map(
//                 (option) =>
//                   `${option.title} ${currencySymbol}${option.price.toFixed(2)}`
//               )
//               .join(", ")}`;
//             })
//           .join("\n  - ") || "";

//       console.log("item addonsText:", addonsText);

//       const variationText = item.variation?.title
//         ? ` (${item.variation.title})`
//         : "";

//       const addonsSection = addonsText ? `\n  - ${addonsText}` : "";

//       const itemPrice = item.variation?.price || 0;

//       return `${item.quantity}x ${item.title}${variationText} ${currencySymbol}${itemPrice.toFixed(2)}${addonsSection}`;
//     })
//     .filter(Boolean)
//     .join("\n");

//     console.log("itemsText:", itemsText);
//   // Build receipt
//   let text = "";
//   text += "*** ORDER RECEIPT ***\n";
//   text += "========================\n";

//   if (name || email || phone || addressLines.length) {
//     text += "--- Customer Details ---\n";
//     if (name || email) text += `Customer: ${name || email}\n`;
//     if (phone) text += `Phone: ${phone}\n`;
//     if (addressLines.length) {
//       text += "Address:\n";
//       text += addressLines.map((line) => `${line}`).join("\n") + "\n";
//     }
//   }

//   text += "--- Order Details ---\n";
//   if (orderId) text += `Order ID: ${orderId}\n`;
//   if (paymentMethod) text += `Payment Method: ${paymentMethod}\n`;
//   text += `Order Type: ${order.isPickedup ? "Pickup" : "Delivery"}\n`;

//   if (itemsText) {
//     text += "--- Items ---\n";
//     text += itemsText + "\n";
//   }

//   text += "--- Surcharge ---\n";
//   text += `Tax:           ${currencySymbol}${tax.toFixed(2)}\n`;
//   text += `Tip:           ${currencySymbol}${tip.toFixed(2)}\n`;
//   text += `Delivery ch.:  ${currencySymbol}${deliveryCharges.toFixed(2)}\n`;

//   if (instructions) {
//     text += "--- Instructions ---\n";
//     text += instructions + "\n";
//   }

//   text += "------------------------\n";
//   text += `TOTAL: ${currencySymbol}${orderAmount.toFixed(2)}\n`;
//   text += "------------------------\n";
//   text += "Thank you for your business!\n";

//   return text;
// };

const wrapAddress = (address: string, maxLength = 48) => {
  const words = address.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length > maxLength) {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  }

  if (currentLine.trim()) lines.push(currentLine.trim());
  return lines;
};

export const wrapText = (text: string, maxLength: number) => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length > maxLength) {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  }

  if (currentLine.trim()) lines.push(currentLine.trim());
  return lines.join("\n");
};

// export const formatReceipt = (order) => {
//   const MAX_CHARS = 48; // 80mm Font A

//   const LTR = (text = "") => ``;

//   const address = order.isPickedup
//     ? "PICKUP"
//     : `${order.deliveryAddress?.label || ""} ${order.deliveryAddress?.deliveryAddress || order.deliveryAddress?.details || ""}`.trim();

//   const addressLines = address ? wrapText(address, MAX_CHARS).split("\n") : [];

//   const {
//     user: { email, phone, name } = {},
//     taxationAmount: tax = 0,
//     tipping: tip = 0,
//     paidAmount = 0,
//     orderAmount = 0,
//     deliveryCharges = 0,
//     currencySymbol = "R",
//     orderId,
//     paymentMethod,
//     instructions,
//   } = order;

//   // Format Items
//   const itemsText = order.items
//     ?.map((item) => {
//       if (!item) return "";

//       const variationText = item.variation?.title
//         ? ` (${item.variation.title})`
//         : "";
//       const priceStr = `${currencySymbol}${(item.variation?.price || 0).toFixed(2)}`;

//       // Wrap long item name
//       const nameLine = wrapText(
//         `${item.quantity}x ${item.title}${variationText}`,
//         MAX_CHARS - priceStr.length
//       ).trim();

//       const baseLine = LTR(`${nameLine} ${priceStr}`);

//       const addons =
//         item.addons
//           ?.map((addon) => {
//             const optionsText = addon.options
//               ?.map(
//                 (option) =>
//                   `${option.title} ${currencySymbol}${option.price.toFixed(2)}`
//               )
//               .join(", ");
//             return LTR(`  - ${addon.title}: ${optionsText}`);
//           })
//           .join("\n") || "";

//       return addons ? `${baseLine}\n${addons}` : baseLine;
//     })
//     .filter(Boolean)
//     .join("\n");

//   let text = "";

//   text += wrapText("*** ORDER RECEIPT ***", MAX_CHARS) + "\n";
//   text += "-".repeat(MAX_CHARS) + "\n";

//   if (name || email || phone || addressLines.length) {
//     text += "--- Customer Details ---\n";
//     if (name || email) text += LTR(`Customer: ${name || email}`) + "\n";
//     if (phone) text += LTR(`Phone: ${phone}`) + "\n";
//     if (addressLines.length) {
//       text += "Address:\n";
//       text += addressLines.map((line) => LTR(line)).join("\n") + "\n";
//     }
//   }

//   text += "--- Order Details ---\n";
//   if (orderId) text += LTR(`Order ID: ${orderId}`) + "\n";
//   if (paymentMethod) text += LTR(`Payment Method: ${paymentMethod}`) + "\n";
//   text += LTR(`Order Type: ${order.isPickedup ? "Pickup" : "Delivery"}`) + "\n";

//   if (itemsText) {
//     text += "--- Items ---\n";
//     text += itemsText + "\n";
//   }

//   text += "--- Surcharge ---\n";
//   text += LTR(`Tax: ${currencySymbol}${tax.toFixed(2)}`) + "\n";
//   text += LTR(`Tip: ${currencySymbol}${tip.toFixed(2)}`) + "\n";
//   text +=
//     LTR(`Delivery ch.: ${currencySymbol}${deliveryCharges.toFixed(2)}`) + "\n";

//   if (instructions) {
//     text += "--- Instructions ---\n";
//     text += wrapText(instructions, MAX_CHARS) + "\n";
//   }

//   text += "-".repeat(MAX_CHARS) + "\n";
//   text += LTR(`TOTAL: ${currencySymbol}${orderAmount.toFixed(2)}`) + "\n";
//   text += "-".repeat(MAX_CHARS) + "\n";
//   text += LTR("Thank you for your business!") + "\n";

//   return text;
// };


export const formatReceipt = (order) => {
  const MAX_CHARS = 48;
  
  // Use explicit LTR marker for Hebrew text
  const LTR = (text = "") => text; // Remove the backticks - they were causing issues

  // Reverse Hebrew text for proper printing (if needed)
  const reverseHebrew = (text) => {
    if (!text) return text;
    // Check if text contains Hebrew characters
    const hebrewRegex = /[\u0590-\u05FF]/;
    if (!hebrewRegex.test(text)) return text;
    
    // Split by lines and reverse each line
    return text.split('\n').map(line => {
      const words = line.split(' ');
      return words.map(word => 
        hebrewRegex.test(word) ? word.split('').reverse().join('') : word
      ).join(' ');
    }).join('\n');
  };

  const address = order.isPickedup
    ? "PICKUP"
    : `${order.deliveryAddress?.label || ""} ${order.deliveryAddress?.deliveryAddress || order.deliveryAddress?.details || ""}`.trim();

  const addressLines = address ? wrapText(address, MAX_CHARS).split("\n") : [];

  const {
    user: { email, phone, name } = {},
    taxationAmount: tax = 0,
    tipping: tip = 0,
    paidAmount = 0,
    orderAmount = 0,
    deliveryCharges = 0,
    currencySymbol = "R",
    orderId,
    paymentMethod,
    instructions,
  } = order;

  // Format Items
  const itemsText = order.items
    ?.map((item) => {
      if (!item) return "";

      const variationText = item.variation?.title
        ? ` (${item.variation.title})`
        : "";
      const priceStr = `${currencySymbol}${(item.variation?.price || 0).toFixed(2)}`;

      // Wrap long item name
      const nameLine = wrapText(
        `${item.quantity}x ${item.title}${variationText}`,
        MAX_CHARS - priceStr.length
      ).trim();

      const baseLine = LTR(`${nameLine} ${priceStr}`);

      const addons =
        item.addons
          ?.map((addon) => {
            const optionsText = addon.options
              ?.map(
                (option) =>
                  `${option.title} ${currencySymbol}${option.price.toFixed(2)}`
              )
              .join(", ");
            return LTR(`  - ${addon.title}: ${optionsText}`);
          })
          .join("\n") || "";

      return addons ? `${baseLine}\n${addons}` : baseLine;
    })
    .filter(Boolean)
    .join("\n");

  let text = "";

  text += wrapText("*** ORDER RECEIPT ***", MAX_CHARS) + "\n";
  text += "-".repeat(MAX_CHARS) + "\n";

  if (name || email || phone || addressLines.length) {
    text += "--- Customer Details ---\n";
    if (name || email) text += LTR(`Customer: ${name || email}`) + "\n";
    if (phone) text += LTR(`Phone: ${phone}`) + "\n";
    if (addressLines.length) {
      text += "Address:\n";
      text += addressLines.map((line) => LTR(line)).join("\n") + "\n";
    }
  }

  text += "--- Order Details ---\n";
  if (orderId) text += LTR(`Order ID: ${orderId}`) + "\n";
  if (paymentMethod) text += LTR(`Payment Method: ${paymentMethod}`) + "\n";
  text += LTR(`Order Type: ${order.isPickedup ? "Pickup" : "Delivery"}`) + "\n";

  if (itemsText) {
    text += "--- Items ---\n";
    text += itemsText + "\n";
  }

  text += "--- Surcharge ---\n";
  text += LTR(`Tax: ${currencySymbol}${tax.toFixed(2)}`) + "\n";
  text += LTR(`Tip: ${currencySymbol}${tip.toFixed(2)}`) + "\n";
  text +=
    LTR(`Delivery ch.: ${currencySymbol}${deliveryCharges.toFixed(2)}`) + "\n";

  if (instructions) {
    text += "--- Instructions ---\n";
    text += wrapText(instructions, MAX_CHARS) + "\n";
  }

  text += "-".repeat(MAX_CHARS) + "\n";
  text += LTR(`TOTAL: ${currencySymbol}${orderAmount.toFixed(2)}`) + "\n";
  text += "-".repeat(MAX_CHARS) + "\n";
  text += LTR("Thank you for your business!") + "\n";

  // Apply Hebrew reversal if needed
  // Uncomment if Hebrew appears reversed on receipt:
  // return reverseHebrew(text);
  
  return text;
};