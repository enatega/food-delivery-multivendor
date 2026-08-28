import * as yup from 'yup';

export const useUserCreditsSchema = () => {
  const errorMessages = {
    userRequired: 'User is required',
    amountRequired: 'Amount must be greater than 0',
    amountTooLarge: 'Amount is too large',
  };

  return yup.object().shape({
    userId: yup
      .string()
      .nullable()
      .required(errorMessages.userRequired),
    amount: yup
      .number()
      .typeError(errorMessages.amountRequired)
      .required(errorMessages.amountRequired)
      .positive(errorMessages.amountRequired)
      .max(999999999, errorMessages.amountTooLarge),
    orderId: yup.string().required('Order ID is required'),
  });
};
