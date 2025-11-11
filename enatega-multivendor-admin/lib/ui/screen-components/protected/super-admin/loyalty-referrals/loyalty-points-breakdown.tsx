'use client';

import {
  faAdd,
  faEdit,
  faEllipsisVertical,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useRef } from 'react';

interface BreakdownRow {
  id: number;
  spendingRange: string;
  percentage: number;
  rewardLevel: string;
}

export default function LoyaltyAndReferralBreakdownSectionComponent() {
  const [breakdowns, setBreakdowns] = useState<BreakdownRow[]>([
    {
      id: 1,
      spendingRange: '$100 - $199',
      percentage: 15,
      rewardLevel: 'Level 01',
    },
    {
      id: 2,
      spendingRange: '$200 - $200',
      percentage: 15,
      rewardLevel: 'Level 01',
    },
    {
      id: 3,
      spendingRange: '$300 - $399',
      percentage: 10,
      rewardLevel: 'Level 02',
    },
    {
      id: 4,
      spendingRange: '$400 - $499',
      percentage: 10,
      rewardLevel: 'Level 02',
    },
    {
      id: 5,
      spendingRange: '$500+ Dollars',
      percentage: 5,
      rewardLevel: 'Level 03',
    },
  ]);

  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = (id: number) => {
    setBreakdowns(breakdowns.filter((item) => item.id !== id));
    setOpenMenu(null);
  };

  return (
    <div className="m-3 p-6 border border-border rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Loyalty Points Breakdown
          </h2>
          <p className="text-muted-foreground text-sm">
            See how spending translates into reward points.
          </p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
          <FontAwesomeIcon icon={faAdd} /> Add Breakdown
        </button>
      </div>


        <div className="bg-card border border-border rounded-lg overflow-visible" ref={menuRef}>

        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-[#F4F4F5]">
              <th
                className="text-[#71717A] text-left px-6 py-4  text-foreground  font-inter font-medium text-sm leading-5 tracking-normal
"
              >
                Spending Range
              </th>
              <th
                className="text-[#71717A] text-left px-6 py-4  text-foreground  font-inter font-medium text-sm leading-5 tracking-normal
"
              >
                Percentage (%)
              </th>
              <th
                className="text-[#71717A] text-left px-6 py-4 text-foreground font-inter font-medium text-sm leading-5 tracking-normal
"
              >
                Reward Level
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
                  {row.spendingRange}
                </td>
                <td className="px-6 py-4 text-foreground text-sm font-medium">
                  {row.percentage}%
                </td>
                <td className="px-6 py-4 text-foreground text-sm">
                  {row.rewardLevel}
                </td>
                <td className="px-6 py-4 text-right relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === row.id ? null : row.id)
                    }
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </button>

                  {openMenu === row.id && (
                     <div className="absolute top-12 right-0 mt-1 w-40 bg-white border border-border rounded-lg shadow-lg z-50">
                      <button className="w-full text-left px-4 py-2 flex items-center gap-2 text-sm bg-white">
                        <FontAwesomeIcon icon={faEdit} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="w-full text-left px-4 py-2  flex items-center gap-2 bg-white text-sm text-destructive border-t border-border"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
