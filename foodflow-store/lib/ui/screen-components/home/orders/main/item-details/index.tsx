// Hooks
import { useApptheme } from "@/lib/context/theme.context";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";

// Contexts
import { ConfigurationContext } from "@/lib/context/global/configuration.context";

// Core
import { Text, View } from "react-native";

import { IOrder, Item } from "@/lib/utils/interfaces/order.interface";

interface ItemDetailsProps {
  orderData: IOrder;
}

const ItemDetails = ({ orderData: order }: ItemDetailsProps) => {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const configuration = useContext(ConfigurationContext);

  if (!order) return null;

  const itemAmount = useMemo(() => {
    return order?.items?.reduce((sum: number, item: Item) => {
      return sum + (item.variation?.price ?? 0) * (item.quantity ?? 0);
    }, 0);
  }, [order?.items]);

  return (
    <View className="pb-4">
      <View className="flex-1 flex-row justify-between items-center">
        <Text className="font-[Inter] text-[11px] text-base font-[500] text-gray-600">
          {t("ITEMS AND QUANTITY")}
        </Text>
        <Text className="font-[Inter] text-[11px] text-base font-[500] text-gray-600">
          {t("PRICE")}
        </Text>
      </View>

      <View className="flex-1 mt-2">
        {order?.items?.map((item: Item) => {
          return (
            <View
              key={item._id}
              className="flex-1 flex-row justify-between items-start gap-x-2"
            >
              <View
                className="h-[3.8rem] w-12 justify-center items-center"
                style={{ backgroundColor: appTheme.lowOpacityPrimaryColor }}
              >
                <Text style={{ color: appTheme.fontMainColor }}>I</Text>
              </View>
              <View className="flex-1">
                <View>
                  <Text
                    className="font-[Inter] text-[14px] font-semibold text-left"
                    style={{ color: appTheme.fontMainColor }}
                  >
                    {item?.title ?? "-"}
                  </Text>
                </View>
                <View>
                  <Text
                    className="font-[Inter] text-[12px] font-semibold text-left"
                    style={{ color: appTheme.fontSecondColor }}
                  >
                    {item?.description ?? "-"}
                  </Text>
                </View>
                <View>
                  <Text
                    className="font-[Inter] text-[12px] font-semibold text-left"
                    style={{ color: appTheme.fontMainColor }}
                  >
                    x{item?.quantity ?? "0"}
                  </Text>
                </View>
              </View>

              <View>
                <Text
                  className="font-[Inter] text-[14px] font-semibold text-left"
                  style={{ color: appTheme.fontMainColor }}
                >
                  {configuration?.currencySymbol}
                  {item.variation?.price}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Divider */}
      <View
        className="flex-1 h-[1px] mb-4 mt-4"
        style={{ backgroundColor: appTheme.borderLineColor }}
      />

      {/* Order Amount */}
      <View className="flex-1 flex-row justify-between mb-4">
        <Text
          className="font-[Inter] text-[16px] text-base font-[500]"
          style={{ color: appTheme.fontSecondColor }}
        >
          {t("Total")}
        </Text>
        <View className="flex-row gap-x-1">
          <Text
            className="font-[Inter] font-semibold text-left"
            style={{ color: appTheme.fontMainColor }}
          >
            {configuration?.currencySymbol}
            {itemAmount}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ItemDetails;
