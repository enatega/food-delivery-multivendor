import * as Yup from 'yup';
export const NotificationSchema = Yup.object().shape({
  recipientType: Yup.string()
    .oneOf(['CUSTOMER', 'STORE', 'RIDER'])
    .required('Recipient type is required'),
  title: Yup.string()
    .max(25, 'You have reached the MAX limit of 25 characters')
    .trim()
    .matches(/\S/, 'Name cannot be only spaces')
    .required('Title is required'),
  body: Yup.string()
    .max(1500, 'You have reached the MAX limit of 1500 characters')
    .trim()
    .matches(/\S/, 'Name cannot be only spaces')
    .required('Description is Required'),
});
