  'use client';
  import EarningsSuperAdminHeader from "@/lib/ui/screen-components/protected/super-admin/earnings/view/header/screen-header";
  import EarningsMain from "@/lib/ui/screen-components/protected/super-admin/earnings/view/main";
  import { IGrandTotalEarnings } from "@/lib/utils/interfaces/earnings.interface";
  import { useState } from "react";
  export default function EarningSuperAdminScreen() {

    const [earnings, setTotalEarnings] = useState<IGrandTotalEarnings>({} as IGrandTotalEarnings)


    return (
      <div className="screen-container">
        <EarningsSuperAdminHeader earnings={earnings} />
        <EarningsMain setTotalEarnings={setTotalEarnings} />
      </div>
    );
  }
