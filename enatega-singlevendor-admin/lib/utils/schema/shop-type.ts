import * as Yup from 'yup';

export const ShopTypeFormSchema = Yup.object().shape({
  name: Yup.string()
    .max(35, 'You have reached the maximum limit!')
    .trim()
    .matches(/\S/, 'Name cannot be only spaces')
    .required('Name is a required field'),
  image: Yup.string(),
  isActive: Yup.bool().nullable()
});

