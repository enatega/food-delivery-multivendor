import { Alert, Linking } from "react-native";

const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters except '+'
  return phone.replace(/[^\d+]/g, "");
};

// export const callNumber = (phone: string) => {
//   let phoneNumber = phone;
//   if (Platform.OS !== "android") {
//     phoneNumber = `telprompt:${phone}`;
//   } else {
//     phoneNumber = `tel:${phone}`;
//   }

//   phoneNumber = formatPhoneNumber(phoneNumber);
//   console.log({ phoneNumber });

//   Linking.canOpenURL(phoneNumber)
//     .then((supported) => {
//       if (!supported) {
//         Alert.alert("Phone number is not available");
//       } else {
//         return Linking.openURL(phoneNumber);
//       }
//     })
//     .catch((err) => console.log(err));
// };

export const callNumber = async (phoneNumber: string) => {
  const formattedNumber = formatPhoneNumber(phoneNumber);
  const url = `tel:${formattedNumber}`;

  const supported = await Linking.canOpenURL(url);
  if (supported) {
    Linking.openURL(url);
  } else {
    Alert.alert("Error", "Calling is not supported on this device");
  }
};
