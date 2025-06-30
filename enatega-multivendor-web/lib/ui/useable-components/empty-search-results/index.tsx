"use client"
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function EmptySearch() {
      const [animationData, setAnimationData] = useState<null | object>(null);
      
      useEffect(() => {
        fetch("/assets/lottie/no-results.json")
          .then((res) => res.json())
          .then(setAnimationData)
          .catch((err) => console.error("Failed to load Lottie JSON", err));
      }, []);
    
  return (
    <div className="flex flex-col items-center justify-center p-6">
     <div className="w-32 h-32 md:w-60 md:h-60 flex items-center justify-center">
       <Lottie animationData={animationData} loop={true} autoplay={true} />
      </div>
      <p className="text-gray-500 text-sm md:text-base text-center mb-4">No item found</p>
    </div>
  )
}

