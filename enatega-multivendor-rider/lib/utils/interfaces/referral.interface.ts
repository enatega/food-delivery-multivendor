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
