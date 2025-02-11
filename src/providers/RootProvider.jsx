"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useState } from "react";

const AppProgressBar = dynamic(
  () => import("next-nprogress-bar").then((mod) => mod.AppProgressBar),
  {
    ssr: true,
  }
);
const SnackbarProvider = dynamic(
  () => import("notistack").then((mod) => mod.SnackbarProvider),
  {
    ssr: true,
  }
);
const RootProvider = ({ children, session }) => {
  // console.log("session from auth provider = ", session);
  const pathname = usePathname();

  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <SessionProvider session={session}>
          <AppProgressBar
            height="3px"
            color="#6EBD0F"
            options={{ showSpinner: false }}
            shallowRouting
          />

          <div className="relative">
            <div className="mt-8 md:mt-2">{children}</div>
          </div>
        </SessionProvider>
      </SnackbarProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default RootProvider;
