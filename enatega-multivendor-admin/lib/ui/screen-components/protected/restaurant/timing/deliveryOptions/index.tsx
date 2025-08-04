"use client"
import { UPDATE_DELIVERY_OPTIONS } from '@/lib/api/graphql/mutations/deliveryOptions';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import useToast from '@/lib/hooks/useToast';
import CustomButton from '@/lib/ui/useable-components/button';
import Toggle from '@/lib/ui/useable-components/toggle';
import { useMutation } from '@apollo/client';
import { Formik, Form, Field } from 'formik';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';
import * as Yup from 'yup';


const ToggleSchema = Yup.object().shape({
    pickup: Yup.boolean().required(),
    delivery: Yup.boolean().required(),
});

interface IDeliveryOptions {
    pickup: boolean
    delivery: boolean
}

const DeliveryOptions = ({ data, loading, refetch }: any) => {
    const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
    const restaurantId = restaurantLayoutContextData?.restaurantId || '';

    const t = useTranslations();
    const { showToast } = useToast();

    const initialValues: IDeliveryOptions = {
        pickup: data?.restaurant?.deliveryOptions?.pickup,
        delivery: data?.restaurant?.deliveryOptions?.delivery,
    };

    const [mutate, { loading: mutationLoading }] = useMutation(UPDATE_DELIVERY_OPTIONS);

    const handleSubmit = (values: IDeliveryOptions) => {
        if(JSON.stringify(values) === JSON.stringify(initialValues)) {
            return showToast({
                type: 'info',
                title: 'No Changes',
                message: 'You have not made any changes to save.',
                duration: 3000
            })
        }
        if (!values.pickup && !values.delivery) {
            return showToast({
                type: 'warn',
                title: 'Warning',
                message: 'At least one service option (Pickup or Delivery) must be enabled.',
                duration: 3000
            })
        }

        mutate({
            variables: {
                restId: restaurantId,
                ...values
            },
            onCompleted: () => {
                refetch({ id: restaurantId });
                showToast({
                    type: 'success',
                    title: t('Success'),
                    message: t('Service options updated.'),
                    duration: 3000,
                });
            },
            onError: (error) => {
                let message = '';
                try {
                    message = error.graphQLErrors[0]?.message;
                } catch (err) {
                    message = t('ActionFailedTryAgain');
                }
                showToast({
                    type: 'error',
                    title: t('Error'),
                    message,
                    duration: 3000,
                });
            },
        });
    };

    return (
        <div className="mt-7 h-fit rounded border px-8 py-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Service Options</h2>
            {
                loading
                    ?
                    <div className='flex items-center justify-center p-10'>
                        Loading...
                    </div>
                    :
                    data?.restaurant
                        ?
                        <Formik
                            initialValues={initialValues}
                            validationSchema={ToggleSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({ values, setFieldValue, isSubmitting }) => (
                                <Form className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between rounded-md border p-3">
                                        <label htmlFor="pickupOnly" className="text-sm font-medium text-gray-700">
                                            Pickup Only
                                        </label>
                                        <Toggle
                                            checked={values.pickup}
                                            onClick={() => setFieldValue('pickup', !values.pickup)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between rounded-md border p-3">
                                        <label htmlFor="deliveryOnly" className="text-sm font-medium text-gray-700">
                                            Delivery Only
                                        </label>
                                        <Toggle
                                            checked={values.delivery}
                                            onClick={() => setFieldValue('delivery', !values.delivery)}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={mutationLoading}
                                        className="h-11 w-full rounded-md bg-black text-white hover:bg-gray-900 text-sm font-semibold"
                                    >
                                        {
                                            mutationLoading
                                            ?
                                                'Processing...'
                                            :
                                                'Save'
                                        }
                                    </button>
                                </Form>
                            )}
                        </Formik>
                        :
                        <div className='flex items-center justify-center p-10 text-red-500'>
                            Something went wrong.
                        </div>
            }
        </div>
    );
};

export default DeliveryOptions;
