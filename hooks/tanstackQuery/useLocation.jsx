"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetDivisions = () => {
  return useQuery({
    queryKey: ["divisions"],
    queryFn: async () =>
      await axios.get(`https://bdapis.com/api/v1.2/divisions`),
  });
};
