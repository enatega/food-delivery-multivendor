'use client';

// Components
import ReferralWalletHeader from '@/lib/ui/screen-components/protected/super-admin/referral-wallet/view/header';
import ReferralWalletMain from '@/lib/ui/screen-components/protected/super-admin/referral-wallet/view/main';
import AdjustPointsForm from '@/lib/ui/screen-components/protected/super-admin/referral-wallet/forms/adjust-points';
import LoyaltyLevelsForm from '@/lib/ui/screen-components/protected/super-admin/referral-wallet/forms/loyalty-levels';
import ReferralLevelsForm from '@/lib/ui/screen-components/protected/super-admin/referral-wallet/forms/referral-levels';

// Hooks
import { useState } from 'react';

// Interfaces
import { IEditState } from '@/lib/utils/interfaces';

export interface IUserPointsDistribution {
  _id: string;
  __typename?: string;
  userName: string;
  avatar?: string;
  totalReferrals: number;
  pointsEarned: number;
  pointsRedeemed: number;
  currentBalance: number;
  status: 'Active' | 'Inactive';
  joinedAt: string;
}

export interface ILoyaltyLevel {
  _id: string;
  name: string;
  pointsRequired: number;
  benefits: string;
}

export interface IReferralLevel {
  _id: string;
  name: string;
  referralsRequired: number;
  pointsPerReferral: number;
}

export default function ReferralWalletScreen() {
  // States
  const [adjustPointsVisible, setAdjustPointsVisible] = useState(false);
  const [loyaltyLevelsVisible, setLoyaltyLevelsVisible] = useState(false);
  const [referralLevelsVisible, setReferralLevelsVisible] = useState(false);

  const [isEditingLoyalty, setIsEditingLoyalty] = useState<
    IEditState<ILoyaltyLevel>
  >({
    bool: false,
    data: {
      _id: '',
      name: '',
      pointsRequired: 0,
      benefits: '',
    },
  });

  const [isEditingReferral, setIsEditingReferral] = useState<
    IEditState<IReferralLevel>
  >({
    bool: false,
    data: {
      _id: '',
      name: '',
      referralsRequired: 0,
      pointsPerReferral: 0,
    },
  });

  // Handlers
  const handleAdjustPointsClick = () => {
    setAdjustPointsVisible(true);
  };

  const handleLoyaltyLevelsClick = () => {
    setLoyaltyLevelsVisible(true);
    setIsEditingLoyalty({
      bool: false,
      data: {
        _id: '',
        name: '',
        pointsRequired: 0,
        benefits: '',
      },
    });
  };

  const handleReferralLevelsClick = () => {
    setReferralLevelsVisible(true);
    setIsEditingReferral({
      bool: false,
      data: {
        _id: '',
        name: '',
        referralsRequired: 0,
        pointsPerReferral: 0,
      },
    });
  };

  return (
    <div className="screen-container py-4 px-4 !m-0">
      <ReferralWalletHeader handleAdjustPointsClick={handleAdjustPointsClick} />
      <ReferralWalletMain
        handleLoyaltyLevelsClick={handleLoyaltyLevelsClick}
        handleReferralLevelsClick={handleReferralLevelsClick}
        isEditingLoyalty={isEditingLoyalty}
        setIsEditingLoyalty={setIsEditingLoyalty}
        isEditingReferral={isEditingReferral}
        setIsEditingReferral={setIsEditingReferral}
        setLoyaltyLevelsVisible={setLoyaltyLevelsVisible}
        setReferralLevelsVisible={setReferralLevelsVisible}
      />
      <AdjustPointsForm
        visible={adjustPointsVisible}
        setVisible={setAdjustPointsVisible}
      />
      <LoyaltyLevelsForm
        visible={loyaltyLevelsVisible}
        setVisible={setLoyaltyLevelsVisible}
        isEditing={isEditingLoyalty}
        setIsEditing={setIsEditingLoyalty}
      />
      <ReferralLevelsForm
        visible={referralLevelsVisible}
        setVisible={setReferralLevelsVisible}
        isEditing={isEditingReferral}
        setIsEditing={setIsEditingReferral}
      />
    </div>
  );
}
