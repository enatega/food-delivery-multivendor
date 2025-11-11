'use client';

import {
  faAdd,
  faEdit,
  faEllipsisVertical,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';

interface LevelCardProps {
  name: string;
  point: number;
  onMenuClick: () => void;
}

function LevelCard({ name, point, onMenuClick }: LevelCardProps) {
  return (
    <div className="bg-[#F9FAFB] border border-[#E4E4E7] rounded-2xl p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span className="inline-block bg-[#F0FFEA] border border-[#5AC12F] px-3 py-1 rounded-full text-sm font-medium">
          {name}
        </span>
        <button
          onClick={onMenuClick}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </button>
      </div>

      <div className="text-4xl text-foreground font-inter font-semibold text-[30px] leading-[36px] tracking-normal">
        {point}
      </div>
    </div>
  );
}

export default function LoyaltyAndReferralTierSystemComponent() {
  const [levels, setLevels] = useState([
    { id: 1, name: 'Silver', point: 5 },
    { id: 2, name: 'Bronze', point: 10 },
    { id: 3, name: 'Gold', point: 15 },
    { id: 4, name: 'Platinum', point: 30 },
  ]);

  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handlers
  const handleDeleteLevel = (id: number) => {
    setLevels(levels.filter((level) => level.id !== id));
    setOpenMenu(null);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="m-3 p-6 pb-2 bg-background border border-border rounded-2xl">
      <div className="">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="md:text-2xl text-foreground mb-2 font-inter font-semibold text-2xl leading-8 tracking-normal">
              Customer Tier System
            </h1>
            <p className="text-[#4F4F4F] font-inter font-normal text-lg leading-7 tracking-normal">
              Monitor customer tier system
            </p>
          </div>
          <button className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 transition-colors">
            <FontAwesomeIcon icon={faAdd} /> Create Tier
          </button>
        </div>

        {/* Levels Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          ref={menuRef}
        >
          {levels.map((level) => (
            <div key={level.id} className="relative">
              <LevelCard
                name={level.name}
                point={level.point}
                onMenuClick={() =>
                  setOpenMenu(openMenu === level.id ? null : level.id)
                }
              />

              {/* Dropdown Menu */}
              {openMenu === level.id && (
                <div className="absolute top-14 right-2 bg-background border border-border rounded-lg shadow-lg z-10 w-40">
                  <button className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2 text-sm">
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLevel(level.id)}
                    className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2 text-sm text-destructive"
                  >
                    <FontAwesomeIcon icon={faTrash} color="#EF4444" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
