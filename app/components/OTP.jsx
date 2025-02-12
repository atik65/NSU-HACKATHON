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
import { useState } from "react";

export function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>OTP Verification</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your device
          </CardDescription>
        </CardHeader>
        <form>
          <CardContent>
            <div className="flex justify-between mb-4">
              {otp.map((data, index) => (
                <Input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="\d{1}"
                  maxLength={1}
                  className="w-12 h-12 text-center text-2xl"
                  // value={data}
                  // onChange={(e) => handleChange(e.target, index)}
                  // onFocus={(e) => e.target.select()}
                />
              ))}
            </div>
            <Label className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <Button variant="link" className="p-0">
                Resend
              </Button>
            </Label>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Verify OTP
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
