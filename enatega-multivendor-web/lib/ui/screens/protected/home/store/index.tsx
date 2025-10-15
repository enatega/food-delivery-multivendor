"use client"

import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";
import useGetCuisines from "@/lib/hooks/useGetCuisines";
import GenericListingComponent from "@/lib/ui/screen-components/protected/home/GenericListingComponent";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

export default function StoreScreen() {
  const t = useTranslations();
  const limit = 10;

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  
  const { loading, error, queryData, fetchMore } = useNearByRestaurantsPreview(true, page, limit, "grocery");
  const { loading:cuisinesloading, groceryCuisinesData } = useGetCuisines();
 

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
        variables: { page: page + 1, limit, shopType: "grocery" },
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
      console.log("scrollTop, clientHeight, scrollHeight", scrollTop, clientHeight, scrollHeight);
      const bottom = scrollTop + clientHeight >= scrollHeight - 300;   

      if (bottom && !loading) {
        console.log("near bottom reached")
        loadMore();
      }
    };

    document.body.addEventListener("scroll", handleScroll);
    return () => document.body.removeEventListener("scroll", handleScroll);
  }, [fetchMore, hasMore, loading, loadMore]);


  return ( 
    <GenericListingComponent
      queryData={queryData}
      headingTitle= {t('StoresPage.headingTitle')}
      cuisineSectionTitle={t('StoresPage.cuisineSectionTitle')}
      mainSectionTitle={t('StoresPage.mainSectionTitle')}
      mainData={items} // ✅ pass paginated items
      cuisineDataFromHook={groceryCuisinesData}
      loading={loading}
      cuisinesloading={cuisinesloading}
      error={!!error}
      hasMore={hasMore} // ✅ pass down so MainSection can show "No more"
    />
  );
}
