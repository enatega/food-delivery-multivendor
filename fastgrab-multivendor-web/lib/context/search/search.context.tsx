import { ISearchContext } from "@/lib/utils/interfaces/search.interface";
import React, { useContext, useState } from "react";
import { IRestaurant } from "@/lib/utils/interfaces";

const SearchUIContext = React.createContext({} as ISearchContext);

export const SearchUIProvider = ({ children }) => {
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [searchedData, setSearchedData] = useState<IRestaurant[]>([]);
  const [searchedKeywords, setSearchedKeywords] = useState<string[]>([]);

  return (
    <SearchUIContext.Provider
      value={{
        isSearchFocused,
        setIsSearchFocused,
        filter,
        setFilter,
        searchedData,
        setSearchedData,
        searchedKeywords,
        setSearchedKeywords,
      }}
    >
      {children}
    </SearchUIContext.Provider>
  );
};

export const useSearchUI = () => useContext(SearchUIContext);
