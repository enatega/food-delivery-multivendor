import * as Yup from 'yup';

export const RiderSchema = Yup.object().shape({
  name: Yup.string()
    .max(35)
    .trim()
    .matches(/\S/, 'Name cannot be only spaces')
    .required('Required'),
  username: Yup.string().min(2).max(35).required('Required'),
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
  zone: Yup.object()
    .shape({
      label: Yup.string().required('Required'),
      code: Yup.string().required('Required'),
    })
    .required('Required'),
  phone: Yup.string().required('Required'),
  vehicleType: Yup.object()
    .shape({
      label: Yup.string().required('Required'),
      code: Yup.string().required('Required'),
    })
    .required('Required'),
});
