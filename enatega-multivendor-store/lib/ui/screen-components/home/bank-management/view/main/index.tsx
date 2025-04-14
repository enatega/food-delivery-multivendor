// Components
import { UPDATE_BUSINESS_DETAILS } from "@/lib/apollo/mutations/rider.mutation";
import { STORE_PROFILE } from "@/lib/apollo/queries/store.query";
import { useUserContext } from "@/lib/context/global/user.context";
import { useApptheme } from "@/lib/context/theme.context";
import { CustomContinueButton } from "@/lib/ui/useable-components";

// Hooks
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, FlatList, KeyboardAvoidingView } from "react-native";

// Core
import {
  Keyboard,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";

export default function BankManagementMain() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  // Contexts
  const { userId, dataProfile } = useUserContext();

  // states
  const [isError, setIsError] = useState({
    field: "",
    message: "",
  });
  const [formData, setFormData] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    accountCode: "",
  });
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  // Mutations
  const [mutateBankDetails, { loading: areBankDetailsLoading }] = useMutation(
    UPDATE_BUSINESS_DETAILS,
    {
      onError: (error) => {
        showMessage({
          message: t("Failed to update bank details"),
          type: "danger",
        });
        console.error("Failed to update bank details", error);
      },
      onCompleted: () => {
        setFormData({
          bankName: "",
          accountName: "",
          accountNumber: "",
          accountCode: "",
        });
        setIsError({
          field: "",
          message: "",
        });
      },
      refetchQueries: [
        { query: STORE_PROFILE, variables: { restaurantId: userId } },
      ],
    },
  );

  // Handlers
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };
  const handleSubmit = async () => {
    try {
      if (!formData.bankName) {
        setIsError({
          field: "bankName",
          message: t("Bank Name is required"),
        });
        return showMessage({
          message: t("Bank Name is required"),
          type: "danger",
        });
      } else if (!formData.accountName) {
        setIsError({
          field: "accountName",
          message: t("Account Name is required"),
        });
        return showMessage({
          message: t("Account Name is required"),
          type: "danger",
        });
      } else if (!formData.accountNumber) {
        setIsError({
          field: "accountNumber",
          message: t("Account Number is required"),
        });
        return showMessage({
          message: t("Account Number is required"),
          type: "danger",
        });
      } else if (!formData.accountCode) {
        setIsError({
          field: "accountCode",
          message: t("Account Code is required"),
        });
        return showMessage({
          message: t("Account Code is required"),
          type: "danger",
        });
      }
      await mutateBankDetails({
        variables: {
          updateRestaurantBussinessDetailsId: userId,
          bussinessDetails: {
            bankName: formData.bankName,
            accountName: formData.accountName,
            accountNumber: String(formData.accountNumber),
            accountCode: formData.accountCode,
          },
        },
      });
      Alert.alert(
        t("Bank Details Updated"),
        t("Your bank details have been updated successfully"),
      );
    } catch (error) {
      console.log(error);
    }
  };

  // UseEffect
  useEffect(() => {
    if (
      !areBankDetailsLoading &&
      dataProfile?.bussinessDetails &&
      Object.values(dataProfile?.bussinessDetails).length > 0
    ) {
      setFormData({
        bankName: dataProfile?.bussinessDetails.bankName ?? "",
        accountName: dataProfile?.bussinessDetails.accountName ?? "",
        accountNumber: String(
          dataProfile?.bussinessDetails.accountNumber ?? "",
        ),
        accountCode: dataProfile?.bussinessDetails.accountCode ?? "",
      });
    }
  }, [dataProfile?.bussinessDetails, areBankDetailsLoading]);

  return (
    <View className="w-[95%] mx-auto">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* <ScrollView
          scrollEnabled={keyboardVisible}
          contentContainerClassName={`flex flex-col justify-between items-center w-full ${keyboardVisible ? "h-[100%]" : "h-[85%]"} my-6 px-4`}
        > */}
        <KeyboardAvoidingView
          className={`${keyboardVisible ? "h-[100%] " : "h-[85%"}`}
        >
          <FlatList
            data={[
              <View
                className={`flex flex-col w-full items-start justify-start  gap-2`}
              >
                <Text
                  className="text-lg font-normal"
                  style={{
                    color: appTheme.fontMainColor,
                  }}
                >
                  {t("Bank Name")}
                </Text>
                <TextInput
                  className={`min-w-[100%] rounded-md border ${isError.field === "bankName" ? "border-red-600 border-2" : "border-2 border-gray-300"} p-3 my-2 `}
                  value={formData.bankName}
                  placeholder={t("Swiss Bank")}
                  style={{
                    color: appTheme.fontSecondColor,
                  }}
                  placeholderTextColor={appTheme.fontSecondColor}
                  onChangeText={(val) => {
                    setIsError({ field: "", message: "" });
                    handleChange("bankName", val);
                  }}
                />
              </View>,
              <View className="flex flex-col w-full items-start justify-start gap-2">
                <Text
                  className="text-lg font-normal"
                  style={{ color: appTheme.fontMainColor }}
                >
                  {t("Account Name")}
                </Text>
                <TextInput
                  className={`min-w-[100%] rounded-md border ${isError.field === "accountName" ? "border-red-600 border-2" : "border-2 border-gray-300"} p-3 my-2`}
                  value={formData.accountName}
                  placeholder={t("Account_Name_Placeholder")}
                  style={{ color: appTheme.fontSecondColor }}
                  placeholderTextColor={appTheme.fontSecondColor}
                  onChangeText={(val) => {
                    setIsError({ field: "", message: "" });
                    handleChange("accountName", val);
                  }}
                />
              </View>,
              <View className="flex flex-col w-full items-start justify-start gap-2">
                <Text
                  className="text-lg font-normal"
                  style={{ color: appTheme.fontMainColor }}
                >
                  {t("IBAN_SWIFT_BSB")}
                </Text>
                <TextInput
                  className={`min-w-[100%] rounded-md border ${isError.field === "accountCode" ? "border-red-600 border-2" : "border-2 border-gray-300"} p-3 my-2`}
                  value={formData.accountCode}
                  placeholder={t("IBAN_Placeholder")}
                  style={{ color: appTheme.fontSecondColor }}
                  placeholderTextColor={appTheme.fontSecondColor}
                  onChangeText={(val) => {
                    setIsError({ field: "", message: "" });
                    handleChange("accountCode", val);
                  }}
                />
              </View>,
              <View className="flex flex-col w-full items-start justify-start gap-2">
                <Text
                  className="text-lg font-normal"
                  style={{ color: appTheme.fontMainColor }}
                >
                  {t("Account Number")}
                </Text>
                <TextInput
                  className={`min-w-[100%] rounded-md border ${isError.field === "accountNumber" ? "border-red-600 border-2" : "border-2 border-gray-300"} p-3 my-2`}
                  value={formData.accountNumber}
                  placeholder="7838246824682346"
                  keyboardType="number-pad"
                  textContentType="password"
                  style={{ color: appTheme.fontSecondColor }}
                  placeholderTextColor={appTheme.fontSecondColor}
                  onChangeText={(val) => {
                    setIsError({ field: "", message: "" });
                    handleChange("accountNumber", val);
                  }}
                />
              </View>,
              <View>
                <CustomContinueButton
                  title={
                    areBankDetailsLoading ? t("Please wait") : t("Confirm")
                  }
                  onPress={handleSubmit}
                />
              </View>,
            ]}
            renderItem={({ item }) => item}
          />
        </KeyboardAvoidingView>
        {/* </ScrollView> */}
      </TouchableWithoutFeedback>
    </View>
  );
}
