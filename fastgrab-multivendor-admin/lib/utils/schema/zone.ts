import * as Yup from 'yup';

export const ZoneSchema = Yup.object().shape({
  title: Yup.string().min(2).max(35).required('Required'),
  description: Yup.string().min(2).max(35).required('Required'),
});
