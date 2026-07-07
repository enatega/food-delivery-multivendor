"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ListItem from "@/lib/ui/useable-components/list-item";
import Card from "@/lib/ui/useable-components/card";
import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";
import SliderSkeleton from "@/lib/ui/useable-components/custom-skeletons/slider.loading.skeleton";
import { useTranslations } from "next-intl";

const TenantBrowseSection: React.FC = () => {
  const router = useRouter();
  const t = useTranslations();

  // Resolve tenant business name from the branding script (async)
  const [tenantName, setTenantName] = useState<string>(() => {
    if (typeof window !== "undefined" && window.__TENANT_BRANDING__?.business_name) {
      return window.__TENANT_BRANDING__.business_name;
    }
    return "";
  });

  useEffect(() => {
    const apply = () => {
      if (window.__TENANT_BRANDING__?.business_name) {
        setTenantName(window.__TENANT_BRANDING__.business_name);
      }
    };
    apply();
    window.addEventListener("tenant-branding-ready", apply);
    return () => window.removeEventListener("tenant-branding-ready", apply);
  }, []);

  const { queryData, restaurantsData, loading, error } = useNearByRestaurantsPreview(true, 1, 12);
  // Use all returned restaurants — restaurantsData is filtered by shopType === 'restaurant';
  // fall back to queryData so stores without shopType are still shown.
  const stores = restaurantsData.length > 0 ? restaurantsData : queryData;

  const [isModalOpen, setIsModalOpen] = useState({ value: false, id: "" });
  const handleUpdateIsModalOpen = useCallback(
    (value: boolean, id: string) => {
      setIsModalOpen((prev) =>
        prev.value !== value || prev.id !== id ? { value, id } : prev
      );
    },
    []
  );

  return (
    <div>
      {/* Country / city tile */}
      <div className="text-[#111827] dark:text-white text-xl font-semibold mb-[30px]">
        {t("selectCity")}
      </div>
      <div className="mb-[30px]">
        <ListItem
          item={{ _id: "tenant-city", name: tenantName || "Our Delivery Area" }}
          onClick={() => router.push("/discovery")}
        />
      </div>

      {/* Restaurant browse */}
      <div className="text-[#111827] dark:text-white text-xl font-semibold mb-4">
        Browse Stores
      </div>

      {loading && <SliderSkeleton />}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
          {stores.map((item) => (
            <Card
              key={item._id}
              item={item}
              isModalOpen={isModalOpen}
              handleUpdateIsModalOpen={handleUpdateIsModalOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantBrowseSection;
