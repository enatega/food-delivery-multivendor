import * as Yup from 'yup';
import { IDropdownSelectItem } from '../interfaces';

export const StaffSchema = Yup.object().shape({
  name: Yup.string()
    .max(35)
    .trim()
    .matches(/\S/, 'Name cannot be only spaces')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
   password: Yup.string()
   .required('Required')
   .min(6, 'At least 6 characters')
   .matches(/[a-z]/, 'At least one lowercase letter (a-z)')
   .matches(/[A-Z]/, 'At least one uppercase letter (A-Z)')
   .matches(/[0-9]/, 'At least one number (0-9)')
   .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'At least one special character'),
  confirmPassword: Yup.string()
    .nullable()
    .oneOf([Yup.ref('password'), null], 'Password must match')
    .required('Required'),
  phone: Yup.string().required('Required').min(5,"Minimum 5 Numbers are Required"),
  permissions: Yup.array()
    .of(Yup.mixed<IDropdownSelectItem>())
    .min(1, 'Permissions field must have at least 1 items')
    .required('Required'),
});
