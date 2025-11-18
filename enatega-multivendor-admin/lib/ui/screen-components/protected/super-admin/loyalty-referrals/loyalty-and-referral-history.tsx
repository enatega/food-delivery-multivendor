'use client';

import { useFetchReferralLoyaltyHistoryQuery } from '@/lib/graphql-generated';
import DataTableColumnSkeleton from '@/lib/ui/useable-components/custom-skeletons/datatable.column.skeleton';
import NoData from '@/lib/ui/useable-components/no-data';
import { useState } from 'react';

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
  // API
  const { data, loading } = useFetchReferralLoyaltyHistoryQuery();
  const logs = data?.fetchReferralLoyaltyHistory || [];

  const [breakdowns] = useState<BreakdownRow[]>([
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
            {loading ? (
              <>
                {new Array(5).fill(0).map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-foreground text-sm font-medium">
                      <DataTableColumnSkeleton key={index} />
                    </td>

                    <td className="px-6 py-4 text-foreground text-sm">
                      <DataTableColumnSkeleton key={index} />
                    </td>
                    <td className="px-6 py-4 text-foreground text-sm font-medium">
                      <DataTableColumnSkeleton key={index} />
                    </td>
                    <td className="px-6 py-4 text-foreground text-sm font-medium">
                      <DataTableColumnSkeleton key={index} />
                    </td>
                    <td className="px-6 py-4 text-foreground text-sm font-medium">
                      <DataTableColumnSkeleton key={index} />
                    </td>
                    <td className="px-6 py-4 text-foreground text-sm font-medium">
                      <DataTableColumnSkeleton key={index} />
                    </td>
                  </tr>
                ))}
              </>
            ) : !logs || logs?.length === 0 ? (
              <NoData />
            ) : (
              logs.map((row, index) => {
                if (!row) return;

                return (
                  <tr
                    key={row._id}
                    className={
                      index !== breakdowns.length - 1
                        ? 'border-b border-border'
                        : ''
                    }
                  >
                    <td className="px-6 py-4 text-foreground text-sm">
                      {row.user_name}
                    </td>
                    <td className="px-6 py-4 text-foreground text-sm font-medium">
                      {row.user_rank}
                    </td>
                    <td className="px-6 py-4 text-foreground text-sm font-medium">
                      {row.value}
                    </td>
                    <td className="px-6 py-4 text-foreground text-sm font-medium">
                      {row.type}
                    </td>
                    <td className="px-6 py-4 text-foreground text-sm font-medium">
                      {row.level}
                    </td>
                    <td className="px-6 py-4 text-foreground text-sm font-medium">
                      {new Date(parseInt(row.createdAt)).toLocaleString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
