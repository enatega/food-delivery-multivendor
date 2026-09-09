import { IOrder } from "@/lib/utils/interfaces/order.interface";
import { orderItemsTotal, orderItemTotal } from "./order-items-total";

const makeItem = (
  overrides: Partial<IOrder["items"][number]> = {},
): IOrder["items"][number] => ({
  variation: { price: 40, title: "Regular" },
  addons: [],
  description: "",
  image: "",
  title: "Meal",
  quantity: 1,
  ...overrides,
});

describe("order item totals", () => {
  it("includes selected add-ons in the item total", () => {
    const item = makeItem({
      addons: [
        {
          _id: "extras",
          options: [{ _id: "hot", title: "Spicy", price: 2 }],
        },
      ],
    });

    expect(orderItemTotal(item)).toBe(42);
  });

  it("applies quantity to the variation and add-ons", () => {
    const item = makeItem({
      quantity: 2,
      addons: [
        {
          _id: "extras",
          options: [{ _id: "cheese", title: "Cheese", price: 1.5 }],
        },
      ],
    });

    expect(orderItemTotal(item)).toBe(83);
  });

  it("sums all item totals", () => {
    expect(
      orderItemsTotal([
        makeItem(),
        makeItem({ variation: { price: 10, title: "Small" }, quantity: 2 }),
      ]),
    ).toBe(60);
  });
});
