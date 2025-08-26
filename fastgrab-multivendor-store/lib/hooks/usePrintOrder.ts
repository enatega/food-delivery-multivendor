import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { Platform } from "react-native";

// Hooks
import useOrders from "./useOrders";

// Interface
import { IOrder } from "../utils/interfaces/order.interface";

// Methods
import { printAsync, selectPrinterAsync } from "../utils/methods/print";

// Context
import { ConfigurationContext } from "../context/global/configuration.context";
import Restaurant from "../context/global/restaurant";

export default function usePrintOrder() {
  const configuration = useContext(ConfigurationContext);
  const { printer, setPrinter } = useContext(Restaurant.Context);
  const { loading, error, data } = useOrders();

  const printOrder = async (id: string) => {
    if (!loading && !error) {
      const order = data.restaurantOrders.find(
        (order: IOrder) => order._id === id,
      );
      await printAsync(
        { ...order, currencySymbol: configuration?.currencySymbol },
        Platform.OS === "ios" ? (printer ? printer.url : null) : null,
      );
    }
  };
  const selectPrinter = async () => {
    const result = await selectPrinterAsync();
    if (result) {
      setPrinter(result);
      await AsyncStorage.setItem("printer", JSON.stringify(result));
    }
  };
  return { printOrder, printer, selectPrinter };
}
