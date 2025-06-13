/* eslint-disable @typescript-eslint/no-require-imports */
import { EDIT_RIDER } from "@/lib/apollo/mutations/rider.mutation";
import { RIDER_PROFILE } from "@/lib/apollo/queries";
import { useApptheme } from "@/lib/context/global/theme.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { FlashMessageComponent } from "@/lib/ui/useable-components";
import SpinnerComponent from "@/lib/ui/useable-components/spinner";
import {
  BikeRidingIcon,
  CarIcon,
  MotorBikeIcon,
  TruckIcon,
} from "@/lib/ui/useable-components/svg";
import { VEHICLE_TYPE } from "@/lib/utils/constants";
import { IVehicleTypeItem } from "@/lib/utils/interfaces";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function VehicleTypeMainScreen() {
  // Context
  const { dataProfile } = useUserContext();

  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  const vehicleMap: Record<string, JSX.Element> = {
    bicycle: <BikeRidingIcon color={appTheme.fontMainColor} />,
    motorbike: <MotorBikeIcon color={appTheme.fontMainColor} />,
    car: <CarIcon color={appTheme.fontMainColor} />,
    pickup_truck: <TruckIcon color={appTheme.fontMainColor} />,
  };

  // State
  const [selectedCode, setSelectedCode] = useState<string>(
    VEHICLE_TYPE.find((vt) => vt.code === dataProfile?.vehicleType)?.code || "",
  );

  // API Hook
  const [mutate, { loading: mutationLoading }] = useMutation(EDIT_RIDER, {
    refetchQueries: [
      { query: RIDER_PROFILE, variables: { id: dataProfile?._id } },
    ],
  });

  // Hook
  const { width } = useWindowDimensions();

  // Components
  const renderItem = ({ item }: { item: IVehicleTypeItem }) => {
    const isSelected = item.code === selectedCode;
    return (
      <TouchableOpacity
        className={`flex-row items-center p-4  border-b my-1`}
        style={{
          width: width * 0.95,
          borderColor: isSelected ? appTheme.primary : appTheme.gray,
        }}
        onPress={() => setSelectedCode(item.code)}
      >
        <View
          className="mr-2"
          style={{ backgroundColor: appTheme.themeBackground }}
        >
          {vehicleMap[item.code as string]}
        </View>
        <Text
          className="flex-1 font-inter font-semibold leading-5 tracking-normal"
          style={{ color: appTheme.mainTextColor }}
        >
          {t(item.label)}
        </Text>
        <View
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center `}
          style={{ borderColor: isSelected ? appTheme.primary : appTheme.gray }}
        >
          {isSelected && (
            <View
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: appTheme.primary }}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Form Submission
  const onHandlerSubmit = () => {
    mutate({
      variables: {
        riderInput: {
          _id: dataProfile?._id,
          name: dataProfile?.name, //
          username: dataProfile?.username,
          password: dataProfile?.password,
          phone: dataProfile?.phone?.toString(),
          zone: dataProfile?.zone._id,
          vehicleType: selectedCode,
          available: dataProfile?.available,
        },
      },
      onCompleted: () => {
        FlashMessageComponent({
          message: t("Vehicle Type has been updated successfully"),
        });
      },
      onError: (error) => {
        FlashMessageComponent({
          message:
            error.graphQLErrors[0]?.message ?? t("Please try again later"),
        });
      },
    });
  };

  return (
    <View className="flex-1 items-center mt-5">
      <View className="h-[80%]">
        <FlatList
          data={VEHICLE_TYPE}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          extraData={selectedCode}
        />
      </View>

      <View className="h-[20%]">
        <TouchableOpacity
          className="h-12 rounded-3xl py-3 mt-2"
          style={{ width: width * 0.9, backgroundColor: appTheme.primary }}
          onPress={() => onHandlerSubmit()}
        >
          {mutationLoading ? (
            <SpinnerComponent color={appTheme.white} />
          ) : (
            <Text className="text-center text-white text-lg font-medium">
              {t("Update")}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
