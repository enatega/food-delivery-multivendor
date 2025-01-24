import * as Yup from 'yup';
import { PasswordErrors } from '../constants';
import { IDropdownSelectItem } from '../interfaces';

export const VendorSchema = Yup.object().shape({
  // name: Yup.string()
  //   .max(35)
  //   .trim()
  //   .matches(/\S/, 'Name cannot be only spaces')
  //   .required('Required'),

  // Why there are more than one name fields?, in some place its asking for only name and in some it is asking for both first and last names... (please choose one either 'name' or 'firstName & lastName')
  firstName: Yup.string()
    .max(35)
    .trim()
    .matches(/\S/, 'First name cannot be only spaces')
    .required('Required'),
  lastName: Yup.string()
    .max(35)
    .trim()
    .matches(/\S/, 'Last name cannot be only spaces')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
  .min(6, PasswordErrors[0])
  .max(20)
  .test('complexity', function (value: string | undefined) {
    const errors: string[] = [];

    if (!value) return this.createError({});

    if (value.length < 6) {
      errors.push(PasswordErrors[0]);
    }

    if (!/[a-z]/.test(value)) {
      errors.push(PasswordErrors[1]);
    }
    if (!/[A-Z]/.test(value)) {
      errors.push(PasswordErrors[2]);
    }
    if (!/\d/.test(value)) {
      errors.push(PasswordErrors[3]);
    }
    if (!/[@$!%*?&]/.test(value)) {
      errors.push(PasswordErrors[4]);
    }

    if (errors.length) {
      return this.createError({ message: errors.join(', ') });
    }
    return true;
  })
  .required('Required'),
  confirmPassword: Yup.string()
    .nullable()
    .oneOf([Yup.ref('password'), null], 'Password must match')
    .required('Required'),
  image: Yup.string().url('Invalid image URL').required('Required'),
});

// Creating separate schema for store vendor form
export const VendorSchemaForStoreForm = Yup.object().shape({
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
  image: Yup.string().url('Invalid image URL').required('Required'),
});

export const VendorEditSchema = Yup.object().shape({
  name: Yup.string().trim().matches(/\S/, 'Name cannot be only spaces'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(6, PasswordErrors[0])
    .max(20)
    .test('complexity', function (value: string | undefined) {
      const errors: string[] = [];

      if (!value) return this.createError({});

      if (value.length < 6) {
        errors.push(PasswordErrors[0]);
      }

      if (!/[a-z]/.test(value)) {
        errors.push(PasswordErrors[1]);
      }
      if (!/[A-Z]/.test(value)) {
        errors.push(PasswordErrors[2]);
      }
      if (!/\d/.test(value)) {
        errors.push(PasswordErrors[3]);
      }
      if (!/[@$!%*?&]/.test(value)) {
        errors.push(PasswordErrors[4]);
      }

      if (errors.length) {
        return this.createError({ message: errors.join(', ') });
      }
      return true;
    })
    .required('Required'),
  confirmPassword: Yup.string()
    .nullable()
    .oneOf([Yup.ref('password'), null], 'Password must match')
    .required('Required'),
  image: Yup.string(),
  phoneNumber: Yup.string(),
  firstName: Yup.string()
    .trim()
    .matches(/\S/, 'First Name cannot be only spaces')
    .required('Required'),
  lastName: Yup.string()
    .trim()
    .matches(/\S/, 'Last Name cannot be only spaces')
    .required('Required'),
});

export const RestaurantsVendorDetails = Yup.object().shape({
  _id: Yup.mixed<IDropdownSelectItem>().required('Required'),
});
