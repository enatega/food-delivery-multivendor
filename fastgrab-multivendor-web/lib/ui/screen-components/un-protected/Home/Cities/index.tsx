"use client";

import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { GET_COUNTRIES } from "@/lib/api/graphql/queries/Countries";
import ListItem from "@/lib/ui/useable-components/list-item";
import CitiesTiles from "./CitilesTiles/CitiesTiles";
import { CountryItem, City } from "@/lib/utils/interfaces/Home-interfaces";
import { useTranslations } from "next-intl";

const COUNTRIES = gql`
  ${GET_COUNTRIES}
`;

const Cities = () => {
  const [toggle, setToggle] = useState(false);
  const [countryId, setCountryId] = useState("");
  const { data, loading } = useQuery(COUNTRIES, {
    fetchPolicy: "cache-and-network",
  });
  const onCountryClick = (item: CountryItem | City | void) => {
    const country = item as CountryItem;
    setToggle(true);
    setCountryId(country._id);
  };

  const AllCountrybuttonClick = () => {
    setToggle(false);
  };
  const t = useTranslations();

  return (
    <div>
      {toggle == false ?
        <>
          <div className="text-[#111827] text-xl font-semibold ">
           {t('selectCity')}
          </div>
          {/* <div className="flex flex-wrap gap-6 items-center  my-[30px]"> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center my-[30px]">
            {loading ?
              [...Array(8)].map((_, index) => (
                <ListItem key={index} loading={true} />
              ))
            : data?.getCountries?.map((item: CountryItem, index: number) => (
                <ListItem key={index} item={item} onClick={onCountryClick} />
              ))
            }
          </div>
        </>
      : <div className="bg-green">
          <CitiesTiles
            countryId={countryId}
            AllCountries={AllCountrybuttonClick}
          />
        </div>
      }
    </div>
  );
};

export default Cities;
