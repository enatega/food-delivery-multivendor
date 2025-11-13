import StatsCard from '@/lib/ui/useable-components/stats-card';
import { PeopleSVG } from '@/lib/utils/assets/svgs/people';
import { PointsSVG } from '@/lib/utils/assets/svgs/points';
import { PointsRedeemedSVG } from '@/lib/utils/assets/svgs/points-redeemed';


export default function LoyaltyAndReferralStatsCardComponent() {

  return (
    <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-3 cursor-pointer">
      <StatsCard
        label="Total Loyal Customers"
        total={10}
        description="Up from yesterday"
        SvgIcon={PeopleSVG}
        route=""
        positiveTrending
        trendChange='8.5%'
        loading={false}
      />

      <StatsCard
        label="Total Points Used"
        total={20}
        description="Up from yesterday"
        SvgIcon={PointsSVG}
        route=""
        positiveTrending
        trendChange='2.4%'
        loading={false}
      />
      <StatsCard
        label="Points Redeemed"
        total={30}
        description="Up from yesterday"
        SvgIcon={PointsRedeemedSVG}
        route=""
        positiveTrending
        trendChange='6.1%'
        loading={false}
      />
      <StatsCard
        label="Active Driver Referrals"
        total={30}
        description="Down from yesterday"
        SvgIcon={PeopleSVG}
        route=""
        positiveTrending={false}
        trendChange='1.9%'
        loading={false}
      />
    </div>
  );
}
