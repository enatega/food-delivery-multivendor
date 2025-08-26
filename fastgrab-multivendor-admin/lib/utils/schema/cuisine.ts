import * as Yup from 'yup';

export const CuisineFormSchema = Yup.object().shape({
  name: Yup.string()
    .max(30, 'You have reached the maximum limit')
    .trim()
    .matches(/\S/, 'Name cannot be only spaces')
    .required('Name is a required'),
  description: Yup.string()
    .max(40, 'You have reached the maximum limit of 1500 characters!')
    .trim()
    .matches(/\S/, 'Name cannot be only spaces')
    .required('Description is required'),
  shopType: Yup.object({
    label: Yup.string().required('Required'),
    code: Yup.string().required('Required'),
  }).required('Please choose one'),
  image: Yup.string().url().required("Image is Required"),
});
