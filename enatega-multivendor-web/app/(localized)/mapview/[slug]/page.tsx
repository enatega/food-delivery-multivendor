"use client";
import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";
import { FC, useEffect, useState } from "react";
import Loader from "./components/Loader";
import DisplayError from "./components/DisplayError";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import Map from "./components/Map";
import SideList from "./components/SideList";
import dynamic from "next/dynamic";
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
        useNearByRestaurantsPreview();

    const { GOOGLE_MAPS_KEY } = useConfig();
    const data = slug === "restaurants" ? restaurantsData : groceriesData;
    const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
        null
    );

    return (
        <div className="w-screen">
            {loading ? (
                <Loader />
            ) : error ? (
                <DisplayError />
            ) : data?.length > 0 ? (
                <div className="flex mt-1 relative min-h-screen max-h-screen md:flex-row flex-col-reverse">
                    <div className="md:relative absolute bottom-0 z-[99] md:flex-[0.35] xl:flex-[0.25] overflow-y-auto md:w-auto w-full">
                        <SideList
                            data={data}
                            slug={slug}
                            onHover={(coordinates) => setCenter(coordinates)}
                        />
                    </div>
                    <div className="flex-[0.65] xl:flex-[0.75] h-screen overflow-y-auto">
                        <Map
                            apiKey={GOOGLE_MAPS_KEY}
                            data={data}
                            center={center}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex mt-1 relative min-h-screen max-h-screen md:flex-row flex-col-reverse">
                    <div className="md:relative absolute top-2 mt-12 z-[99] md:flex-[0.35] xl:flex-[0.25] overflow-y-auto md:w-auto w-full ">
                        {/* <h1 className="text-2xl font-bold text-gray-900 h-screen flex items-center justify-center">
                            No data available to show.
                        </h1> */}
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
                            data={data}
                            center={center}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapView;
