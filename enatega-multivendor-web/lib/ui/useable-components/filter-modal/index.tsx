"use client";

import { Button } from "primereact/button";
import CustomDialog from "@/lib/ui/useable-components/custom-dialog";
import { ICuisinesData } from "@/lib/utils/interfaces";

interface Props {
  visible: boolean;
  onClose: () => void;
  cuisineData: ICuisinesData[];
  tempFilters: { cuisines: string[]; rating: string[] };
  setTempFilters: React.Dispatch<
    React.SetStateAction<{ cuisines: string[]; rating: string[] }>
  >;
  tempSortBy: string;
  setTempSortBy: React.Dispatch<React.SetStateAction<string>>;
  handleFilterApply: () => void;
  clearFilters: () => void;
}

const ratingData = [{ name: "1" }, { name: "2" }, { name: "3" }, { name: "4" }];
const sortByData = [
  { name: "Recommended" },
  { name: "Delivery Time" },
  { name: "Distance" },
  { name: "Rating" },
];

export default function FilterModal({
  visible,
  onClose,
  cuisineData,
  tempFilters,
  setTempFilters,
  tempSortBy,
  setTempSortBy,
  handleFilterApply,
  clearFilters,
}: Props) {
  const toggleCuisineSelection = (name: string) => {
    setTempFilters((prev) => {
      const alreadySelected = prev.cuisines.includes(name);
      return {
        ...prev,
        cuisines:
          alreadySelected ?
            prev.cuisines.filter((c) => c !== name)
          : [...prev.cuisines, name],
      };
    });
  };

  const toggleRatingSelection = (rating: string) => {
    setTempFilters((prev) => {
      const alreadySelected = prev.rating.includes(rating);
      return {
        ...prev,
        rating:
          alreadySelected ?
            prev.rating.filter((r) => r !== rating)
          : [...prev.rating, rating],
      };
    });
  };

  const handleSortBy = (value: string) => {
    setTempSortBy(value);
  };

  return (
    <CustomDialog visible={visible} onHide={onClose}>
      <div className="m-[3%]">
        <button
          onClick={clearFilters}
          className="text-sky-500 text-base font-semibold pb-2"
        >
          Clear Filters
        </button>

        <span className="text-xl font-semibold block">Filters</span>
        <div className="flex flex-wrap gap-2 pt-2 pb-2">
          {cuisineData.map((item) => {
            const isSelected = tempFilters.cuisines.includes(item.name);
            return (
              <Button
                key={item._id}
                onClick={() => toggleCuisineSelection(item.name)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  isSelected ?
                    "bg-primary-color border-primary-color"
                  : "border-gray-500"
                }`}
              >
                {item.name}
              </Button>
            );
          })}
          <div className="w-full h-px bg-gray-300 my-2" />
        </div>

        <span className="text-xl font-semibold">Ratings</span>
        <div className="flex flex-wrap gap-2 pt-2 pb-2">
          {ratingData.map((item) => {
            const isSelected = tempFilters.rating.includes(item.name);
            return (
              <Button
                key={item.name}
                onClick={() => toggleRatingSelection(item.name)}
                className={`px-3 py-1 rounded-full text-sm border gap-1 flex justify-end items-center text-center ${
                  isSelected ?
                    "bg-primary-color border-primary-color"
                  : "border-gray-500"
                }`}
              >
                <span>{item.name}</span>
                <i className="pi pi-star h-[90%]"></i>
              </Button>
            );
          })}
          <div className="w-full h-px bg-gray-300 my-2" />
        </div>

        <span className="text-xl font-semibold">Sort by</span>
        <div className="flex flex-wrap gap-2 pt-2 pb-2">
          {sortByData.map((item) => {
            const isSelected = tempSortBy === item.name;
            return (
              <Button
                key={item.name}
                onClick={() => handleSortBy(item.name)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  isSelected ?
                    "border-sky-500 text-sky-500"
                  : " border-gray-500"
                }`}
              >
                {item.name}
              </Button>
            );
          })}
          <div className="w-full h-px bg-gray-300 my-2" />
        </div>

        <Button
          onClick={handleFilterApply}
          className="w-full py-3 px-2 bg-primary-color rounded-full justify-center items-center text-center text-gray-700"
        >
          Apply
        </Button>
      </div>
    </CustomDialog>
  );
}
