'use client';
import EarningsRestaurantHeader from "@/lib/ui/screen-components/protected/restaurant/earnings/header/screen-header";
import EarningsRestaurantMain from "@/lib/ui/screen-components/protected/restaurant/earnings/main";
import { IEarningFilters, IGrandTotalEarnings, IStoreEarnings } from "@/lib/utils/interfaces/earnings.interface";
import { useState } from "react";
export default function EarningsRestaurantScreen() {

  const [earnings, setTotalEarnings] = useState<IStoreEarnings>({} as IStoreEarnings)


  return (
    <div className="screen-container">
      <EarningsRestaurantHeader earnings={earnings} />
      <EarningsRestaurantMain setTotalEarnings={setTotalEarnings} />
    </div>
  );
}
