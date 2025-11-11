'use client';

import { useState, useEffect, useRef } from 'react';

interface BreakdownRow {
  id: number;
  customer_name: string;
  rank: string;
  total_points: number;
  type: string;
  tier: string;
  last_purchase: string;
}

export default function LoyaltyAndReferralHistoryComponent() {
  const [breakdowns, setBreakdowns] = useState<BreakdownRow[]>([
    {
      id: 1,
      customer_name: 'Jennifer Oliver',
      rank: 'Silver',
      total_points: 250,
      type: 'Referral',
      tier: 'Level 02',
      last_purchase: '03-11-2025 17:00:00',
    },
    {
      id: 2,
      customer_name: 'Jennifer Oliver',
      rank: 'Silver',
      total_points: 250,
      type: 'Loyalty',
      tier: 'Level 02',
      last_purchase: '03-11-2025 17:00:00',
    },
    {
      id: 3,
      customer_name: 'Jennifer Oliver',
      rank: 'Silver',
      total_points: 250,
      type: 'Referral',
      tier: 'Level 02',
      last_purchase: '03-11-2025 17:00:00',
    },
    {
      id: 4,
      customer_name: 'Jennifer Oliver',
      rank: 'Silver',
      total_points: 250,
      type: 'Loyalty',
      tier: 'Level 02',
      last_purchase: '03-11-2025 17:00:00',
    },
    {
      id: 5,
      customer_name: 'Jennifer Oliver',
      rank: 'Silver',
      total_points: 250,
      type: 'Referral',
      tier: 'Level 02',
      last_purchase: '03-11-2025 17:00:00',
    },
  ]);




  return (
    <div className="m-3 p-6 border border-border rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Referral and Loyalty History
          </h2>
          <p className="text-muted-foreground text-sm">
            Top 5 customers by earned points or total spending.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-[#F4F4F5]">
              <th
                className="text-[#71717A] text-left px-6 py-4  text-foreground  font-inter font-medium text-sm leading-5 tracking-normal
"
              >
                Customer Name
              </th>
              <th
                className="text-[#71717A] text-left px-6 py-4  text-foreground  font-inter font-medium text-sm leading-5 tracking-normal
"
              >
                Rank
              </th>
              <th
                className="text-[#71717A] text-left px-6 py-4  text-foreground  font-inter font-medium text-sm leading-5 tracking-normal
"
              >
                Total Points
              </th>
              <th
                className="text-[#71717A] text-left px-6 py-4  text-foreground  font-inter font-medium text-sm leading-5 tracking-normal
"
              >
                Type
              </th>

              <th
                className="text-[#71717A] text-left px-6 py-4  text-foreground  font-inter font-medium text-sm leading-5 tracking-normal
"
              >
                Tier
              </th>
              <th
                className="text-[#71717A] text-left px-6 py-4  text-foreground  font-inter font-medium text-sm leading-5 tracking-normal
"
              >
                Last Purchase
              </th>

              <th className="text-right px-6 py-4 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {breakdowns.map((row, index) => (
              <tr
                key={row.id}
                className={
                  index !== breakdowns.length - 1
                    ? 'border-b border-border'
                    : ''
                }
              >
                <td className="px-6 py-4 text-foreground text-sm">
                  {row.customer_name}
                </td>
                <td className="px-6 py-4 text-foreground text-sm font-medium">
                  {row.rank}
                </td>
                <td className="px-6 py-4 text-foreground text-sm font-medium">
                  {row.total_points}
                </td>
                <td className="px-6 py-4 text-foreground text-sm font-medium">
                  {row.type}
                </td>
                <td className="px-6 py-4 text-foreground text-sm font-medium">
                  {row.tier}
                </td>
                <td className="px-6 py-4 text-foreground text-sm font-medium">
                  {row.last_purchase}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
