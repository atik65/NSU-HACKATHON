"use client";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Popover, PopoverTrigger } from "@/app/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { crimeSchema } from "@/helpers/validationSchemas/crimeValidation";
import { useCreateCrime } from "@/hooks/tanstackQuery/useCrimes";
import { getImgToB64 } from "@/lib/imageToBase64";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";

// {
//   "title": "Robbery at Market Street",
//   "description": "A robbery occurred at Market Street around 10 PM.",
//   "division": "North",
//   "district": "Downtown",
//   "crime_time": "2025-02-10T22:00:00Z",
//   "image": "/9j/4AAQSkZJRgABAQAA",
//   "video": "https://example.com/video.mp4"
// }

export default function CrimeReportForm() {
  //const [date, setDate] = useState<Date>()
  //   const [selectedFile, setSelectedFile] = (useState < File) | (null > null);
  //   const [fileError, setFileError] = (useState < string) | (null > null);

  const { mutateAsync, isPending } = useCreateCrime();
  const router = useRouter();

  const { values, touched, handleChange, errors, setFieldValue, handleSubmit } =
    useFormik({
      initialValues: {
        title: "",
        description: "",
        division: "",
        district: "",
        image: "",
        video: "",
      },
      validationSchema: crimeSchema,
      onSubmit: async (values) => {
        const base64Image = await getImgToB64(values.image);

        const payload = {
          title: values.title,
          description: values.description,
          division: values.division,
          district: values.district,
          crime_time: new Date(),
          image: base64Image,
          video: "",
        };

        try {
          const res = await mutateAsync(payload);
          console.log(res);

          enqueueSnackbar(res.message || "Crime reported successfully", {
            variant: "default",
          });

          router.push("/");
        } catch (error) {
          console.log(error);

          enqueueSnackbar(error?.error || "Crime report failed", {
            variant: "error",
          });
        }

        // console.log("payload = ", payload);
      },
    });

  console.log("values = ", values);

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Crime Report Form</CardTitle>
          <CardDescription>
            Please fill out this form to report a crime. All information will be
            kept confidential.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className=" gap-4">
              <div className="space-y-2">
                <Label htmlFor="Title">Title</Label>
                <Input
                  className="w-full"
                  id="Title"
                  placeholder="Crime Title"
                  name="title"
                  type="text"
                  onChange={handleChange}
                  value={values.title}
                  error={errors.title}
                  touched={touched.title}
                />
              </div>
              {/* <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Doe" />
          </div> */}
            </div>

            {/* division */}
            <div className="space-y-2">
              <Label htmlFor="division">Division</Label>
              {/* <Select
                type="select"
                name="division"
               
                onChange={handleChange}
                value={values.division}
                error={errors.division}
                touched={touched.division}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="North">North</SelectItem>
                  <SelectItem value="South">South</SelectItem>
                  <SelectItem value="East">East</SelectItem>
                  <SelectItem value="West">West</SelectItem>
                </SelectContent>
              </Select> */}

              <Input
                id="division"
                type="text"
                placeholder="Division"
                name="division"
                onChange={handleChange}
                value={values.division}
                error={errors.division}
                touched={touched.division}
              />

              {/* show error message */}
            </div>

            {/* district */}
            <div>
              <Label htmlFor="district">District</Label>
              {/* <Select
                type="select"
                name="district"
                onChange={handleChange}
                value={values.district}
                error={errors.district}
                touched={touched.district}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="North">Dhaka</SelectItem>
                  <SelectItem value="South">Rajshahi</SelectItem>
                  <SelectItem value="East">East</SelectItem>
                  <SelectItem value="West">West</SelectItem>
                </SelectContent>
              </Select> */}

              <Input
                id="district"
                type="text"
                placeholder="District"
                name="district"
                onChange={handleChange}
                value={values.district}
                error={errors.district}
                touched={touched.district}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="crimeType">Type of Crime</Label>
              <Select>
                <SelectTrigger id="crimeType">
                  <SelectValue placeholder="Select crime type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="theft">Theft</SelectItem>
                  <SelectItem value="assault">Assault</SelectItem>
                  <SelectItem value="burglary">Burglary</SelectItem>
                  <SelectItem value="vandalism">Vandalism</SelectItem>
                  <SelectItem value="fraud">Fraud</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image Upload</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  if (file) {
                    setFieldValue("image", file);
                  }
                }}
                // value={values.image}
                // error={errors.image}
                // touched={touched.image}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="des">Description</Label>
              <Textarea
                id="des"
                type="text"
                placeholder="Describe the incident"
                name="description"
                onChange={handleChange}
                value={values.description}
                // error={errors.description}
                // touched={touched.description}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button disabled={isPending} type="submit" className="w-full">
              {isPending ? "Please wait..." : "Report Crime"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
