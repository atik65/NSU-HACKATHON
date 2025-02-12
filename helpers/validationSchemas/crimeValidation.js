import * as yup from "yup";

// {
//   "title": "Robbery at Market Street",
//   "description": "A robbery occurred at Market Street around 10 PM.",
//   "division": "North",
//   "district": "Downtown",
//   "crime_time": "2025-02-10T22:00:00Z",
//   "image": "/9j/4AAQSkZJRgABAQAA",
//   "video": "https://example.com/video.mp4"
// }

export const crimeSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  district: yup.string().required("District is required"),
  division: yup.string().required("Division is required"),
});
