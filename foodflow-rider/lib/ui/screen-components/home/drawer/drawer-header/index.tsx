import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { UPDATE_AVAILABILITY } from "@/lib/apollo/mutations/rider.mutation";
import { RIDER_PROFILE } from "@/lib/apollo/queries";
import { useApptheme } from "@/lib/context/global/theme.context";
import { useUserContext } from "@/lib/context/global/user.context";
import SpinnerComponent from "@/lib/ui/useable-components/spinner";
import CustomSwitch from "@/lib/ui/useable-components/switch-button";
import { IRiderProfile } from "@/lib/utils/interfaces";
import { MutationTuple, useMutation } from "@apollo/client";
// import { showMessage } from "react-native-flash-message";
import { useEffect, useState } from "react";
import { showMessage } from "react-native-flash-message";
import { isBoolean } from "lodash";

const CustomDrawerHeader = () => {
  // Hook
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const { dataProfile, loadingProfile } = useUserContext();
  const [isRiderAvailable, setIsRiderAvailable] = useState(false);

  useEffect(() => {
    setIsRiderAvailable(dataProfile?.available || false);
  }, [dataProfile?.available]);

  // Queries
  const [toggleAvailablity, { loading }] = useMutation(UPDATE_AVAILABILITY, {
    refetchQueries: [
      { query: RIDER_PROFILE, variables: { id: dataProfile?._id?.toString() } },
    ],
    awaitRefetchQueries: true,
    // onCompleted: () => {
    // Don't manually update state - let the refetch handle it through useEffect
    // The refetch will update dataProfile and trigger the useEffect to update isRiderAvailable
    // showMessage({
    //   message: t(!isRiderAvailable ? "You are now online" : "You are now offline"),
    //   type: "success",
    // });
    // },
    // onError: (error) => {
    //   showMessage({
    //     message:
    //       error.graphQLErrors[0]?.message ||
    //       error?.networkError?.message ||
    //       t("Unable to update availability"),
    //     type: "danger",
    //   });
    // },
  }) as MutationTuple<IRiderProfile | undefined, { id: string }>;

  return (
    <View
      className={` w-full h-[15%] flex-row justify-between p-3 pt-6 top-0 bottom-4`}
      style={{ backgroundColor: appTheme.primary }}
    >
      <View className="justify-between flex-1">
        <View
          className="w-[32px] h-[32px] rounded-full items-center justify-center overflow-hidden"
          style={{ backgroundColor: appTheme.white }}
        >
          <Text
            className="text-[16px] font-semibold"
            style={{
              color: appTheme.primary,
            }}
          >
            {dataProfile?.name
              ?.split(" ")[0]
              ?.substring(0, 1)
              ?.toUpperCase()
              ?.concat(
                "",
                dataProfile?.name?.split(" ")[1]?.length
                  ? (dataProfile?.name
                      ?.split(" ")[1]
                      ?.substring(0, 1)
                      ?.toUpperCase() ?? "")
                  : ""
              ) ?? "JS"}
          </Text>
        </View>
        <View className="flex-1 pr-2">
          <Text
            className="font-semibold text-[16px]"
            style={{
              color: appTheme.black,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {dataProfile?.name ?? t("rider name")}
          </Text>
          <Text
            className="font-medium"
            style={{
              color: appTheme.secondaryTextColor,
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {dataProfile?._id.substring(0, 9).toUpperCase() ?? "rider id"}{" "}
            aklsdjaskldjaskldsjdaklsdjaskldjas
          </Text>
        </View>
      </View>

      <View className="items-end justify-end gap-2">
        <Text
          className="text-md"
          style={{ color: appTheme.secondaryTextColor }}
        >
          {t("Availability")}
        </Text>
        {loading || loadingProfile ? (
          <SpinnerComponent color={appTheme.secondaryTextColor} />
        ) : (
          <CustomSwitch
            value={isRiderAvailable}
            isDisabled={loading}
            onToggle={async () => {
              try {
                if (!dataProfile?._id?.toString()) {
                  showMessage({
                    message: t("User ID is missing"),
                    type: "danger",
                  });
                  return;
                }

                await toggleAvailablity({
                  variables: { id: dataProfile?._id?.toString() ?? "" },
                });
              } catch (error) {
                // Error is already handled in the mutation's onError callback
                console.error("Toggle availability error:", error);
              }
            }}
          />
        )}

        <Text
          className="text-xs font-medium"
          style={{ color: appTheme.secondaryTextColor }}
        >
          {isBoolean(dataProfile?.available)
            ? dataProfile?.available
              ? t("Available")
              : t("Not Available")
            : ""}
        </Text>
      </View>
    </View>
  );
};

export default CustomDrawerHeader;
