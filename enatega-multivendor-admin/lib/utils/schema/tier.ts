import * as Yup from 'yup';
import { IDropdownSelectItem } from '../interfaces';


export const TierSchema = Yup.object({
  type: Yup.mixed<IDropdownSelectItem>().required('Required'),
  value: Yup.number().min(0).max(99999).required('Required'),
});
