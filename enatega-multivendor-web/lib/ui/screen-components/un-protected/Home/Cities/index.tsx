"use client";

import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { GET_COUNTRIES } from "@/lib/api/graphql/queries/Countries";
import ListItem from "@/lib/ui/useable-components/list-item";
import CitiesTiles from "./CitilesTiles/CitiesTiles";
import { CountryItem, City } from "@/lib/utils/interfaces/Home-interfaces";
import { useTranslations } from "next-intl";
import TenantBrowseSection from "../TenantBrowse";

const COUNTRIES = gql`
  ${GET_COUNTRIES}
`;

function isTenantSubdomain(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host !== "localhost" && host.split(".").length > 1 && host.endsWith("localhost");
}

const Cities = () => {
  const [toggle, setToggle] = useState(false);
  const [countryId, setCountryId] = useState("");
  const t = useTranslations();

  // On tenant subdomains, show the tenant-specific section instead of the global country list
  if (isTenantSubdomain()) {
    return <TenantBrowseSection />;
  }

  const onCountryClick = (item: CountryItem | City | void) => {
    const country = item as CountryItem;
    setToggle(true);
    setCountryId(country._id);
  };

  const AllCountrybuttonClick = () => {
    setToggle(false);
  };

  return <CitiesInner
    toggle={toggle}
    countryId={countryId}
    onCountryClick={onCountryClick}
    AllCountrybuttonClick={AllCountrybuttonClick}
    t={t}
  />;
};

// Split out so the hook is only called for non-tenant paths
function CitiesInner({
  toggle,
  countryId,
  onCountryClick,
  AllCountrybuttonClick,
  t,
}: {
  toggle: boolean;
  countryId: string;
  onCountryClick: (item: CountryItem | City | void) => void;
  AllCountrybuttonClick: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const { data, loading } = useQuery(COUNTRIES, {
    fetchPolicy: "cache-and-network",
  });

  return (
    <div>
      {toggle == false ? (
        <>
          <div className="text-[#111827] dark:text-white text-xl font-semibold">
            {t("selectCity")}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center my-[30px]">
            {loading
              ? [...Array(8)].map((_, index) => (
                  <ListItem key={index} loading={true} />
                ))
              : data?.getCountries?.map((item: CountryItem, index: number) => (
                  <ListItem key={index} item={item} onClick={onCountryClick} />
                ))}
          </div>
        </>
      ) : (
        <div className="bg-green">
          <CitiesTiles countryId={countryId} AllCountries={AllCountrybuttonClick} />
        </div>
      )}
    </div>
  );
}

export default Cities;
