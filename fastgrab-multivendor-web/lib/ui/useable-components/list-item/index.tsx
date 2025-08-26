import React from "react";
import { Skeleton } from "primereact/skeleton";
import Image from "next/image";
import { TileProps } from "@/lib/utils/interfaces/Home-interfaces";

const ListItem: React.FC<TileProps> = ({ item, loading = false, onClick }) => {
  if (loading) {
    return (
      <div className="border-2 border-solid flex w-full md:w-[280px] rounded p-2 border-[#D1D5DB] gap-4">
        <Skeleton shape="circle" size="3rem" />
        <div className="flex flex-col gap-2">
          <Skeleton width="8rem" height="1rem" />
          <Skeleton width="4rem" height="1rem" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        className="border-[1px] border-solid flex w-full md:w-[280px] rounded-md h-[60px] p-2 border-[#D1D5DB] gap-4 justify-between items-center"
        onClick={() => {
          if (onClick) {
            onClick(item);
          }
        }}
      >
        <div className="flex gap-6 items-center">
          {item?.flag && (
            <Image src={item.flag} height={50} width={50} alt="Flag image" />
          )}
          <p className="text-[#374151] text-[16px]  text-left">{item?.name}</p>
        </div>
        <i className="pi pi-angle-right" style={{ fontSize: "1rem" }}></i>
      </button>
    </div>
  );
};

export default ListItem;
