import { ISearchContext } from "@/lib/utils/interfaces/search.interface";
import React, { useContext, useMemo, useState } from "react";
import { IRestaurant } from "@/lib/utils/interfaces";

const SearchUIContext = React.createContext({} as ISearchContext);

export const SearchUIProvider = ({ children }) => {
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [searchedData, setSearchedData] = useState<IRestaurant[]>([]);
  const [searchedKeywords, setSearchedKeywords] = useState<string[]>([]);

  const value = useMemo(
    () => ({
      isSearchFocused,
      setIsSearchFocused,
      filter,
      setFilter,
      searchedData,
      setSearchedData,
      searchedKeywords,
      setSearchedKeywords,
    }),
    [
      isSearchFocused,
      filter,
      searchedData,
      searchedKeywords,
    ]
  );

  return (
    <SearchUIContext.Provider value={value}>
      {children}
    </SearchUIContext.Provider>
  );
};

export const useSearchUI = () => useContext(SearchUIContext);
