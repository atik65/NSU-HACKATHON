"use client";

import axiosRequest from "@/lib/axiosRequest";
import { useQuery } from "@tanstack/react-query";
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
