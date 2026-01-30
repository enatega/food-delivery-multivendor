'use client';

import {
  faAdd,
  faEdit,
  faEllipsisVertical,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import LevelForm from './forms/level.form';
import { useLoyaltyContext } from '@/lib/hooks/useLoyalty';
import { useConfiguration } from '@/lib/hooks/useConfiguration';
import {
  FetchLoyaltyLevelsByUserTypeDocument,
  useDeleteLoyaltyLevelMutation,
  useFetchLoyaltyLevelsByUserTypeQuery,
} from '@/lib/graphql-generated';
import { toTextCase } from '@/lib/utils/methods';
import DashboardStatsCardSkeleton from '@/lib/ui/useable-components/custom-skeletons/dasboard.stats.card.skeleton';
import useToast from '@/lib/hooks/useToast';
import { ProgressSpinner } from 'primereact/progressspinner';
import NoData from '@/lib/ui/useable-components/no-data';

interface LevelCardProps {
  name: string;
  point: number;
  isCustomer: boolean;
  loading?: boolean;
  onMenuClick: () => void;
}

function LevelCard({
  name,
  point,
  loading,
  isCustomer,
  onMenuClick,
}: LevelCardProps) {
  const { CURRENCY_SYMBOL } = useConfiguration();

  return (
    <div className="bg-[#F9FAFB] dark:bg-dark-900 border border-[#E4E4E7] dark:border-dark-600 rounded-2xl p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span className="inline-block bg-[#F0FFEA] dark:bg-dark-600 border border-[#5AC12F] dark:border-primary-dark px-3 py-1 rounded-full text-sm font-medium text-foreground dark:text-white">
          {name}
        </span>
        {loading ? (
          <ProgressSpinner
            className="m-0 h-6 w-6 items-center self-center p-0"
            strokeWidth="5"
            style={{ fill: 'white', accentColor: 'white' }}
            color="white"
          />
        ) : (
          <button
            onClick={onMenuClick}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>
        )}
      </div>

      <div className="text-4xl text-foreground dark:text-white font-inter font-semibold text-[30px] leading-[36px] tracking-normal">
        {point} {isCustomer ? 'pts' : CURRENCY_SYMBOL}
      </div>
    </div>
  );
}

export default function LoyaltyAndReferralCustomerReferralSystemComponent() {
  // Hooks
  const {
    loyaltyType,
    levelFormVisible,
    setLevelFormVisible,
    setLoyaltyData,
  } = useLoyaltyContext();
  const { showToast } = useToast();

  // States
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // API
  const { data, loading } = useFetchLoyaltyLevelsByUserTypeQuery({
    variables: {
      userType:
        loyaltyType === 'Customer Loyalty Program' ? 'customer' : 'driver',
    },
  });
  const [deleteLoyaltyLevel, { loading: deletingLevel }] =
    useDeleteLoyaltyLevelMutation();

  // Handlers
  const handleDeleteLevel = async (id: string) => {
    try {
      setOpenMenu(null);
      await deleteLoyaltyLevel({
        variables: {
          id,
        },
        refetchQueries: [
          {
            query: FetchLoyaltyLevelsByUserTypeDocument,
            variables: {
              userType:
                loyaltyType === 'Customer Loyalty Program'
                  ? 'customer'
                  : 'driver',
            },
          },
        ],
      });

      showToast({
        type: 'success',
        title: 'Delete Level',
        message: 'Level has been deleted successfully.',
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Failed.',
        message: (err as Error)?.message || 'Please try again later',
      });
    }
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
    <>
      <div className="m-3 p-6 pb-2 bg-background border border-border rounded-2xl">
        <div className="">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="md:text-2xl text-foreground mb-2 font-inter font-semibold text-2xl leading-8 tracking-normal">
                {loyaltyType === "Customer Loyalty Program" ? "Customer" : "Driver"} Referral System
              </h1>
              <p className="text-[#4F4F4F] font-inter font-normal text-lg leading-7 tracking-normal">
                Set rewards thresholds levels for {loyaltyType === "Customer Loyalty Program" ? " customer" : " driver"} referrals.
              </p>
            </div>
            <button
              className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 transition-colors"
              onClick={() => {
                setLevelFormVisible(true);
              }}
            >
              <FontAwesomeIcon icon={faAdd} /> Create Level
            </button>
          </div>

          {/* Levels Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            ref={menuRef}
          >
            {loading ? (
              <>
                {new Array(3).fill(0).map((_, index) => (
                  <DashboardStatsCardSkeleton key={index} />
                ))}
              </>
            ) : !data?.fetchLoyaltyLevelsByUserType ||
              data?.fetchLoyaltyLevelsByUserType?.length === 0 ? (
              <NoData />
            ) : (
              data?.fetchLoyaltyLevelsByUserType?.map((level) => {
                if (!level) return;

                return (
                  <div key={level?._id} className="relative">
                    <LevelCard
                      name={toTextCase(level?.name || '', 'title')}
                      point={
                        (loyaltyType === 'Customer Loyalty Program'
                          ? level?.points
                          : level?.amount) || 0
                      }
                      isCustomer={loyaltyType === 'Customer Loyalty Program'}
                      loading={deletingLevel}
                      onMenuClick={() =>
                        setOpenMenu(openMenu === level?._id ? null : level?._id)
                      }
                    />

                    {/* Dropdown Menu */}
                    {openMenu === level?._id && (
                      <div className="absolute top-14 right-2 bg-background dark:bg-dark-900 border border-border dark:border-dark-600 rounded-lg shadow-lg z-10 w-40">
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-muted dark:hover:bg-dark-600 flex items-center gap-2 text-sm text-foreground dark:text-white"
                          onClick={() => {
                              setOpenMenu(null)
                            setLoyaltyData({ levelId: level?._id });
                            setLevelFormVisible(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLevel(level?._id)}
                          disabled={deletingLevel}
                          className="w-full text-left px-4 py-2 hover:bg-muted dark:hover:bg-dark-600 flex items-center gap-2 text-sm text-destructive"
                        >
                          <FontAwesomeIcon icon={faTrash} color="#EF4444" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {levelFormVisible && <LevelForm />}
    </>
  );
}
