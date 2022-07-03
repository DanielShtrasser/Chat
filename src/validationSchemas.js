import * as yup from 'yup';

export const signUpSchema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .min(3, 'errors.notInRange')
    .max(20, 'errors.notInRange')
    .required('errors.emptyField'),
  password: yup
    .string()
    .min(6, 'errors.passwordTooShort')
    .required('errors.emptyField'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'errors.passwordsDontMatch'),
});

export const channelSchema = (channels) => yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('errors.emptyField')
    .min(3, 'errors.notInRange')
    .max(20, 'errors.notInRange')
    .notOneOf(channels, 'errors.double'),
});
