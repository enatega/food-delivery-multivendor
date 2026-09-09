import { IOrder } from "@/lib/utils/interfaces/order.interface";

type OrderItem = IOrder["items"][number];

const toAmount = (value: unknown) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

export const orderItemTotal = (item: OrderItem) => {
  const addonsTotal = (item.addons ?? []).reduce(
    (addonSum, addon) =>
      addonSum +
      (addon.options ?? []).reduce(
        (optionSum, option) => optionSum + toAmount(option.price),
        0,
      ),
    0,
  );

  return (
    (toAmount(item.variation?.price) + addonsTotal) * toAmount(item.quantity)
  );
};

export const orderItemsTotal = (items: IOrder["items"] = []) =>
  items.reduce((total, item) => total + orderItemTotal(item), 0);
