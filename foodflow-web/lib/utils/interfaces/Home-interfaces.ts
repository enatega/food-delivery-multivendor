import { StaticImageData } from "next/image";

export interface buttonProps{
    text:string,
    link?:string
  }
  
 export interface HomeMiniCardProps{
    image:string,
    heading:string,
    subText:string,
    headingColor:string,
    backColor:string,
    darkBackColor:string
}
 export interface MoveableProps{
    heading?:string,
    subText?:string,
    button?:React.ReactNode,
    image:string | StaticImageData ,
    middle?:boolean,
    height?:string,
    link?:string
    }

  
 export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  flag?: string;
}

export interface CountryWithCities {
  name: string;
  flag?: string;
  cities: City[];
}

export interface GetCitiesByCountryResponse {
  getCitiesByCountry: CountryWithCities;
}

export interface CitiesTilesProps {
  countryId: string;
  AllCountries: () => void;
}


export interface CountryItem {
  name: string;
  flag?: string;
  _id:string
}

export interface TileProps {
  item?: CountryItem | City;
  loading?: boolean;
  onClick?: (country: CountryItem | City | void ) => void   ;
}