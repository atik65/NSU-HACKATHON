"use client";

import axiosRequest from "@/lib/axiosRequest";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useGetCrimes = ({ limit = 10, offset = 0, search = "" }) => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["crimes"],
    queryFn: async () =>
      await axiosRequest({
        url: `/crime`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }),
  });
};

export const useOtpVerify = () => {
  return useMutation({
    mutationKey: "OtpVerify",
    mutationFn: async (body) =>
      await axiosRequest({
        url: `/verify-sms-otp/`,
        method: "POST",
        data: body,
      }),
  });
};

export const useCreateCrime = () => {
  const { data: session } = useSession();

  return useMutation({
    mutationKey: "createCrime",
    mutationFn: async (body) =>
      await axiosRequest({
        url: `/report-crime`,
        method: "POST",
        data: body,
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }),
  });
};
