import * as Yup from 'yup';

export const SubCategoriesSchema = Yup.array(
  Yup.object().shape({
    title: Yup.string().min(0).max(300).required('Title is a required field'),
  })
);
