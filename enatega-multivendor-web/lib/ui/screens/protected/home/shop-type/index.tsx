"use client";

import { useState, useEffect, useCallback } from "react";
import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";
import useGetCuisines from "@/lib/hooks/useGetCuisines";
import GenericListingComponent from "@/lib/ui/screen-components/protected/home/GenericListingComponent";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function ShopTypeScreen() {
    const params = useParams();
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const t = useTranslations();
  const limit = 10;

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { loading, error, queryData, fetchMore } = useNearByRestaurantsPreview(
    true,
    page,
    limit,
    slug
  );

//   const { loading: cuisinesloading, restaurantCuisinesData } = useGetCuisines(true, slug);

  // ✅ Initial load
  useEffect(() => {
    if (page === 1 && queryData?.length) {
      setItems(queryData);
    }
  }, [queryData, page]);

  // ✅ Load more
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      const res = await fetchMore({
        variables: { page: page + 1, limit, shopType: slug },
      });

      const newItems = res.data?.nearByRestaurantsPreview?.restaurants ?? [];

      if (newItems.length > 0) {
        setItems((prev) => [...prev, ...newItems]);
        setPage((p) => p + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("❌ Error fetching more:", err);
    }
  }, [page, hasMore, fetchMore, loading]);

  // ✅ Scroll listener (your tested one)
  useEffect(() => {
    if (!fetchMore || !hasMore) return;

    const handleScroll = () => {
      const scrollTop = document.body.scrollTop;
      const clientHeight = document.body.clientHeight;
      const scrollHeight = document.body.scrollHeight;
 
      const bottom = scrollTop + clientHeight >= scrollHeight - 300;

      if (bottom && !loading) {
       
        loadMore();
      }
    };

    document.body.addEventListener("scroll", handleScroll);
    return () => document.body.removeEventListener("scroll", handleScroll);
  }, [fetchMore, hasMore, loading, loadMore]);

return (
    <GenericListingComponent
        queryData={queryData}
        headingTitle={`${slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())} near you`}
        cuisineSectionTitle={""}
        mainSectionTitle={""}
        mainData={items} // ✅ pass paginated items
        cuisineDataFromHook={[]}
        loading={loading}
        cuisinesloading={loading}
        error={!!error}
        hasMore={hasMore} // ✅ pass down so MainSection can show "No more"
    />
);
}
