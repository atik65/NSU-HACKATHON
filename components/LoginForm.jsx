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
import { loginSchema } from "@/helpers/validationSchemas/authValidation";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { values, touched, errors, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const res = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
          // callbackUrl: `${window.location.origin}/dashboard`,
          callbackUrl: `/profile`,
        });
        // console.log("res = ", res);
        // return;
        if (res?.status != 200) {
          enqueueSnackbar("Email or Password wrong", {
            variant: "error",
          });
        }

        console.log("res = ", res);

        //         {
        //     "error": null,
        //     "status": 200,
        //     "ok": true,
        //     "url": "http://localhost:3000/profile"
        // }

        if (res?.status === 200) {
          enqueueSnackbar("Logged in successfully", {
            variant: "default",
          });

          router.push("/profile");
        }
      } catch (error) {
        // console.log("error = ", error);
        enqueueSnackbar(error.message | "Something went wrong.", {
          variant: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
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
            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-full disabled:opacity-50"
            >
              {isSubmitting ? "Processing ..." : " Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
