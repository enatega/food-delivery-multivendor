import * as Yup from 'yup';

export const DeliverySchema = Yup.object().shape({
  minDeliveryFee: Yup.number().required('Required'),
  deliveryDistance: Yup.number().required('Required'),
  deliveryFee: Yup.number().required('Required'),
});
