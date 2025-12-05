import * as Yup from 'yup';

export const CuisineFormSchema = Yup.object().shape({
  name: Yup.string()
    .max(30, 'you_have_reached_the_maximum_limit')
    .trim()
    .matches(/\S/, 'name_cannot_be_only_spaces')
    .required('name_is_required'),
  description: Yup.string()
    .max(40, 'you_have_reached_the_maximum_limit_of_1500_characters')
    .trim()
    .matches(/\S/, 'description_cannot_be_only_spaces')
    .required('description_is_required'),
  shopType: Yup.object({
    label: Yup.string().required('Required'),
    code: Yup.string().required('Required'),
  }).required('Please choose one'),
  image: Yup.string().url().required("Image is Required"),
});
