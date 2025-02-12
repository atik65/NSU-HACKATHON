"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registrationSchema } from "@/helpers/validationSchemas/authValidation";
import { useRegister } from "@/hooks/tanstackQuery/useAuth";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

export default function RegisterForm() {
  const { mutateAsync, isPending } = useRegister();
  const router = useRouter();

  const { values, errors, touched, handleSubmit, handleChange } = useFormik({
    initialValues: {
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: registrationSchema,
    onSubmit: async (values) => {
      // await mutateAsync(values);

      try {
        const res = await mutateAsync({
          email: values.email,
          password: values.password,
          phone: values.phone,
        });
        console.log(res);

        enqueueSnackbar(res.message || "Registration successful", {
          variant: "default",
        });
        router.push("/login");
      } catch (error) {
        console.log(error);
        enqueueSnackbar(error?.error || "Registration failed", {
          variant: "error",
        });
      }
    },
  });

  console.log(values);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  error={errors.email}
                  touched={touched.email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+8801234567890"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  touched={touched.phone}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  error={errors.password}
                  touched={touched.password}
                />
              </div>
              {/* confirm password */}

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                />
              </div>

              <Button
                disabled={isPending}
                type="submit"
                className="w-full disabled:opacity-50"
              >
                {isPending ? "Processing ..." : " Sign Up"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
