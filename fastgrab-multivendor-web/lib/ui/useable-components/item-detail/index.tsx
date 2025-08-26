import { useEffect, useState } from "react";
import useUser from "@/lib/hooks/useUser";

// Interface
import {
  IAddon,
  IFoodItemDetalComponentProps,
  Option,
} from "@/lib/utils/interfaces";

// Components
import Divider from "../custom-divider";
import { ItemDetailSection } from "./item-section";
import ClearCartModal from "../clear-cart-modal";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import { useTranslations } from "next-intl";

export default function FoodItemDetail(props: IFoodItemDetalComponentProps) {
  const { foodItem, addons, options, onClose, restaurant } = props;
  const { CURRENCY_SYMBOL } = useConfig();

  // Access user context for cart functionality
  const { addItem, restaurant: cartRestaurant, clearCart } = useUser();

  // State for selected variation
  const [selectedVariation, setSelectedVariation] = useState(
    foodItem?.variations && foodItem.variations.length > 0
      ? foodItem.variations[0]
      : null
  );

  // State for quantity
  const [quantity, setQuantity] = useState(1);

  // State for selected addon options - use an object with addon IDs as keys
  const [selectedAddonOptions, setSelectedAddonOptions] = useState<
    Record<string, Option | Option[]>
  >({});

  // State for clear cart modal
  const [showClearCartModal, setShowClearCartModal] = useState(false);

  // Get the addon objects for the selected variation
  const variationAddons =
    selectedVariation?.addons
      ?.map((addonId) => addons?.find((a) => a._id === addonId))
      .filter(Boolean) || [];

  // Function to get options for a specific addon
  const getAddonOptions = (addon: IAddon | undefined) => {
    return (
      addon?.options
        ?.map((optionId) => options?.find((o) => o._id === optionId))
        .filter(Boolean) || []
    );
  };

  // Handle selection for a specific addon
  const handleAddonSelection = (
    addonId: string,
    isMultiple: boolean,
    selection: Option | Option[]
  ) => {
    setSelectedAddonOptions((prev) => ({
      ...prev,
      [addonId]: selection,
    }));
  };

  const t = useTranslations()

  // Validate if all required addons are selected
  const isFormValid = () => {
    // If no variation is selected, form is invalid
    if (!selectedVariation) return false;

    // Check if all required addons are selected
    for (const addon of variationAddons) {
      if (!addon) continue; // Skip if addon is undefined

      const selected = selectedAddonOptions[addon._id ?? ""];

      // Required addon check
      if (addon.quantityMinimum && addon.quantityMinimum > 0) {
        // For single select addons
        if (addon.quantityMinimum === 1 && addon.quantityMaximum === 1) {
          if (!selected) return false;
        }
        // For multi-select addons
        else {
          const selectedCount = selected
            ? Array.isArray(selected)
              ? selected.length
              : 1
            : 0;
          if (
            selectedCount < (addon.quantityMinimum ?? 0) ||
            selectedCount > (addon.quantityMaximum ?? Infinity)
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

  // Function to add item to cart
  const handleAddToCart = () => {
    if (!isFormValid() || !foodItem || !selectedVariation) return;

    // Check if we need to clear the cart (different restaurant)
    const needsClear = cartRestaurant && foodItem.restaurant !== cartRestaurant;

    if (needsClear) {
      // Show clear cart confirmation dialog
      setShowClearCartModal(true);
      return;
    }

    // Add item directly if from same restaurant or no restaurant in cart
    addItemToCart();
  };

  // Function to add item to cart after confirmation if needed
  const addItemToCart = () => {
    if (!foodItem || !selectedVariation) return;

    // Format addons for cart
    const formattedAddons = Object.entries(selectedAddonOptions)
      .filter(([, value]) => value) // Filter out undefined/null values
      .map(([addonId, optionOrOptions]) => {
        // Handle both single and multi-select addons
        const options = Array.isArray(optionOrOptions)
          ? optionOrOptions.map((opt) => ({ _id: opt._id }))
          : [{ _id: optionOrOptions._id }];

        return {
          _id: addonId,
          options,
        };
      });
    // Call the addItem function from useUser hook
    addItem(
      foodItem?.image,
      foodItem._id,
      selectedVariation._id,
      foodItem.restaurant,
      quantity,
      formattedAddons
      // Special instructions - could add a field for this
    );

    // UPDAT4 STORAGE
    onUseLocalStorage("save", "restaurant", restaurant?._id);
    onUseLocalStorage("save", "restaurant-slug", restaurant?.slug);
    onUseLocalStorage(
      "save",
      "currentShopType",
      restaurant?.shopType === "restaurant" ? "restaurant" : "store"
    );

    // Close the modal
    if (onClose) {
      onClose();
    }
  };

  // Handle clear cart confirmation
  const handleClearCartConfirm = async () => {
    await clearCart();
    addItemToCart();
    setShowClearCartModal(false);

    onUseLocalStorage("save", "restaurant", restaurant?._id);
    onUseLocalStorage("save", "restaurant-slug", restaurant?.slug);
    onUseLocalStorage(
      "save",
      "currentShopType",
      restaurant?.shopType === "restaurant" ? "restaurant" : "store"
    );
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!selectedVariation) return 0;

    let totalPrice = selectedVariation.price;

    // Add prices for selected addons
    Object.entries(selectedAddonOptions).forEach(([, selected]) => {
      if (!selected) return;

      if (Array.isArray(selected)) {
        // Multiple selected options
        selected.forEach((option) => {
          totalPrice += option.price;
        });
      } else {
        // Single selected option
        totalPrice += selected.price;
      }
    });

    totalPrice = totalPrice * quantity;

    return totalPrice.toFixed(2);
  };

  const [isLoading, setIsLoading] = useState(true);

  // useeffects
  useEffect(() => {
    if (foodItem?.variations && foodItem.variations.length > 0) {
      // Find the first in-stock variation
      const inStockVariation = foodItem.variations.find(
        (variation) => !variation.isOutOfStock
      );
      // If there's an in-stock variation, select it; otherwise, explicitly set to null
      if (inStockVariation) {
        setSelectedVariation(inStockVariation);
      } else {
        // If no in-stock variations, set to null to avoid selecting out-of-stock items
        setSelectedVariation(null);
      }
    }
  }, [foodItem]);

  return (
    <div className="bg-white md:max-w-md w-100 w-full relative">
      {/* close icon to close the modal */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 bg-slate-400 hover:bg-slate-500 transition-all duration-300 rounded-full p-2"
      >
        <FontAwesomeIcon
          icon={faXmark}
          className="text-white"
          width={23}
          height={18}
        />
      </button>

      <div className="text-center mb-4">
        {isLoading && (
          <div className="md:max-w-md w-100 h-[200px] bg-gray-300 animate-pulse rounded-t-md mx-auto" />
        )}
        <Image
          alt={foodItem?.title ?? ""}
          className={`md:max-w-md w-100 h-[200px] object-cover object-center rounded-t-md transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          src={foodItem?.image ?? ""}
          width={500}
          height={200}
          onLoad={() => setIsLoading(false)}
        />
      </div>

      <div className="py-3 px-6 mb-4">
        <h2 className="font-inter font-bold text-[#111827] text-[16px] md:text-[18px] lg:text-[19px] leading-[22px] md:leading-[24px]">
          {foodItem?.title}
        </h2>
        <p className="text-[#0EA5E9] font-[600] text-[14px] md:text-[15px] lg:text-[16px] mb-2">
          {CURRENCY_SYMBOL}
          {selectedVariation?.price.toFixed(2)}
        </p>
        <p className="font-inter font-normal text-gray-500 text-[12px] md:text-[13px] lg:text-[14px] leading-[18px] md:leading-[20px]">
          {foodItem?.description}
        </p>

        <Divider />

        <div id="addon-sections">
          {/* Variation Selection - With required tag */}
          {foodItem?.variations && foodItem.variations.length > 1 && (
            <ItemDetailSection
              key="variations"
              title={`${t("select_label")} ${t("select_variation")}`}
              name="variation" // This is a string literal, no undefined issue
              singleSelected={selectedVariation}
              onSingleSelect={setSelectedVariation}
              options={foodItem?.variations || []}
              requiredTag={`1  ${t("required")}`}
              showTag={true}
            />
          )}

          {/* Addon Sections - With required/optional tags */}
          {variationAddons.map((addon) => {
            if (!addon) return null; // Skip rendering if addon is undefined

            const isSingleSelect =
              addon.quantityMinimum === 1 && addon.quantityMaximum === 1;
            const addonOptions = getAddonOptions(addon);

            // Determine required/optional tag text
            const requiredTagText =
              (addon.quantityMinimum ?? 0) > 0
                ? `${addon.quantityMinimum} ${t("required")}`
                : "Optional";

            return (
              <ItemDetailSection
                key={addon._id ?? "addon-" + Math.random()}
                title={addon.title ?? "Unknown"}
                name={addon._id ?? "addon"}
                multiple={!isSingleSelect}
                singleSelected={
                  isSingleSelect
                    ? (selectedAddonOptions[addon._id ?? ""] as Option)
                    : null
                }
                onSingleSelect={
                  isSingleSelect
                    ? (option) =>
                        handleAddonSelection(
                          addon._id ?? "",
                          false,
                          option as Option
                        )
                    : undefined
                }
                multiSelected={
                  !isSingleSelect
                    ? (selectedAddonOptions[addon._id ?? ""] as Option[]) || []
                    : []
                }
                onMultiSelect={
                  !isSingleSelect
                    ? (updateFn) => {
                        const current =
                          (selectedAddonOptions[addon._id ?? ""] as Option[]) ||
                          [];
                        if (typeof updateFn === "function") {
                          const updated = updateFn(current);
                          handleAddonSelection(
                            addon._id ?? "",
                            true,
                            updated as Option[]
                          );
                        }
                      }
                    : undefined
                }
                options={addonOptions as Option[]}
                requiredTag={requiredTagText}
                showTag={true}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-x-2 mt-4">
          {/* Quantity Controls - Rounded Rectangle Container */}
          <div className="flex items-center space-x-2 bg-gray-200 rounded-[42px] px-3 py-1 flex-[0.2]">
            <button
              className="bg-white text-gray-900 rounded-full w-6 h-6 flex items-center justify-center shadow"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              type="button"
            >
              -
            </button>
            <span className="text-lg font-medium text-gray-900">
              {quantity}
            </span>
            <button
              className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center shadow"
              onClick={() => setQuantity((prev) => prev + 1)}
              type="button"
            >
              +
            </button>
          </div>

          {/* Add to Order Button - Takes Remaining 80% */}
          <button
            className={`${isFormValid() ? "bg-[#5AC12F]" : "bg-gray-300"} text-black px-4 py-2 text-[500] font-[14px] rounded-full flex flex-col md:flex-row items-center justify-between flex-[0.8]`}
            onClick={handleAddToCart}
            disabled={!isFormValid()}
            type="button"
          >
            {t("add_to_order")}
            <span className="ml-2 text-gray-900 text-[500] font-[14px]">
              {CURRENCY_SYMBOL}
              {calculateTotalPrice()}
            </span>
          </button>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      <ClearCartModal
        isVisible={showClearCartModal}
        onHide={() => setShowClearCartModal(false)}
        onConfirm={handleClearCartConfirm}
      />
    </div>
  );
}
