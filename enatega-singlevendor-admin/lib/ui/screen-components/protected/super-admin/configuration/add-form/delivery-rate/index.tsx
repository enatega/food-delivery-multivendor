'use client';
// Core
import { Form, Formik } from 'formik';

// Components
import ConfigCard from '../../view/card';

// Toast
import useToast from '@/lib/hooks/useToast';

// Hooks
import { useConfiguration } from '@/lib/hooks/useConfiguration';

// Interfaces and Types
import { IDeliveryRateForm } from '@/lib/utils/interfaces/configurations.interface';

// Utils and Constants
import { DeliverytRateValidationSchema } from '@/lib/utils/schema';

// GraphQL
import {
  GET_CONFIGURATION,
  SAVE_DELIVERY_RATE_CONFIGURATION,
} from '@/lib/api/graphql';
import { useMutation } from '@apollo/client';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';

const DeliveryRateAddForm = () => {
  // Hooks
  const { DELIVERY_RATE, COST_TYPE } = useConfiguration();
  const { showToast } = useToast();

  const initialValues: IDeliveryRateForm = {
    deliveryRate: DELIVERY_RATE ?? null,
    costType: COST_TYPE,
  };

  const [mutate, { loading: mutationLoading }] = useMutation(
    SAVE_DELIVERY_RATE_CONFIGURATION,
    {
      refetchQueries: [{ query: GET_CONFIGURATION }],
    }
  );

  const handleSubmit = (values: IDeliveryRateForm) => {
    mutate({
      variables: {
        configurationInput: {
          deliveryRate: values.deliveryRate,
          costType: values.costType,
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'Delivery Rate Configurations Updated',
          duration: 3000,
        });
      },
      onError: (error) => {
        let message = '';
        try {
          message = error.graphQLErrors[0]?.message;
        } catch (err) {
          message = 'ActionFailedTryAgain';
        }
        showToast({
          type: 'error',
          title: 'Error!',
          message,
          duration: 3000,
        });
      },
    });
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={DeliverytRateValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleSubmit, setFieldValue }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <ConfigCard
                cardTitle={'Delivery Rate'}
                buttonLoading={mutationLoading}
              >
                <div>
                  <CustomNumberField
                    min={0}
                    placeholder="Delivery Rate"
                    name="deliveryRate"
                    showLabel={true}
                    value={values.deliveryRate}
                    useGrouping={false}
                    onChange={setFieldValue}
                    style={{
                      borderColor:
                        errors.deliveryRate && touched.deliveryRate
                          ? 'red'
                          : '',
                    }}
                  />
                </div>
              </ConfigCard>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default DeliveryRateAddForm;
