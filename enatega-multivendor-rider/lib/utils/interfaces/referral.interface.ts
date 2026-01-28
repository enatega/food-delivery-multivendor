export interface IReferral {
  _id: string;
  name: string;
  joinedDate: string;
  amount: number;
  status: "Eligible" | "Withdrawn";
  level: 1 | 2 | 3;
}

export interface IReferralEarnings {
  _id: string;
  date: string;
  totalEarningsSum: number;
  totalReferrals: number;
  referralsArray: IReferral[];
}

export interface IReferralEarningsGraph {
  earnings: IReferralEarnings[];
}

export interface IReferralEarningsResponse {
  riderReferralEarningsGraph: IReferralEarningsGraph;
}

export interface IReferralSummary {
  totalReferrals: number;
  totalEarnings: number;
  dateRange: string;
}

// API Response Interfaces

export interface IRecentActivityItem {
  _id: string;
  user_name: string;
  user_rank: string;
  type: string;
  source: string;
  level: number;
  value: number;
  triggeredBy: string;
  createdAt: string;
}

export interface IActivitySummary {
  totalEarnings: number;
  totalReferrals: number;
  periodStart: string;
  periodEnd: string;
}

export interface IRecentActivityResponse {
  fetchRiderRecentActivity: {
    activities: IRecentActivityItem[];
    summary: IActivitySummary;
    hasMore: boolean;
    total: number;
  };
}

export interface IRiderDetail {
  _id: string;
  name: string;
  phone: string;
  joinedAt: string;
  earnedAmount: number;
}

export interface ILevelDetails {
  count: number;
  earnings: number;
  riders: IRiderDetail[];
}

export interface IActivityDetailsResponse {
  fetchRiderActivityDetails: {
    _id: string;
    totalEarnings: number;
    totalReferrals: number;
    createdAt: string;
    referralsByLevel: {
      level1: ILevelDetails;
      level2: ILevelDetails;
      level3: ILevelDetails;
    };
  };
}

export interface IReferralDetail {
  riderId: string;
  riderName: string;
  riderPhone: string;
  joinedAt: string;
  level: number;
  earnedAmount: number;
  status: string;
}

export interface ILevelEarnings {
  totalEarnings: number;
  totalReferrals: number;
}

export interface IReferralRewardsResponse {
  fetchRiderReferralRewards: {
    totalEarnings: number;
    currentBalance: number;
    totalWithdrawn: number;
    earningsByLevel: {
      level1: ILevelEarnings;
      level2: ILevelEarnings;
      level3: ILevelEarnings;
    };
    referralDetails: IReferralDetail[];
  };
}
