import { IReferral, IReferralEarnings } from "../interfaces/referral.interface";

// Mock referrals data sorted by name (ascending)
export const mockReferrals: IReferral[] = [
  {
    _id: "1",
    name: "Ahmed Ali",
    joinedDate: "2025-01-15",
    amount: 2.5,
    status: "Eligible",
    level: 1,
  },
  {
    _id: "2",
    name: "Ali Hassan",
    joinedDate: "2025-01-18",
    amount: 2.5,
    status: "Withdrawn",
    level: 1,
  },
  {
    _id: "3",
    name: "Fatima Khan",
    joinedDate: "2025-01-20",
    amount: 2.5,
    status: "Eligible",
    level: 2,
  },
  {
    _id: "4",
    name: "Hassan Ahmed",
    joinedDate: "2025-01-12",
    amount: 2.5,
    status: "Eligible",
    level: 1,
  },
  {
    _id: "5",
    name: "Layla Mohammed",
    joinedDate: "2025-01-22",
    amount: 2.5,
    status: "Withdrawn",
    level: 2,
  },
  {
    _id: "6",
    name: "Mohammed Ali",
    joinedDate: "2025-01-10",
    amount: 2.5,
    status: "Eligible",
    level: 1,
  },
  {
    _id: "7",
    name: "Omar Khalid",
    joinedDate: "2025-01-25",
    amount: 2.5,
    status: "Eligible",
    level: 3,
  },
  {
    _id: "8",
    name: "Sara Ibrahim",
    joinedDate: "2025-01-14",
    amount: 2.5,
    status: "Withdrawn",
    level: 1,
  },
  {
    _id: "9",
    name: "Yusuf Ahmed",
    joinedDate: "2025-01-16",
    amount: 2.5,
    status: "Eligible",
    level: 2,
  },
  {
    _id: "10",
    name: "Zainab Hassan",
    joinedDate: "2025-01-19",
    amount: 2.5,
    status: "Eligible",
    level: 3,
  },
];

// Mock referral earnings data grouped by date
export const mockReferralEarnings: IReferralEarnings[] = [
  {
    _id: "week1",
    date: "Jan 10-16",
    totalEarningsSum: 12.5,
    totalReferrals: 5,
    referralsArray: mockReferrals.slice(0, 5),
  },
  {
    _id: "week2",
    date: "Jan 17-23",
    totalEarningsSum: 7.5,
    totalReferrals: 3,
    referralsArray: mockReferrals.slice(5, 8),
  },
  {
    _id: "week3",
    date: "Jan 24-27",
    totalEarningsSum: 5.0,
    totalReferrals: 2,
    referralsArray: mockReferrals.slice(8, 10),
  },
];
