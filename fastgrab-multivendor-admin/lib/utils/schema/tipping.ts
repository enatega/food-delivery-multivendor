import * as Yup from 'yup';

export const TippingSchema = Yup.object().shape({
  tip1: Yup.number()
    .required('Tip 1 is required')
    .test('unique', 'Tip 1 must be different from Tip 3', function (value) {
      const { tip3 } = this.parent;
      return value !== tip3;
    })
    .test('unique', 'Tip 1 must be different from Tip 2 ', function (value) {
      const { tip2 } = this.parent;
      return value !== tip2;
    }),
  tip2: Yup.number()
    .required('Tip 2 is required')
    .test('unique', 'Tip 2 must be different from Tip 3', function (value) {
      const { tip3 } = this.parent;
      return value !== tip3;
    })
    .test('unique', 'Tip 2 must be different from Tip 1', function (value) {
      const { tip1 } = this.parent;
      return value !== tip1;
    }),
  tip3: Yup.number()
    .required('Tip 3 is required')
    .test('unique', 'Tip 3 must be different from Tip 1', function (value) {
      const { tip1 } = this.parent;
      return value !== tip1;
    })
    .test('unique', 'Tip 3 must be different from Tip 2', function (value) {
      const { tip2 } = this.parent;
      return value !== tip2;
    }),
});
