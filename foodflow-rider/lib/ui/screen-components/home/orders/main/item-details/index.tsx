import { ConfigurationContext } from "@/lib/context/global/configuration.context";
import { useApptheme } from "@/lib/context/global/theme.context";
import { IOrder } from "@/lib/utils/interfaces/order.interface";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";

const ItemDetails = ({
  orderData: order,
}: {
  orderData: IOrder;
  tab: string;
}) => {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const configuration = useContext(ConfigurationContext);

  if (!order) return null;

  const itemAmount = useMemo(() => {
    return order?.items?.reduce((sum, item) => {
      return sum + item.quantity * item.variation.price;
    }, 0);
  }, [order._id]);

  return (
    <View className="pb-4">
      <View className="flex-1 flex-row justify-between items-center">
        <Text
          className="font-[Inter] text-[11px] text-base font-[500]"
          style={{ color: appTheme.fontSecondColor }}
        >
          {t("ITEMS AND QUANTITY")}
        </Text>
        <Text
          className="font-[Inter] text-[11px] text-base font-[500]"
          style={{ color: appTheme.fontSecondColor }}
        >
          {t("PRICE")}
        </Text>
      </View>

      <View className="flex-1 mt-2">
        {order?.items?.map((item) => {
          return (
            <View
              key={item.title ?? ""}
              className="flex-1 flex-row  justify-between items-start gap-x-2"
            >
              <View
                className="h-[3.8rem] w-[3.8rem] overflow-hidden rounded-md  justify-center items-center"
                style={{
                  backgroundColor: appTheme.themeBackground,
                }}
              >
                <Image
                  // src={item?.image}
                  source={{ uri: item?.image }}
                  width={100}
                  height={100}
                />
              </View>
              <View className="flex-1">
                <View>
                  <Text
                    className="font-[Inter] text-[14px] font-semibold text-left "
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
                    className="font-[Inter] text-[12px] font-semibold text-left "
                    style={{ color: appTheme.fontMainColor }}
                  >
                    x{item?.quantity ?? "0"}
                  </Text>
                </View>

                {/* Variation */}
                <View>
                  {item?.variation && (
                    <View className="flex-row items-center">
                      <Text style={{ color: appTheme.fontMainColor }}>{item?.variation?.title}</Text>
                      <Text className="ml-2" style={{ color: appTheme.fontMainColor }}>
                        {configuration?.currencySymbol}
                        {item?.variation?.price}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Addons */}
                <View>
                  {
                    item?.addons?.map((addon) => {
                      return (
                        <View key={addon._id}>
                          {addon?.options?.map((option) => {
                            return (
                              <View key={option._id} className="flex-row items-center">
                                <Text style={{ color: appTheme.fontMainColor }}>{option.title}</Text>
                                <Text className="ml-2" style={{ color: appTheme.fontMainColor }}>({option?.price}{configuration?.currencySymbol})</Text>
                              </View>
                            );
                          })}
                        </View>
                      );
                    })
                  }
                </View>
              </View>

              <View>
                <Text
                  className="font-[Inter] text-[14px] font-semibold text-left "
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
        style={{ backgroundColor: appTheme.themeBackground }}
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
            className="font-[Inter] font-semibold text-left "
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
