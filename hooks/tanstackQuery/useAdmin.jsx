"use client";

import axiosRequest from "@/lib/axiosRequest";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useAdminUsers = ({ limit = 10, offset = 0, search = "" }) => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () =>
      await axiosRequest({
        url: `/admin/users`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }),
  });
};
