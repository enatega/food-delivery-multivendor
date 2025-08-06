import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { UPDATE_AVAILABILITY } from "@/lib/apollo/mutations/rider.mutation";
import { RIDER_PROFILE } from "@/lib/apollo/queries";
import { useApptheme } from "@/lib/context/global/theme.context";
import { useUserContext } from "@/lib/context/global/user.context";
import SpinnerComponent from "@/lib/ui/useable-components/spinner";
import CustomSwitch from "@/lib/ui/useable-components/switch-button";
import { IRiderProfile } from "@/lib/utils/interfaces";
import { MutationTuple, useMutation, useQuery } from "@apollo/client";
import { showMessage } from "react-native-flash-message";
import { useEffect, useState } from "react";

const CustomDrawerHeader = () => {
  // Hook
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const { dataProfile, userId, loadingProfile } = useUserContext();
  const [isRiderAvailable, setIsRiderAvailable] = useState(false)

  console.log({isRiderAvailable:dataProfile?.available});

  useEffect(()=>{
    setIsRiderAvailable(dataProfile?.available || false)
  },[dataProfile?.available])


  // Queries
  const [toggleAvailablity, { loading }] = useMutation(UPDATE_AVAILABILITY, {
    refetchQueries: [{ query: RIDER_PROFILE, variables: { id: userId } }],
    awaitRefetchQueries: true,
    onError: (error) => {
      showMessage({
        message:
          error.graphQLErrors[0].message ||
          error?.networkError?.message ||
          t("Unable to update availability"),
      });
    },
  }) as MutationTuple<IRiderProfile | undefined, { id: string }>;

  return (
    <View
      className={` w-full h-[15%] flex-row justify-between p-3 pt-6 top-0 bottom-4`}
      style={{ backgroundColor: appTheme.primary }}
    >
      <View className="justify-between">
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
                  : "",
              ) ?? "JS"}
          </Text>
        </View>
        <View>
          <Text
            className="font-semibold text-[16px]"
            style={{
              color: appTheme.black,
            }}
          >
            {dataProfile?.name ?? t("rider name")}
          </Text>
          <Text
            className="font-medium"
            style={{
              color: appTheme.secondaryTextColor,
            }}
          >
            {dataProfile?._id.substring(0, 9).toUpperCase() ?? "rider id"}
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
            onToggle={async () =>
              await toggleAvailablity({ variables: { id: userId ?? "" } })
            }
          />
        )}
        <Text
          className="text-xs font-medium"
          style={{ color: appTheme.secondaryTextColor }}
        >
          {dataProfile?.available ? t("Available") : t("Not Available")}
        </Text>
      </View>
    </View>
  );
};

export default CustomDrawerHeader;
