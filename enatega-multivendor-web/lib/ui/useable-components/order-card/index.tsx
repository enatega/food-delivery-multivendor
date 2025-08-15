"use client";

import { useCallback, useState, type FC } from "react";
import { Rating } from "primereact/rating";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import {
  IOrder,
  IOrderCardProps,
} from "@/lib/utils/interfaces/orders.interface";
import { formatDate, formatDateAndTime } from "@/lib/utils/methods/helpers";
import CustomIconButton from "../custom-icon-button";
import OrderItems from "../order-items";
import { useTranslations } from "next-intl";
import CustomDialog from "../custom-dialog";
import useUser from "@/lib/hooks/useUser";
import { CartItem } from "@/lib/context/User/User.context";

const OrderCard: FC<IOrderCardProps> = ({
  order,
  type,
  className,
  handleTrackOrderClicked,
  handleReOrderClicked,
  handleRateOrderClicked,
}) => {
  const t = useTranslations();

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const handleTrackOrder = (order: IOrder) => {
    handleTrackOrderClicked?.(order?._id);
  };

   const { cart,setCart, transformCartWithFoodInfo } = useUser();

  const handleReorder = useCallback((order: IOrder) => {
    setSelectedOrder(order);
    // ✅ Prefill all item IDs so all checkboxes are checked initially
    setSelectedItems(
  order.items?.map((item) => item._id).filter((id): id is string => Boolean(id)) || []
);

    setIsDialogVisible(true);
  }, []);

  function cleanReorderItems(items: any[]): CartItem[] {
  return items.map(item => ({
    _id: item._id ?? item.id ?? "",
    key: crypto.randomUUID(), // or any unique string generator
    quantity: item.quantity ?? 1,
    variation: {
      _id: item.variation?._id ?? item.variation?.id ?? "defaultVariationId",
    },
    addons: (item.addons ?? []).map((addon: any) => ({
      _id: addon._id,
      options: (addon.options ?? []).map((opt: any) => ({
        _id: opt._id,
      })),
    })),
    image: item.image ?? "/default-image.jpg",
    foodTitle: item.title ?? "",
    variationTitle: item.variation?.title ?? "",
    optionTitles: [], // You can fill this if you want by extracting option titles
    price: item.variation?.price.toString() ?? "0.00",
    specialInstructions: item.specialInstructions ?? "",
    title: `${item.title ?? ""}(${item.variation?.title ?? ""})`,
  }));
}

const handleConfirmReorder = () => {
  if (!selectedOrder) return;

  const itemsToReorder = (selectedOrder.items ?? []).filter((item) =>
    selectedItems.includes(item._id ?? "")
  );

  console.log("Selected items raw:", itemsToReorder);

  // Clean items first to match CartItem structure exactly
  const cleanedItems = cleanReorderItems(itemsToReorder);

  // Then transform with food info if needed
  const transformed = transformCartWithFoodInfo(cleanedItems, selectedOrder as any);

  setCart((prevCart) => {
    const updatedCart = [...(prevCart || []), ...transformed];
    if (typeof window !== "undefined") {
      if (updatedCart.length === 0) {
        localStorage.removeItem("cartItems");
        localStorage.removeItem("restaurant");
      } else {
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        localStorage.setItem("restaurant", selectedOrder.restaurant?._id ?? "");
        localStorage.setItem("restaurant-slug", JSON.stringify(selectedOrder.restaurant?.slug))
        localStorage.setItem("currentShopType", JSON.stringify(selectedOrder.restaurant?.shopType))

      }
    }
    return updatedCart;
  });

  handleReOrderClicked?.(
    selectedOrder.restaurant?._id ?? "",
    selectedOrder.restaurant?.slug ?? "",
    selectedOrder.restaurant?.shopType ?? "",
  );

  handleCloseDialog();
};


  const handleCloseDialog = () => {
    setIsDialogVisible(false);
    setSelectedOrder(null);
    setSelectedItems([]);
  };

  const handleRateOrder = () => {
    handleRateOrderClicked?.(order?._id);
  };

  // ✅ Calculate total based only on selected items
  const calculateSelectedTotal = (
    order: IOrder,
    selected: string[]
  ): string => {
    return (
      order.items
        ?.filter((item) => selected.includes(item._id ?? ""))
        .reduce(
          (sum, item) => sum + (item.variation?.price ?? 0) * (item.quantity ?? 0),
          0
        )
        .toFixed(2) ?? "0.00"
    );
  };

  return (
    <div className={twMerge("p-6", className)}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Restaurant Info */}
        <div className="flex items-start gap-4 flex-1">
          <div className="w-16 h-16 relative flex-shrink-0">
            <Image
              src={order?.restaurant?.image || "https://placehold.co/400"}
              alt={order?.restaurant?.name || "Restaurant"}
              width={64}
              height={64}
              className="rounded-md object-cover w-full h-full"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{order?.restaurant?.name}</h3>
            {type === "active" && (
              <h1 className="text-gray-600 text-sm">
                {(order?.items && order?.items[0]?.title) || ""}
              </h1>
            )}
            {type === "active" ? (
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <i className="fa-solid fa-clock text-gray-400"></i>
              </div>
            ) : (
              <>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <i className="fa-solid fa-calendar-alt text-gray-400"></i>
                  <span>
                    {order?.deliveredAt
                      ? `${t("delivered_on")} ${formatDateAndTime(order.deliveredAt)}`
                      : order?.cancelledAt
                        ? `${t("cancelled_on")} ${formatDate(order.cancelledAt)}`
                        : t("cancelled")}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {t("order_number")} #{order.orderId?.substring(0, 8)}
                </div>
                <OrderItems order={order} />
              </>
            )}
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex md:flex-col md:items-end justify-between gap-2">
          <div className="font-semibold text-lg">
            ${order.orderAmount?.toFixed(2)}
          </div>

          {(type === "active" || type === "past") && (
            <CustomIconButton
              title={
                type === "active"
                  ? t("track_order_button_label")
                  : t("select_item_to_reorder")
              }
              iconColor="black"
              classNames="bg-[#5AC12F] w-[content] px-4 gap-x-0 text-[12px] font-medium m-0"
              handleClick={
                type === "active"
                  ? () => handleTrackOrder(order)
                  : () => handleReorder(order)
              }
              loading={false}
            />
          )}
        </div>
      </div>

      {/* Rating for past orders */}
      {type === "past" && order.orderStatus === "DELIVERED" && (
        <div className="mt-4 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t("rate_the_order")}</span>
            <Rating
              value={order.review?.rating || 0}
              cancel={false}
              onChange={handleRateOrder}
              pt={{
                onIcon: { className: "text-yellow-400" },
              }}
            />
          </div>
        </div>
      )}

      {/* Reorder Dialog */}
<CustomDialog
  visible={isDialogVisible}
  onHide={handleCloseDialog}
  className="p-4 sm:p-6 max-w-sm sm:max-w-md w-full rounded-xl"
>
  {selectedOrder && (
    <div className="space-y-5">
      {/* Restaurant Info */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Image
          src={selectedOrder.restaurant?.image || "https://placehold.co/100"}
          alt={selectedOrder.restaurant?.name || "Restaurant"}
          width={70}
          height={90}
          className="rounded-lg object-cover flex-shrink-0 border border-gray-200"
        />
        <div className="flex flex-col">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            {selectedOrder.restaurant?.name}
          </h2>
          <p className="text-sm text-gray-500">
            {selectedOrder.restaurant?.address}
          </p>
        </div>
      </div>

      {/* Order Info with Checkboxes */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-800 mb-2">
          Order #{selectedOrder.orderId}
        </h3>
        <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {selectedOrder.items?.map((item) => {
            const id = item._id ?? "";
            return (
              <li
                key={id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-[#5AC12F] focus:ring-[#5AC12F] bg-white"
                  checked={selectedItems.includes(id)}
                  onChange={() => {
                    if (selectedItems.includes(id)) {
                      setSelectedItems(selectedItems.filter((existingId) => existingId !== id));
                    } else {
                      setSelectedItems([...selectedItems, id]);
                    }
                  }}
                />
                <div className="flex flex-col flex-1">
                  <span className="text-gray-800 font-medium text-sm">
                    {item.title}
                  </span>
                  <span className="text-gray-500 text-xs">
                    Qty: {item.quantity}
                  </span>
                </div>
                <span className="text-gray-700 font-medium text-sm">
                  ${(item.variation?.price || 0).toFixed(2)}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 font-semibold text-gray-900">
          Total: ${calculateSelectedTotal(selectedOrder, selectedItems)}
        </p>
      </div>

      {/* Confirmation */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
        <button
          className="px-5 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 w-full sm:w-auto transition"
          onClick={handleCloseDialog}
        >
          Cancel
        </button>
        <button
          className="px-5 py-2 text-sm rounded-lg bg-[#5AC12F] hover:bg-[#4bb126] text-white w-full sm:w-auto disabled:opacity-50 transition"
          disabled={selectedItems.length === 0}
          onClick={
            handleConfirmReorder
            // const itemsToReorder = (selectedOrder?.items ?? []).filter((item) =>
            //   selectedItems.includes(item._id ?? "")
            // );
            // handleReOrderClicked?.(
            //   selectedOrder.restaurant?._id ?? "",
            //   selectedOrder.restaurant?.slug ?? "",
            //   selectedOrder.restaurant?.shopType ?? "",
            // );
            // handleCloseDialog();
          }
        >
          Confirm Reorder
        </button>
      </div>
    </div>
  )}
</CustomDialog>

    </div>
  );
};

export default OrderCard;
