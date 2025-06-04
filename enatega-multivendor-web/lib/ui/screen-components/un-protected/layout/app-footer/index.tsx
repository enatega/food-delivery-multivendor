"use client";
import AppLinks from "@/lib/ui/useable-components/Footer/AppLinks";
import FooterLinks from "@/lib/ui/useable-components/Footer/FooterLinks";

import { usePathname } from "next/navigation";

const partnerWithEnatega = {
  title: "Partner with Enatega",
  links: [
     { label: "Home", link: "/",internal:true },
    { label: "For Riders", link: "/rider",internal:true },
    { label: "For Restaurants", link: "/restaurantInfo" , internal:true },
  ],
};


const products = {
  title: "Products",
  links: [
    { label: "Enatega Rider", link: "https://play.google.com/store/apps/details?id=com.enatega.multirider&hl=en" , internal:false},
    { label: "Enatega Restaurant", link: "https://play.google.com/store/apps/details?id=multivendor.enatega.restaurant&hl=en" , internal:false },
  ],
};

const usefulLinks = {
  title: "Company",
  links: [
    { label: "About us", link: "https://ninjascode.com/", internal:false },
    { label: "Terms-Conditions", link: "/terms" , internal:true},
    { label: "Privacy Policy", link: "/privacy" , internal:true},
    { label: "Contact", link: "https://ninjascode.com/" , internal:false },
    { label: "Developers", link: "https://ninjascode.com/" , internal:false},
  ],
};

const followUs = {
  title: "Follow us",
  links: [
    { label: "Blog", link: "https://ninjascode.com/blog",internal:false },
    { label: "Instagram", link: "https://www.instagram.com/ninjascodeofficial?igsh=ajFoeGxud3FqYnd3" , internal:false },
    { label: "Facebook", link: "https://www.facebook.com/enatega/" , internal:false },
    { label: "LinkedIn", link: "https://www.linkedin.com/company/enatega/?originalSubdomain=pk", internal:false },
  ],
};

const AppFooter = () => {
  const pathname = usePathname();
  const isDiscoveryPage = pathname?.endsWith("/restaurants") || pathname?.endsWith("/discovery") ||pathname?.endsWith("/store");

  return (
    <div className={`"w-full h-auto bg-[#141414] flex items-center justify-center ${isDiscoveryPage? "md:pb-0 pb-20":""}`}>
      <div className=" mx-auto my-[30px]  md:mt-[60px] md:mb-[60px] p-4  flex md:items-center md:justify-center flex-col ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 w-screen md:w-full md:px-0 px-4  "> 
          <div className="p-2">
            <AppLinks/>
          </div>
          <div className="p-2">
            <FooterLinks section={partnerWithEnatega} />
          </div>
          <div className="p-2">
            <FooterLinks section={products} />
          </div>
          <div className="p-2">
            <FooterLinks section={usefulLinks} />
          </div>
          <div className="p-2">
            <FooterLinks section={followUs} />
          </div>
        </div>
      </div>
    </div>
  );
};

AppFooter.displayName = "AppFooter";

export default AppFooter;
