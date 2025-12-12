// Core
import React, { useEffect, useState } from 'react';

// Hooks
import useToast from '@/lib/hooks/useToast';
import { useTranslations } from 'next-intl';

// GraphQL
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_SUBSCRIPTION_PLANS } from '@/lib/api/graphql/queries/subscription';
import { DEACTIVATE_SUBSCRIPTION_PLAN } from '@/lib/api/graphql/mutations/subscription';

// Components
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import { Menu } from 'primereact/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { ProgressSpinner } from 'primereact/progressspinner';
import ErrorState from '@/lib/ui/useable-components/error-state';

// Interfaces
import { IEditState } from '@/lib/utils/interfaces';
import { ISubscriptionPlan } from '@/lib/ui/screens/super-admin/subscription';
import { SubscriptionCard } from './subscription-card';

interface ISubscriptionMainProps {
  setVisible: (visible: boolean) => void;
  visible: boolean;
  isEditing: IEditState<ISubscriptionPlan>;
  setIsEditing: (editing: IEditState<ISubscriptionPlan>) => void;
}

export default function SubscriptionMain({
  setVisible,
  isEditing,
  setIsEditing,
}: ISubscriptionMainProps) {
  // Hooks
  const { showToast } = useToast();
  const t = useTranslations();

  // States
  const [deactivateId, setDeactivateId] = useState('');

  // Query
  const {
    data,
    loading: queryLoading,
    error,
    refetch,
  } = useQuery(GET_ALL_SUBSCRIPTION_PLANS, {
    fetchPolicy: 'network-only',
  });

  // Mutation
  const [deactivatePrice, { loading: mutationLoading }] = useMutation(
    DEACTIVATE_SUBSCRIPTION_PLAN,
    {
      onCompleted: (result) => {
        showToast({
          type: 'success',
          title: t('Success'),
          message:
            result?.deactivatePrice?.message ||
            t('Subscription plan deactivated successfully'),
          duration: 3000,
        });
        setDeactivateId('');
        refetch();
      },
      onError: (err) => {
        const message =
          err.graphQLErrors?.[0]?.message ||
          err.message ||
          t('Something went wrong');
        showToast({
          type: 'error',
          title: t('Error'),
          message: message,
          duration: 3000,
        });
      },
    }
  );

  // Derived state
  const subscriptionPlans: ISubscriptionPlan[] =
    data?.getAllSubscriptionPlans?.plans || [];

  // Find baseline monthly price (1 month plan)
  const monthlyPlan = subscriptionPlans.find(
    (p) => p.interval === 'month' && p.intervalCount === 1
  );
  const baseMonthlyPrice = monthlyPlan ? monthlyPlan.amount : null;

  const handleDeactivate = async () => {
    if (!deactivateId) return;
    try {
      await deactivatePrice({
        variables: { input: { priceId: deactivateId } },
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (queryLoading && !data) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <ProgressSpinner strokeWidth="3" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title={t('Error')}
        message={
          error?.graphQLErrors?.[0]?.message ||
          error?.message ||
          t('Something went wrong')
        }
        onRetry={refetch}
        retryLabel={t('Retry')}
        loading={queryLoading}
      />
    );
  }

  return (
    <div className="p-6">
      {subscriptionPlans.length === 0 ? (
        <div className="flex h-[400px] w-full flex-col items-center justify-center gap-4 text-center">
          <p className="text-gray-500">{t('No subscription plans found')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <SubscriptionCard
              key={plan.id}
              plan={plan}
              baseMonthlyPrice={baseMonthlyPrice}
              onDeactivate={(id) => setDeactivateId(id)}
            />
          ))}
        </div>
      )}

      {/* Deactivate Dialog */}
      <CustomDialog
        loading={mutationLoading}
        visible={!!deactivateId}
        onHide={() => setDeactivateId('')}
        onConfirm={handleDeactivate}
        message={t(
          'Are you sure you want to deactivate this subscription plan?'
        )}
      />
    </div>
  );
}
