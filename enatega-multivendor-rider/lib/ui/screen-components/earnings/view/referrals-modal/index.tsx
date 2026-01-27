// Contexts
import { useApptheme } from "@/lib/context/global/theme.context";

// Interfaces
import { IReferralEarnings } from "@/lib/utils/interfaces/referral.interface";

// Icons
import { Ionicons } from "@expo/vector-icons";

// Expo
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

// Core
import { Dispatch, SetStateAction } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// React Native Modal
import ReactNativeModal from "react-native-modal";

interface IReferralModalProps {
  totalEarnings: number;
  totalReferrals: number;
  modalVisible: IReferralEarnings & { bool: boolean };
  setModalVisible: Dispatch<
    SetStateAction<IReferralEarnings & { bool: boolean }>
  >;
  activityId?: string;
}

export default function ReferralModal({
  totalEarnings,
  totalReferrals,
  modalVisible,
  setModalVisible,
  activityId,
}: IReferralModalProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  return (
    <ReactNativeModal
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      isVisible={modalVisible.bool}
      onBackdropPress={() => {
        setModalVisible({
          bool: false,
          _id: "",
          date: "",
          referralsArray: [],
          totalEarningsSum: 0,
          totalReferrals: 0,
        });
      }}
      style={{
        maxHeight: 250,
        width: "100%",
        height: "100%",
        backgroundColor: appTheme.themeBackground,
        borderRadius: 20,
        padding: 5,
        alignItems: "center",
        justifyContent: "flex-start",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        marginLeft: 0,
        marginTop: "145%",
        shadowOpacity: 0.25,
        shadowRadius: 4,
      }}
    >
      <Text
        className="font-bold text-xl w-full py-5 text-center"
        style={{ color: appTheme.fontMainColor }}
      >
        {t("Earnings")}
      </Text>
      <Ionicons
        name="close-circle-outline"
        size={25}
        className="absolute right-5 top-5 block"
        color={appTheme.iconColor}
        onPress={() => {
          setModalVisible({
            bool: false,
            _id: "",
            date: "",
            referralsArray: [],
            totalEarningsSum: 0,
            totalReferrals: 0,
          });
        }}
      />
      <View className="flex flex-col w-full">
        <View
          className="flex flex-row justify-between items-center p-5"
          style={{ backgroundColor: appTheme.themeBackground }}
        >
          <Text className="font-bold" style={{ color: appTheme.fontMainColor }}>
            {t("Total Earnings")}
          </Text>
          <Text style={{ color: appTheme.fontSecondColor }}>
            ${totalEarnings}
          </Text>
        </View>
        <View className="flex flex-row justify-between p-5">
          <Text
            className="text-md text-[#3B82F6] font-bold"
            style={{ color: appTheme.fontMainColor }}
          >
            {t("Referrals")}({totalReferrals})
          </Text>
          <TouchableOpacity
            className="flex flex-row gap-2 items-center"
            onPress={() => {
              router.push({
                pathname: "/(tabs)/earnings/(routes)/referrals-list",
                params: {
                  dateKey: activityId || modalVisible._id,
                  totalEarnings: modalVisible.totalEarningsSum,
                  totalReferrals: modalVisible.totalReferrals,
                },
              });
              setModalVisible({
                bool: false,
                _id: "",
                date: "",
                referralsArray: [],
                totalEarningsSum: 0,
                totalReferrals: 0,
              });
            }}
          >
            <Text className="text-md text-[#3B82F6] font-bold">
              ${totalEarnings}
            </Text>
            <Ionicons name="arrow-forward" size={23} color={"#3B82F6"} />
          </TouchableOpacity>
        </View>
      </View>
    </ReactNativeModal>
  );
}
