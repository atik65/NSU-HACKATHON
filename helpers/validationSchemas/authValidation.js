import * as yup from "yup";

export const registrationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const forgetPassSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export const changePassSchema = yup.object().shape({
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});
