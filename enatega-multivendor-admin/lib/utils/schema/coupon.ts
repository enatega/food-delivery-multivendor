import * as Yup from 'yup';

export const CouponFormSchema = Yup.object().shape({
  title: Yup.string()
    .max(35, 'You have reached the maximum limit!')
    .trim()
    .matches(/\S/, 'Name cannot be only spaces')
    .required('Title is a required field'),
  discount: Yup.number()
    .required('Discount is a required field')
    .min(0, 'The minimum starting value is zero')
    .max(100, 'You cannot exceed from 100 as this is a %age field'),
  enabled: Yup.boolean().required('Required').required('Please choose one'),
});
