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
  inventory: Yup.number().typeError('Must be a number').nullable().optional(),
  uom: Yup.string().typeError('Must be a string').nullable().optional(),
  minQuantity: Yup.number().typeError('Must be a number').nullable().optional(),
  maxQuantity: Yup.number()
    .typeError('Must be a number')
    .nullable()
    .optional()
    .test(
      'is-greater-than-min',
      'Max Qty must be greater than Min Qty',
      function (value) {
        const { minQuantity } = this.parent;
        if (value && minQuantity) {
          return value >= minQuantity;
        }
        return true;
      }
    ),
});
