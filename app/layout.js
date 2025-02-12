import { getServerSession } from "next-auth/next";
import RootProvider from "../providers/RootProvider";
import { authOptions } from "./api/auth/[...nextauth]/route";
import "./globals.css";

export const metadata = {
  title: "Reportify",
  description: "Report crime in our area",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body>
        <RootProvider session={session}>{children}</RootProvider>
      </body>
    </html>
  );
}