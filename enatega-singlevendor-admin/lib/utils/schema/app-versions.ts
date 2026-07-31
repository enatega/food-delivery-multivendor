import * as Yup from 'yup';

const versionRegex = /^\d+\.\d+\.\d+$/;
export const VersionConfigValidationSchema = Yup.object().shape({
  customerAppVersionAndroid: Yup.string()
    .matches(versionRegex, 'Version must be in format X.Y.Z')
    .required('Required'),
  customerAppVersionIos: Yup.string()
    .matches(versionRegex, 'Version must be in format X.Y.Z')
    .required('Required'),
  riderAppVersionAndroid: Yup.string()
    .matches(versionRegex, 'Version must be in format X.Y.Z')
    .required('Required'),
  riderAppVersionIos: Yup.string()
    .matches(versionRegex, 'Version must be in format X.Y.Z')
    .required('Required'),
  restaurantAppVersionAndroid: Yup.string()
    .matches(versionRegex, 'Version must be in format X.Y.Z')
    .required('Required'),
  restaurantAppVersionIos: Yup.string()
    .matches(versionRegex, 'Version must be in format X.Y.Z')
    .required('Required'),
});