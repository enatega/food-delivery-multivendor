import { useContext } from 'react';
import { Form, Formik } from 'formik';
import { Sidebar } from 'primereact/sidebar';
import { ProfileContext } from '@/lib/context/restaurant/profile.context';
import CustomButton from '@/lib/ui/useable-components/button';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import useToast from '@/lib/hooks/useToast';
import { useMutation } from '@apollo/client';
import { CREATE_WITHDRAW_REQUEST } from '@/lib/api/graphql';
import * as Yup from 'yup';

interface IWithdrawRequestFormProps {
  onHide: () => void;
  isAddWithdrawRequestVisible: boolean;
  position?: 'right' | 'left';
}

const WithdrawRequestSchema = Yup.object().shape({
  requestAmount: Yup.number()
    .required('Amount is required')
    .min(1, 'Amount must be greater than 0'),
});

export default function WithdrawRequestAddForm({
  onHide,
  isAddWithdrawRequestVisible,
  position = 'right',
}: IWithdrawRequestFormProps) {
  const { showToast } = useToast();
  const { restaurantProfileResponse } = useContext(ProfileContext);

  console.log(restaurantProfileResponse?.data);

  const currentWalletAmount =
    restaurantProfileResponse?.data?.restaurant?.currentWalletAmount || 0;

  const [createWithdrawRequest, { loading: mutationLoading }] = useMutation(
    CREATE_WITHDRAW_REQUEST,
    {
      onCompleted: () => {
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'Withdraw request has been created successfully.',
          duration: 3000,
        });
        onHide();
      },
      onError: (error) => {
        showToast({
          type: 'error',
          title: 'Error!',
          message: error.message || 'Failed to create withdraw request',
          duration: 3000,
        });
      },
      refetchQueries: ['WithdrawRequests'],
    }
  );

  const initialValues = {
    requestAmount: null as number | null,
  };

  const handleSubmit = async (values: { requestAmount: number | null }) => {
    if (!values.requestAmount) return;

    try {
      await createWithdrawRequest({
        variables: {
          requestAmount: parseFloat(values.requestAmount.toString()),
        },
      });
    } catch (error) {
      console.error('Error creating withdraw request:', error);
    }
  };

  return (
    <Sidebar
      visible={isAddWithdrawRequestVisible}
      position={position}
      onHide={onHide}
      className="w-full sm:w-[600px]"
    >
      <div className="flex h-full w-full items-center justify-start">
        <div className="h-full w-full">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex flex-col">
              <span className="text-lg">Withdraw Request</span>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={WithdrawRequestSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, setFieldValue }) => (
                <Form className="flex flex-col space-y-4">
                  <CustomNumberField
                    name="requestAmount"
                    placeholder="Enter amount"
                    value={values.requestAmount}
                    onChange={(name, value) => setFieldValue(name, value)}
                    showLabel
                    min={1}
                    mode="decimal"
                    minFractionDigits={2}
                    maxFractionDigits={2}
                    style={{
                      borderColor: errors.requestAmount ? 'red' : '',
                    }}
                  />
                  {errors.requestAmount && (
                    <div className="text-sm text-red-500">
                      {errors.requestAmount}
                    </div>
                  )}

                  <div className="text-sm text-gray-500">
                    Available Balance: ${currentWalletAmount?.toLocaleString()}
                  </div>

                  <CustomButton
                    className="ml-auto h-10 w-fit border-gray-300 bg-black px-8 text-white"
                    label="Submit Request"
                    type="submit"
                    loading={mutationLoading}
                  />
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
