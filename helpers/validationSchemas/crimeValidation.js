import * as yup from "yup";

export const crimeSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  district: yup.string().required("District is required"),
  division: yup.string().required("Division is required"),
  proveAttachment: yup.string().required("Prove Attachment is required"),
  description: yup.string().required("Description is required"),
});
