import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useRef } from "react";

interface SideListProps {
  slug: string;
  data: Array<{
    _id: string;
    name: string;
    location: { coordinates: [number, number] };
    image: string;
    address: string;
    reviewAverage: number;
    reviewCount: number;
    shopType: string;
    slug: string;
  }>;
  onHover: (coordinates: { lat: number; lng: number } | null) => void;
}

const SideList: React.FC<SideListProps> = ({ data, onHover }) => {
  const router = useRouter();
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getRedirectUrl = (item) => {
    return `/${item.shopType === "restaurant" ? "restaurant" : "store"}/${item?.slug}/${item._id}`;
  };

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(hover: none)").matches;

    if (!isTouchDevice) return; // ⛔ Skip scroll-based hover on desktop

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
      {
        root: null,
        threshold: 0.6,
      }
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
    <div className="md:shadow-lg md:pt-8 md:bg-white dark:bg-gray-900 md:rounded-lg overflow-y-auto h-full md:pb-12 md:p-4 pl-2">
      <div
        className="flex md:flex-col gap-4 flex-shrink-0 overflow-x-auto scroll-snap-x w-full md:pb-0 pb-2"
        style={{
          scrollSnapType: "x mandatory",
        }}
      >
        {data.map((item, index) => (
          <div
            key={item._id}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="bg-white dark:bg-gray-800 flex items-center p-3 border border-gray-200 dark:border-gray-400 rounded-lg hover:shadow-md transition-shadow flex-shrink-0 md:w-auto w-[85%] cursor-pointer"
            style={{
              scrollSnapAlign: "start",
            }}
            onMouseEnter={() =>
              onHover({
                lat: Number(item.location.coordinates[1]),
                lng: Number(item.location.coordinates[0]),
              })
            }
            onClick={() => {
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
              <p className="text-sm text-gray-600 dark:text-white">{item.address}</p>
              <div className="flex items-center text-sm text-gray-500 mt-1 dark:text-white">
                <span className="mr-2 rtl:ml-2">⭐ {item.reviewAverage.toFixed(1)}</span>
                <span>({item.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideList;
