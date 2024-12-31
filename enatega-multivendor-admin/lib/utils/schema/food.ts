import * as Yup from 'yup';
import { IDropdownSelectItem } from '../interfaces';

export const FoodSchema = Yup.object().shape({
  title: Yup.string()
    .max(35)
    .trim()
    .matches(/\S/, 'Name cannot be only spaces')
    .required('Required'),
  description: Yup.string()
    .max(200)
    .trim()
    .matches(/\S/, 'Name cannot be only spaces')
    .nullable(),
  category: Yup.mixed<IDropdownSelectItem>().required('Required'),
  subCategory: Yup.mixed<IDropdownSelectItem>().nullable().optional(),
  image: Yup.string().url('Invalid image URL').required('Required'),
});
