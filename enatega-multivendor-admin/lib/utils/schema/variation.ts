import * as Yup from 'yup';
import { MAX_PRICE, MIN_PRICE } from '../constants';
import { IDropdownSelectItem } from '../interfaces';

export const VariationSchema = Yup.object({
  variations: Yup.array()
    .of(
      Yup.object().shape({
        _id: Yup.string().nullable(),
        title: Yup.string()
          .max(50)
          .trim()
          .matches(/\S/, 'Name cannot be only spaces')
          .required('Required'),
        price: Yup.number()
          .min(MIN_PRICE, 'Minimum value must be greater than 0')
          .max(MAX_PRICE)
          .required('Required'),
        discounted: Yup.number().min(0).required('Required'),
        addons: Yup.array()
          .of(Yup.mixed<IDropdownSelectItem>())
          .required('Required')
          .test(
            'at-least-one-addon',
            'Addons field must have at least 1 items',
            (value) => value && value.length > 0
          ),
        isOutOfStock: Yup.boolean(),
      })
    )
    .min(1)
    .required('Required'),
});
