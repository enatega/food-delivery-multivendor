import * as Yup from 'yup';

export const BannerSchema = Yup.object().shape({
  title: Yup.string()
    .max(35)
    .trim()
    .matches(/\S/, 'Name cannot be only spaces')
    .required('Required'),
  description: Yup.string()
    .max(35)
    .trim()
    .matches(/\S/, 'Name cannot be only spaces')
    .required('Required'),
  action: Yup.object()
    .shape({
      label: Yup.string().required('Required'),
      code: Yup.string().required('Required'),
    })
    .required('Required'),
  screen: Yup.object()
    .shape({
      label: Yup.string().required('Required'),
      code: Yup.string().required('Required'),
    })
    .required('Required'),
  file: Yup.string().required('Required'),
});
