import LoyaltyAndReferralHeader from '@/lib/ui/screen-components/protected/super-admin/loyalty-referrals/header';
import LoyaltyAndReferralCustomerReferralSystemComponent from '@/lib/ui/screen-components/protected/super-admin/loyalty-referrals/customer-referral-system';
import LoyaltyAndReferralTierSystemComponent from '@/lib/ui/screen-components/protected/super-admin/loyalty-referrals/customer-tier-system';
import LoyaltyAndReferralHistoryComponent from '@/lib/ui/screen-components/protected/super-admin/loyalty-referrals/loyalty-and-referral-history';
import LoyaltyAndReferralBreakdownSectionComponent from '@/lib/ui/screen-components/protected/super-admin/loyalty-referrals/loyalty-points-breakdown';
import LoyaltyAndReferralStatsCardComponent from '@/lib/ui/screen-components/protected/super-admin/loyalty-referrals/stats-cards.component';

export default function LoyaltyAndReferralScreen() {
  return (
    <div className="screen-container">
      <LoyaltyAndReferralHeader />
      <LoyaltyAndReferralStatsCardComponent />
      <LoyaltyAndReferralCustomerReferralSystemComponent />
      <LoyaltyAndReferralTierSystemComponent />
      <LoyaltyAndReferralBreakdownSectionComponent />
      <LoyaltyAndReferralHistoryComponent />
    </div>
  );
}
