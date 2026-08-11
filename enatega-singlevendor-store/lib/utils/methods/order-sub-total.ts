import { IOrder } from "../interfaces/order.interface";

export const orderSubTotal = (order: IOrder) => {
  let total = 0;
  let variation_price = 0;
  order.items.forEach((item) => {
    variation_price = item.variation.price;
    item.addons.forEach((addon) => {
      addon.options.forEach((option) => {
        variation_price += option.price;
      });
    });

    total += variation_price * item.quantity;
  });

  return total;
};
