import { StaticImageData } from "next/image";

export interface Cards {
  image: string | StaticImageData;
  heading: string;
  text: string;
  color:string;
}

export interface WhyCardsListProps {
  cards: Cards[];
}

export interface sideCardProps{
  image:string | StaticImageData,
  heading:string,
  subHeading:string,
  right:boolean
  }
  
  
 export interface sideCardList{
    sideCards:sideCardProps[]
  }


 export interface VendorFormValues {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
  }