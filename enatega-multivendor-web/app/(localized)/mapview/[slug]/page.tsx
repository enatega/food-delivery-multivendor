"use client";
import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";
import { FC, useEffect, useState } from "react";
import Loader from "./components/Loader";
import DisplayError from "./components/DisplayError";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import Map from "./components/Map";
import SideList from "./components/SideList";
import dynamic from "next/dynamic";

//Your correct import
import { isRestaurantOpen } from "../../../../lib/utils/constants/isRestaurantOpen";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface MapViewPageProps {
    params: {
        slug: string;
    };
}
const MapView: FC<MapViewPageProps> = ({ params }) => {
    const [animationData, setAnimationData] = useState<null | object>(null);

    useEffect(() => {
        fetch("/assets/lottie/no-results.json")
            .then((res) => res.json())
            .then(setAnimationData)
            .catch((err) => console.error("Failed to load Lottie JSON", err));
    }, []);

    const { slug } = params;

    const { error, loading, restaurantsData, groceriesData } =
        useNearByRestaurantsPreview(true, 1, 110);

    const { GOOGLE_MAPS_KEY } = useConfig();

    const data = slug === "restaurants" ? restaurantsData : groceriesData;

    const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);

    // ⭐ Enhance data with isOpen field
    const enhancedData = data?.map((restaurant: any) => ({
        ...restaurant,
        isOpen: isRestaurantOpen(restaurant.openingTimes),  
    }));

    return (
        <div className="w-screen">
            {loading ? (
                <Loader />
            ) : error ? (
                <DisplayError />
            ) : enhancedData?.length > 0 ? (
                <div className="flex mt-1 relative min-h-screen max-h-screen md:flex-row flex-col-reverse">

                    {/* LEFT SIDE LIST */}
                    <div className="md:relative absolute bottom-0 z-[99] md:flex-[0.35] xl:flex-[0.25] overflow-y-auto md:w-auto w-full">
                        <SideList
                            data={enhancedData}
                            slug={slug}
                            onHover={(coordinates) => setCenter(coordinates)}
                        />
                    </div>

                    {/* RIGHT MAP */}
                    <div className="flex-[0.65] xl:flex-[0.75] h-screen overflow-y-auto">
                        <Map
                            apiKey={GOOGLE_MAPS_KEY}
                            data={enhancedData}
                            center={center}
                        />
                    </div>

                </div>
            ) : (
                // NO DATA UI
                <div className="flex mt-1 relative min-h-screen max-h-screen md:flex-row flex-col-reverse">
                    <div className="md:relative absolute top-2 mt-12 z-[99] md:flex-[0.35] xl:flex-[0.25] overflow-y-auto md:w-auto w-full ">
                        <div className="flex flex-col items-center justify-center p-6">
                            <div className="w-32 h-32 md:w-60 md:h-60 flex items-center justify-center">
                                <Lottie
                                    animationData={animationData}
                                    loop={true}
                                    autoplay={true}
                                />
                            </div>
                            <p className="text-gray-500 text-sm md:text-base text-center mb-4">
                                No data available to show.
                            </p>
                        </div>
                    </div>

                    <div className="flex-[0.65] xl:flex-[0.75] h-screen overflow-y-auto hidden md:flex">
                        <Map
                            apiKey={GOOGLE_MAPS_KEY}
                            data={enhancedData}
                            center={center}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapView;
