"use client";
import type { FC } from "react";
import { HomeSvg, MenuSvg } from "@/lib/utils/assets/svg";
import TextComponent from "@/lib/ui/useable-components/text-field";
import { IAddressItemProps } from "@/lib/utils/interfaces/profile.interface";
import { useTranslations } from "next-intl";

const AddressItem: FC<IAddressItemProps> = ({
  address,
  activeDropdown,
  toggleDropdown,
  handleDelete,
  setDropdownRef,
  onEditAddress,
}) => {
  const t = useTranslations();
  return (
    <div
      key={address?._id}
      className="flex items-center justify-between p-4 border-b relative"
    >
      <div className="flex items-center">
        <div className="mr-4">
          <HomeSvg color="black" width={28} height={28} />
        </div>
        <div>
          <TextComponent
            text={address?.label || "N/A"}
            className="font-medium md:text-lg text-base"
          />
          <TextComponent
            text={address?.deliveryAddress || "N/A"}
            className="md:text-base text-sm"
          />
          <TextComponent
            text={address?.details || ""}
            className="md:text-sm text-xs"
          />
        </div>
      </div>
      <div className="relative" ref={setDropdownRef(address?._id)}>
        <span
          className="cursor-pointer"
          onClick={() => toggleDropdown(address?._id)}
        >
          <MenuSvg width={28} height={28} />
        </span>

        {activeDropdown === address?._id && (
          <div className="absolute right-0 top-full mt-2 w-40 bg-white border rounded shadow-lg z-10">
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onEditAddress && onEditAddress(address)}
            >
              {t("Edit_button_Address")}
            </div>
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
              onClick={() => handleDelete(address?._id)}
            >
              {t("Delete_button_Address")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressItem;
