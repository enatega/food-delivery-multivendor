// WithdrawRequestForm.tsx
import { useContext } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Form, Formik } from 'formik';
import { ToastContext } from '@/lib/context/global/toast.context';
import { IWithDrawRequest } from '@/lib/utils/interfaces';
import { useMutation } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  UPDATE_WITHDRAW_REQUEST,
  GET_ALL_WITHDRAW_REQUESTS,
} from '@/lib/api/graphql';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface IWithdrawRequestFormProps {
  setVisible: (value: boolean) => void;
  visible: boolean;
  selectedRequest?: IWithDrawRequest;
}

export default function WithdrawRequestForm({
  setVisible,
  visible,
  selectedRequest,
}: IWithdrawRequestFormProps) {
  const { showToast } = useContext(ToastContext);

  const initialValues = {
    accountHolder:
      selectedRequest?.rider?.bussinessDetails?.accountName ||
      selectedRequest?.store?.bussinessDetails?.accountName ||
      '',
    iban:
      selectedRequest?.rider?.bussinessDetails?.accountNumber ||
      selectedRequest?.store?.bussinessDetails?.accountNumber ||
      '',
    currency: 'EUR',
  };

  const [updateWithdrawRequest] = useMutation(UPDATE_WITHDRAW_REQUEST, {
    refetchQueries: [{ query: GET_ALL_WITHDRAW_REQUESTS }],
    onCompleted: () => {
      showToast({
        title: 'Withdraw Request',
        type: 'success',
        message: 'Request has been updated successfully',
        duration: 2500,
      });
    },
    onError: (err) => {
      showToast({
        title: 'Error',
        type: 'error',
        message: err.cause?.message || 'Something went wrong',
        duration: 2500,
      });
    },
  });

  return (
    <Sidebar
      visible={visible}
      onHide={() => setVisible(false)}
      position="right"
      className="w-full max-w-md dark:text-white dark:bg-dark-950 border dark:border-dark-600"
      showCloseIcon={false} // Hide default close icon
    >
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-semibold">Bank Details</h2>
        <button
          onClick={() => setVisible(false)}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
        </button>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          await updateWithdrawRequest({
            variables: {
              id: selectedRequest?._id,
              status: 'TRANSFERRED',
            },
          });
          setSubmitting(false);
          setVisible(false);
        }}
      >
        {({ handleSubmit, values }) => (
          <Form onSubmit={handleSubmit} className="mt-6">
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name of the Account Holder
                </label>
                <input
                  type="text"
                  value={values.accountHolder}
                  disabled
                  className="w-full rounded border border-gray-300 px-3 py-2 text-gray-700"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  IBAN
                </label>
                <input
                  type="text"
                  value={values.iban}
                  disabled
                  className="w-full rounded border border-gray-300 px-3 py-2 text-gray-700"
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Sidebar>
  );
}
