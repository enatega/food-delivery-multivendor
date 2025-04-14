// Contexts
import { useUserContext } from "@/lib/context/global/user.context";
import { useApptheme } from "@/lib/context/theme.context";

// Interfaces
import { IEarningBottomProps } from "@/lib/utils/interfaces/earning.interface";

// Icons
import { Ionicons } from "@expo/vector-icons";

// Expo
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

// Core
import { Text, TouchableOpacity, View } from "react-native";

// React Native Modal
import ReactNativeModal from "react-native-modal";

export default function EarningBottomBar({
  totalEarnings,
  totalDeliveries,
  modalVisible,
  setModalVisible,
}: IEarningBottomProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  // Contexts
  const { setStoreOrderEarnings } = useUserContext();
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
          earningsArray: [],
          totalEarningsSum: 0,
          totalDeliveries: 0,
          totalOrderAmount: 0,
        });
      }}
      style={{
        maxHeight: "25%",
        width: "100%",
        height: "25%",
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
        color={appTheme.fontMainColor}
        className="absolute right-5 top-5 block"
        onPress={() => {
          setModalVisible({
            bool: false,
            _id: "",
            date: "",
            earningsArray: [],
            totalEarningsSum: 0,
            totalDeliveries: 0,
            totalOrderAmount: 0,
          });
        }}
      />
      <View className="flex flex-col justify-between h-[65%] w-full">
        <View
          className="flex flex-row justify-between items-center flex-2 p-5"
          style={{ backgroundColor: appTheme.themeBackground }}
        >
          <Text className="font-bold" style={{ color: appTheme.fontMainColor }}>
            {t("Total Earning")}
          </Text>
          <Text style={{ color: appTheme.fontMainColor }}>
            ${totalEarnings}
          </Text>
        </View>

        <View className="flex flex-row justify-between p-5">
          <Text
            style={{ color: appTheme.linkColor }}
            className="text-md font-bold"
          >
            {t("Deliveries")}({totalDeliveries})
          </Text>
          <TouchableOpacity
            className="flex flex-row gap-2 items-center flex-2"
            onPress={() => {
              router.push({
                pathname:
                  "/(protected)/(tabs)/earnings/(routes)/earnings-order-details",
              });
              setStoreOrderEarnings(modalVisible.earningsArray);
              setModalVisible({
                bool: false,
                _id: "",
                date: "",
                earningsArray: [],
                totalEarningsSum: 0,
                totalDeliveries: 0,
                totalOrderAmount: 0,
              });
            }}
          >
            <Text
              style={{ color: appTheme.linkColor }}
              className="text-md font-bold"
            >
              ${totalEarnings}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={23}
              color={appTheme.linkColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ReactNativeModal>
  );
}
