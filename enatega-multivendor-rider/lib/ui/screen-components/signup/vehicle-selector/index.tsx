import { useApptheme } from "@/lib/context/global/theme.context";
import { VEHICLE_TYPE } from "@/lib/utils/constants/vehicle-type";
import { FontAwesome } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

interface VehicleSelectorProps {
  selectedVehicle: string;
  onSelect: (vehicleCode: string) => void;
  error?: string;
}

const vehicleIcons: Record<string, keyof typeof FontAwesome.glyphMap> = {
  bicycle: "bicycle",
  motorbike: "motorcycle",
  car: "car",
  pickup_truck: "truck",
};

export default function VehicleSelector({
  selectedVehicle,
  onSelect,
  error,
}: VehicleSelectorProps) {
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  return (
    <View className="mb-4">
      <Text
        className="text-sm font-medium mb-2"
        style={{ color: appTheme.fontMainColor }}
      >
        {t("Vehicle Type")}
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {VEHICLE_TYPE.map((vehicle) => {
          const isSelected = selectedVehicle === vehicle.code;
          return (
            <TouchableOpacity
              key={vehicle.id}
              onPress={() => onSelect(vehicle.code)}
              className="flex-1 min-w-[45%] p-4 rounded-lg border-2 items-center"
              style={{
                borderColor: isSelected ? appTheme.primary : appTheme.borderLineColor,
                backgroundColor: isSelected
                  ? `${appTheme.primary}10`
                  : appTheme.themeBackground,
              }}
            >
              <FontAwesome
                name={vehicleIcons[vehicle.code]}
                size={24}
                color={isSelected ? appTheme.primary : appTheme.fontSecondColor}
              />
              <Text
                className="text-xs font-medium mt-2"
                style={{
                  color: isSelected ? appTheme.primary : appTheme.fontMainColor,
                }}
              >
                {t(vehicle.label)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}
    </View>
  );
}
