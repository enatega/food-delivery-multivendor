import * as Yup from 'yup';
import { IDropdownSelectItem } from '../interfaces';

export const StaffSchema = Yup.object().shape({
  name: Yup.string()
    .max(35)
    .trim()
    .matches(/\S/, 'Name cannot be only spaces')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
  confirmPassword: Yup.string()
    .nullable()
    .oneOf([Yup.ref('password'), null], 'Password must match')
    .required('Required'),
  phone: Yup.string().required('Required'),
  permissions: Yup.array()
    .of(Yup.mixed<IDropdownSelectItem>())
    .min(1, 'Permissions field must have at least 1 items')
    .required('Required'),
});
