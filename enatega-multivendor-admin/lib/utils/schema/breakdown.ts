import * as Yup from 'yup';

export const BreakdownSchema = Yup.object({
  min: Yup.number().min(0).max(999999).required('Required'),
  max: Yup.number().min(0).max(999999).required('Required'),
  bronze: Yup.number().min(0).max(999999).required('Required'),
  silver: Yup.number().min(0).max(999999).required('Required'),
  gold: Yup.number().min(0).max(999999).required('Required'),
  platinum: Yup.number().min(0).max(999999).required('Required'),
});
