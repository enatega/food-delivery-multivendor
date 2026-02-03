'use client';

import {
  useFetchLoyaltyConfiguraionQuery,
  useSetLoyaltyConfigurationMutation,
} from '@/lib/graphql-generated';
import { useConfiguration } from '@/lib/hooks/useConfiguration';
import { useLoyaltyContext } from '@/lib/hooks/useLoyalty';
import useToast from '@/lib/hooks/useToast';
import CustomLoader from '@/lib/ui/useable-components/custom-progress-indicator';
import HeaderText from '@/lib/ui/useable-components/header-text';
import CustomTab from '@/lib/ui/useable-components/vendor-custom-tab';
import { LoyaltyType } from '@/lib/utils/types/loyalty';
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

export default function LoyaltyAndReferralHeader() {
  // Hooks
  const { showToast } = useToast();
  const { loyaltyType, setLoyaltyType } = useLoyaltyContext();
  const { CURRENCY_SYMBOL } = useConfiguration();

  // API
  const [setLoyaltyConfiguration] =
    useSetLoyaltyConfigurationMutation();
  const { data, loading } = useFetchLoyaltyConfiguraionQuery();
  const loyaltyConfig = data?.fetchLoyaltyConfiguration;

  // States
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(loyaltyConfig?.pointsPerDollar || 0);

  // Handlers
  const handleSpanClick = () => setEditing(true);

  const handleInputBlur = async () => {
    try {
      setEditing(false);

      await setLoyaltyConfiguration({
        variables: {
          input: {
            pointsPerDollar: value,
          },
        },
      });
      showToast({
        type: 'success',
        title: 'Loyalty Configuration',
        message: 'Points Per Dollar has been set successfully.',
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Failed to set loyalty configuration',
        message: (err as Error).message || 'Something went wrong',
      });
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  return (
    <div className="p-3 space-y-6">
      {/* Header with Title and Tabs */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <HeaderText text="Loyalty and Referrals" />

          <div className="flex gap-2">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-dark-600 p-2 rounded">
              {loading && !loyaltyConfig ? (
                <CustomLoader />
              ) : (
                loyaltyConfig &&
                CURRENCY_SYMBOL && (
                  <>
                    {editing ? (
                      <input
                        type="number"
                        value={value}
                        autoFocus
                        onChange={(e) => setValue(Number(e.target.value))}
                        onBlur={handleInputBlur}
                        onKeyDown={handleInputKeyDown}
                        className="bg-white dark:bg-dark-900 text-foreground dark:text-white border border-gray-300 dark:border-dark-600 rounded px-2 py-1"
                        style={{ width: '60px' }}
                      />
                    ) : (
                      <span
                        onClick={handleSpanClick}
                        className="text-foreground dark:text-white cursor-pointer"
                      >
                        {loyaltyConfig?.pointsPerDollar} pts
                      </span>
                    )}
                    <div className="text-foreground dark:text-white">
                      <FontAwesomeIcon icon={faArrowRightArrowLeft} />
                    </div>
                    <div className="text-foreground dark:text-white">{CURRENCY_SYMBOL}1</div>
                  </>
                )
              )}
            </div>
            <CustomTab
              options={['Customer Loyalty Program', 'Driver Loyalty Program']}
              selectedTab={loyaltyType}
              setSelectedTab={(tab) => setLoyaltyType(tab as LoyaltyType)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
