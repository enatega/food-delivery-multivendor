import * as Yup from 'yup';

export const CategorySchema = Yup.object().shape({
  _id: Yup.string().nullable(),
  title: Yup.string()
    .max(50)
    .trim()
    .matches(/\S/, 'Name cannot be only spaces')
    .required('Required'),
});
