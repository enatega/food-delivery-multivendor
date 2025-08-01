"use client";

// core
import Image from "next/image";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

// Assets
import { ClockSvg, CycleSvg, FaceSvg } from "@/lib/utils/assets/svg";
import IconWithTitle from "../icon-with-title";

// Hooks
import { useSearchUI } from "@/lib/context/search/search.context";

// Interface
import { ICardProps, IOpeningTime } from "@/lib/utils/interfaces";
import { saveSearchedKeyword } from "@/lib/utils/methods";
import CustomDialog from "../custom-dialog";
import { Button } from "primereact/button";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import { useTranslations } from "next-intl";

const Card: React.FC<ICardProps> = ({
    item,
    isModalOpen = { value: false, id: "" },
    handleUpdateIsModalOpen = () => {},
}) => {
    const router = useRouter();
    const t = useTranslations()
    const pathname = usePathname();
    const shouldTruncate = item.name?.length > 15;
    const { setIsSearchFocused, setFilter, isSearchFocused, filter } =
        useSearchUI();

    const { DELIVERY_RATE } = useConfig();

    console.log("isModalOpen", isModalOpen);

    const isWithinOpeningTime = (openingTimes: IOpeningTime[]): boolean => {
        const now = new Date();
        const currentDay = now
            .toLocaleString("en-US", { weekday: "short" })
            .toUpperCase(); // e.g., "MON", "TUE", ...
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        const todayOpening = openingTimes.find((ot) => ot.day === currentDay);
        if (!todayOpening) return false;

        return todayOpening.times.some(({ startTime, endTime }) => {
            const [startHour, startMinute] = startTime.map(Number);
            const [endHour, endMinute] = endTime.map(Number);

            const startTotal = startHour * 60 + startMinute;
            const endTotal = endHour * 60 + endMinute;
            const nowTotal = currentHour * 60 + currentMinute;

            return nowTotal >= startTotal && nowTotal <= endTotal;
        });
    };

    return (
        <div
            className={`relative rounded-md shadow-md cursor-pointer hover:scale-102 hover:opacity-95 transition-transform duration-500 max-h-[272px] w-[96%] ml-[2%] ${pathname === "/restaurants" || pathname === "/store" ? "my-[2%]" : "my-[4%]"}`}
            onClick={() => {
                // const params = new URLSearchParams({ name: item?.name, id: item._id });
                // router.push(`/restaurant?${params.toString()}`);

                if (
                    !item?.isAvailable ||
                    !item?.isActive ||
                    !isWithinOpeningTime(item?.openingTimes)
                ) {
                    handleUpdateIsModalOpen(true, item._id);
                    return;
                }

                router.push(
                    `/${item.shopType === "restaurant" ? "restaurant" : "store"}/${item?.slug}/${item._id}`
                ); // the root route may change based on store or grocery

                // onUseLocalStorage("save", "restaurant", item._id);
                // onUseLocalStorage("save", "restaurant-slug", item.slug);
                // onUseLocalStorage(
                //   "save",
                //   "currentShopType",
                //   item.shopType === "restaurant" ? "restaurant" : "store"
                // );

                // reset search
                setFilter("");
                setIsSearchFocused(false);

                // save the keyword in local storage
                saveSearchedKeyword(filter);
            }}
        >
            {/* Image Container */}
            <div
                className={`relative w-full ${isSearchFocused ? "h-[160px]" : "h-[160px]"}`}
            >
                <Image
                    src={item?.image}
                    alt={item?.name}
                    fill
                    className="object-cover rounded-t-md"
                    unoptimized
                />
            </div>
            {/* overlay if item.isActive is false */}
            {(!item?.isAvailable ||
                !item?.isActive ||
                !isWithinOpeningTime(item?.openingTimes)) && (
                <div className="absolute rounded-md top-0 left-0 w-full h-[160px] bg-black/50 opacity-75 z-20 flex items-center justify-center">
                    <div className="text-white text-center z-30">
                        <p className="text-lg font-bold">{t('closed_label')}</p>
                        <p className="text-sm">{t("currently_closed_message")}</p>
                    </div>
                </div>
            )}
            {/* Content Section */}
            <div className="p-2 flex flex-col justify-between flex-shrink">
                {/* Name & Cuisines */}

                <div className="flex flex-row justify-between items-center relative border-b border-dashed pb-1">
                    <div className="w-[70%]">
                        <p
                            title={shouldTruncate ? item?.name : ""}
                            className="text-base lg:text-lg text-[#374151] font-semibold line-clamp-1"
                        >
                            {item?.name}
                        </p>
                        <p className="text-xs xl:text-sm text-[#4B5563] font-light line-clamp-1">
                            {item?.cuisines[0]}
                        </p>
                    </div>
                    {/* Delivery Time */}
                    <div className="bg-[#F3FFEE] rounded-md flex items-center justify-center px-2 py-2 h-[40px]">
                        <p className="text-xs text-[#5AC12F] font-light lg:font-normal text-center flex justify-center items-center">
                            {`${item?.deliveryTime}`} min
                            {/* {`${item?.deliveryTime > 5 ? item?.deliveryTime - 5 : item?.deliveryTime} - ${item?.deliveryTime + 5}`}{" "} */}
                            {/* <br /> min */}
                        </p>
                    </div>
                </div>

                {/* Icons Section */}
                <div className="flex flex-row justify-between w-[80%] sm:w-[100%] lg:w-[75%] pt-1">
                    <IconWithTitle
                        logo={() => <ClockSvg isBlue={true} />}
                        title={item?.deliveryTime + " mins"}
                        isBlue={true}
                    />
                    {DELIVERY_RATE && (
                        <IconWithTitle logo={CycleSvg} title={DELIVERY_RATE} />
                    )}
                    <IconWithTitle logo={FaceSvg} title={item?.reviewAverage} />
                </div>
            </div>

            {/* create a modal that will be show that this restaurant is closed do want to see menu or want to close if click on the see menu then will move to the next page other wise modal will be closed */}
            <CustomDialog
                className="max-w-[300px]"
                visible={isModalOpen.value && isModalOpen.id === item._id}
                onHide={() => handleUpdateIsModalOpen(false, item._id)}
            >
                <div className="text-center  pt-10">
                    <p className="text-lg font-bold pb-3">
                        {item.shopType === "restaurant"
                            ? "Restaurant"
                            : "Store"}{" "}
                       {t('is_closed_label')}
                    </p>
                    <p className="text-sm">{t('see_menu_prompt')}</p>
                    <div className="flex pt-9 px-2 pb-2 flex-row justify-center items-center gap-2 w-full">
                        <Button
                            style={{
                                fontSize: "14px",
                                fontWeight: "normal",
                            }}
                            onClick={() =>
                                handleUpdateIsModalOpen(false, item._id)
                            }
                            label={t('close_label')}
                            className="w-1/2 bg-red-300 text-base font-normal text-black rounded-md min-h-10"
                        />
                        <Button
                            style={{
                                fontSize: "14px",
                                fontWeight: "normal",
                            }}
                            onClick={() =>
                                router.push(
                                    `/${item.shopType === "restaurant" ? "restaurant" : "store"}/${item?.slug}/${item._id}`
                                )
                            }
                            label={t('see_menu_label')}
                            className="w-1/2 bg-[#94e469] text-base font-normal text-black rounded-md min-h-10"
                        />
                    </div>
                </div>
            </CustomDialog>
        </div>
    );
};

export default Card;
