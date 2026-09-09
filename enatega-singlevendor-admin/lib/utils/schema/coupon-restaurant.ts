import * as Yup from 'yup';

export const CouponRestaurantFormSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .matches(/\S/, 'Name cannot be only spaces')
    .required('Title is a required field'),
  discount: Yup.number()
    .typeError('Discount must be a number')
    .min(1, 'Discount must be at least 1%')
    .max(100, 'Discount cannot exceed 100%')
    .required('Discount is a required field'),
  startDate: Yup.date()
    .nullable()
    .required('Valid From is a required field'),
  endDate: Yup.date()
    .nullable()
    .test(
      'after-start-date',
      'Valid Until must be later than Valid From',
      function (value) {
        const startDate = this.parent.startDate;
        return !value || !startDate || value.getTime() > startDate.getTime();
      }
    )
    .required('Valid Until is a required field'),
  enabled: Yup.boolean().required('Required').required('Please choose one'),
});
