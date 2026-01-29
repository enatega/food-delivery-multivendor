import { useApptheme } from "@/lib/context/global/theme.context";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View, Modal, ScrollView } from "react-native";

interface Zone {
  _id: string;
  title: string;
  description: string;
}

interface ZoneSelectorProps {
  zones: Zone[];
  selectedZone: string;
  onSelect: (zoneId: string) => void;
  error?: string;
  loading?: boolean;
}

export default function ZoneSelector({
  zones,
  selectedZone,
  onSelect,
  error,
  loading,
}: ZoneSelectorProps) {
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = React.useState(false);

  const selectedZoneData = zones.find((z) => z._id === selectedZone);

  return (
    <View className="mb-4">
      <Text
        className="text-sm font-medium mb-2"
        style={{ color: appTheme.fontMainColor }}
      >
        {t("Delivery Zone")}
      </Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="flex-row items-center border rounded-lg px-3 h-12"
        style={{
          borderColor: error ? "#ef4444" : appTheme.borderLineColor,
          backgroundColor: appTheme.themeBackground,
        }}
      >
        <FontAwesome
          name="map-marker"
          size={16}
          color={appTheme.fontSecondColor}
          style={{ marginRight: 10 }}
        />
        <Text
          className="flex-1 text-base"
          style={{
            color: selectedZoneData
              ? appTheme.fontMainColor
              : appTheme.fontSecondColor,
          }}
        >
          {loading
            ? t("Loading zones...")
            : selectedZoneData
            ? selectedZoneData.title
            : t("Select your delivery zone")}
        </Text>
        <FontAwesome
          name="chevron-down"
          size={12}
          color={appTheme.fontSecondColor}
        />
      </TouchableOpacity>
      {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View
            className="rounded-t-3xl p-6 max-h-[70%]"
            style={{ backgroundColor: appTheme.themeBackground }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="text-lg font-bold"
                style={{ color: appTheme.fontMainColor }}
              >
                {t("Select Zone")}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome name="times" size={20} color={appTheme.fontMainColor} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {zones.map((zone) => (
                <TouchableOpacity
                  key={zone._id}
                  onPress={() => {
                    onSelect(zone._id);
                    setModalVisible(false);
                  }}
                  className="p-4 rounded-lg mb-2 border"
                  style={{
                    borderColor:
                      selectedZone === zone._id
                        ? appTheme.primary
                        : appTheme.borderLineColor,
                    backgroundColor:
                      selectedZone === zone._id
                        ? `${appTheme.primary}10`
                        : appTheme.themeBackground,
                  }}
                >
                  <Text
                    className="text-base font-semibold"
                    style={{
                      color:
                        selectedZone === zone._id
                          ? appTheme.primary
                          : appTheme.fontMainColor,
                    }}
                  >
                    {zone.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
