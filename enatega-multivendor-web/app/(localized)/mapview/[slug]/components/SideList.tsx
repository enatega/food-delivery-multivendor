"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import CustomDialog from "@/lib/ui/useable-components/custom-dialog";
import {
  isRestaurantOpen,
  Restaurant,
} from "../../../../../lib/utils/constants/isRestaurantOpen";

interface SideListProps {
  slug: string;
  data: Array<Restaurant>;
  onHover: (coordinates: { lat: number; lng: number } | null) => void;
}

const SideList: React.FC<SideListProps> = ({ data, onHover }) => {
  const router = useRouter();
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isModalOpen, setIsModalOpen] = useState({
    value: false,
    id: null as string | null,
  });

  const [selectedItem, setSelectedItem] = useState<Restaurant | null>(null);

  const handleUpdateIsModalOpen = (value: boolean, id: string, item?: any) => {
    setIsModalOpen({ value, id });
    if (value && item) setSelectedItem(item);
  };

  const getRedirectUrl = (item: Restaurant) => {
    return `/${item.shopType === "restaurant" ? "restaurant" : "store"}/${item.slug}/${item._id}`;
  };

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (!isTouchDevice) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = itemRefs.current.findIndex(
              (ref) => ref === entry.target
            );
            if (index !== -1) {
              const item = data[index];
              onHover({
                lat: Number(item.location.coordinates[1]),
                lng: Number(item.location.coordinates[0]),
              });
            }
          }
        });
      },
      { root: null, threshold: 0.6 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      itemRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [data, onHover]);

  return (
    <>
      {/* LIST UI */}
      <div className="md:shadow-lg md:pt-8 md:bg-white dark:bg-gray-900 md:rounded-lg overflow-y-auto h-full md:pb-12 md:p-4 pl-2">
        <div
          className="flex md:flex-col gap-4 flex-shrink-0 overflow-x-auto scroll-snap-x w-full md:pb-0 pb-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {data.map((item, index) => {
            const open = isRestaurantOpen(item);

            return (
              <div
                key={item._id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className="bg-white dark:bg-gray-800 flex items-center p-3 border border-gray-200 dark:border-gray-400 rounded-lg hover:shadow-md transition-shadow flex-shrink-0 md:w-auto w-[85%] cursor-pointer"
                style={{ scrollSnapAlign: "start" }}
                onMouseEnter={() =>
                  onHover({
                    lat: Number(item.location.coordinates[1]),
                    lng: Number(item.location.coordinates[0]),
                  })
                }
                onClick={() => {
                  if (!open) {
                    handleUpdateIsModalOpen(true, item._id, item);
                    return;
                  }
                  router.push(getRedirectUrl(item));
                }}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="object-cover rounded-md mr-4 rtl:ml-4"
                  style={{ minWidth: "64px", minHeight: "64px" }}
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-white">
                    {item.address}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mt-1 dark:text-white">
                    <span className="mr-2 rtl:ml-2">
                      ⭐ {item.reviewAverage.toFixed(1)}
                    </span>
                    <span>({item.reviewCount} reviews)</span>
                  </div>

                  <div className="flex items-center text-sm font-semibold mt-1">
                    {open ? (
                      <span className="text-green-600">Open</span>
                    ) : (
                      <span className="text-red-600">Closed</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      {selectedItem && (
        <CustomDialog
          className="max-w-[300px]"
          visible={isModalOpen.value && isModalOpen.id === selectedItem._id}
          onHide={() => handleUpdateIsModalOpen(false, selectedItem._id)}
        >
          <div className="text-center pt-10 dark:text-white">
            <p className="text-lg font-bold pb-3">
              {selectedItem.shopType === "restaurant" ? "Restaurant" : "Store"}{" "}
              is closed
            </p>

            <p className="text-sm">Do you want to see menu?</p>

            <div className="flex pt-9 px-2 pb-2 flex-row justify-center items-center gap-2 w-full">
              <button
                style={{ fontSize: "14px", fontWeight: "normal" }}
                onClick={() => handleUpdateIsModalOpen(false, selectedItem._id)}
                className="w-1/2 bg-red-300 text-black dark:text-white dark:bg-red-500 rounded-md min-h-10"
              >
                Close
              </button>

              <button
                style={{ fontSize: "14px", fontWeight: "normal" }}
                onClick={() => {
                  handleUpdateIsModalOpen(false, selectedItem._id);

                  setTimeout(() => {
                    router.push(getRedirectUrl(selectedItem));
                  }, 100);
                }}
                className="w-1/2 bg-primary-color text-black dark:text-black rounded-md min-h-10"
              >
                See Menu
              </button>
            </div>
          </div>
        </CustomDialog>
      )}
    </>
  );
};

export default SideList;
