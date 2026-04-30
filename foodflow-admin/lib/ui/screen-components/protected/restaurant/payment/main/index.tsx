// Hooks
import { useState, useContext, useEffect } from 'react';
import { useConfiguration } from '@/lib/hooks/useConfiguration';
import { useTranslations } from 'next-intl';

// Components
import PaymentCard from '@/lib/ui/useable-components/PaymentCard';
import PaymentCardSkeleton from '@/lib/ui/useable-components/custom-skeletons/payment.card.skeleton';

// Contexts
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { ToastContext } from '@/lib/context/global/toast.context';

// Icons
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';

// Interfaces
import { IPaymentMethod } from '@/lib/utils/interfaces/payment.card.interface';
import { ProfileContext } from '@/lib/context/restaurant/profile.context';

export default function PaymentMain() {

  // Hooks
  const { SERVER_URL } = useConfiguration();
  const t = useTranslations()

  // Contexts
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const {restaurantProfileResponse} = useContext(ProfileContext)
  const { showToast } = useContext(ToastContext);
  const { restaurantId } = restaurantLayoutContextData;

  const [initialLoading, setInitialLoading] = useState(true);
  const [submittingMethod, setSubmittingMethod] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);

  const handleStripeSubmit = async () => {
    setSubmittingMethod('stripe');
    try {
      const response = await fetch(`${SERVER_URL}stripe/account`, {
        method: 'POST',
        body: JSON.stringify({ restaurantId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.log(error)
      showToast({
        type: 'error',
        title: t('Stripe Payment'),
        message: t('Error connecting to Stripe'),
      });
    } finally {
      setSubmittingMethod(null);
    }
  };


  const fetchPaymentMethods = () => {
    // Simulating a fetch call to load payment methods
    setTimeout(() => {
      setPaymentMethods([
        {
          id: 'stripe',
          name: 'Stripe',
          description: 'Connect with Stripe for payments',
          icon: faCreditCard,
          type: 'stripe',
          isDetailsSubmitted: restaurantProfileResponse.data?.restaurant?.stripeDetailsSubmitted ?? false,
          onClick: handleStripeSubmit,
        },
      ]);
      setInitialLoading(false);
    }, 2000);
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [restaurantProfileResponse.data?.restaurant?.stripeDetailsSubmitted]);

  const renderPaymentMethods = () => {
    if (initialLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <PaymentCardSkeleton key={i} />
      ));
    }

    return paymentMethods.map((method) => (
      <PaymentCard
        key={method.id}
        name={method.name}
        description={method.description}
        onClick={method.onClick}
        loading={submittingMethod === method.id}
        isDetailsSubmitted={method?.isDetailsSubmitted ?? false}
        icon={method.icon}
        type={method.type}
      />
    ));
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-dark-950">
      <div className="w-full rounded-lg border border-gray-200 dark:border-dark-600 p-8 md:p-16">
        <div
          className={`grid gap-6 pb-16 ${
            paymentMethods.length === 1
              ? 'grid-cols-1 place-items-center'
              : 'grid-cols-1 sm:grid-cols-2'
          }`}
        >
          {renderPaymentMethods()}
        </div>
      </div>
    </div>
  );
}
