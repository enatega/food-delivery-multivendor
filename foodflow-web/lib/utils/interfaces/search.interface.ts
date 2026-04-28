import { Dispatch, SetStateAction } from "react";
import { IRestaurant } from "./restaurants.interface";

export interface ISearchContext {
    isSearchFocused: boolean;
    setIsSearchFocused: Dispatch<SetStateAction<boolean>>;
    filter: string;
    setFilter: Dispatch<SetStateAction<string>>;
    searchedData: IRestaurant[];
    setSearchedData: Dispatch<SetStateAction<IRestaurant[]>>;
    searchedKeywords: string[];
    setSearchedKeywords: Dispatch<SetStateAction<string[]>>;
}