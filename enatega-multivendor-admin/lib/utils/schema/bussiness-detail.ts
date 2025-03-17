import * as Yup from 'yup';

export const BussinessDetailsSchema = Yup.object().shape({
  bankName: Yup.string().required('Required'),
  accountName: Yup.string().required('Required'),
  accountCode: Yup.string().required('Required'),
  accountNumber: Yup.number().required('Required'),
  bussinessRegNo: Yup.number().nullable(),
  companyRegNo: Yup.number().nullable(),
  taxRate: Yup.number().required('Required'),
});
