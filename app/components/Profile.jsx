"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import Link from "next/link";
import { useGetDivisions } from "@/hooks/tanstackQuery/useLocation";
import { useSession } from "next-auth/react";
import { useGetUserInfo } from "@/hooks/tanstackQuery/useAuth";
import { User } from "lucide-react";

export default function Profile() {
  const { data } = useGetDivisions();
  const { data: session } = useSession();
  const { data: userInfo, isLoading } = useGetUserInfo();

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!userInfo) {
    return <p className="text-center text-red-500">No user data available.</p>;
  }

  const dummyData = [
    {
      user_id: "67ac213048889a7051627f4b",
      email: "john.doe@example.com",
      phone_number: "01756187125",
      verified: true,
      banned: true,
      profile_image: "https://i.pravatar.cc/150?img=1",
      bio: "Passionate about community safety and crime prevention.",
      crime_reports: [
        {
          date: "2023-06-15T10:30:00Z",
          description:
            "Witnessed a car break-in on Main Street. it was truly horrible",
        },
        {
          date: "2023-05-20T14:45:00Z",
          description:
            "Reported graffiti in Central Park.it's really immoral to watch",
        },
        {
          date: "2023-04-10T12:20:00Z",
          description:
            "Observed suspicious activity near the bank.it was maybe a robbary",
        },
      ],
    },
  ];

  const user = dummyData.length > 0 ? dummyData[0] : null;

  return (
    <div className="container mx-auto">
      <div className="container w-full max-w-7xl mx-auto p-4 space-y-6">
        {/* Profile Section - Containerized */}
        <Card className="mx-auto shadow-lg">
          <CardContent className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 p-6">
          <Avatar className="w-24 h-24">
  <AvatarImage
    src={userInfo.profile_image || "/placeholder.svg"}
    alt={userInfo.email}
  />
  <AvatarFallback>
    <User className="w-12 h-12 text-gray-500" /> {/* User Icon */}
  </AvatarFallback>
</Avatar>
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-bold">{userInfo.email}</h2>
              <p className="text-gray-500">{userInfo.phone_number}</p>
              <div className="flex justify-center md:justify-start space-x-2">
                <Badge variant={userInfo.verified ? "success" : "secondary"}>
                  {userInfo.verified ? "Verified" : "Unverified"}
                </Badge>
                <Badge variant={userInfo.banned ? "destructive" : "outline"}>
                  {userInfo.banned ? "Banned" : "Active"}
                </Badge>
                {/* verify now */}
                <Badge variant="destructive">
                  <Link className="w-full" href="/verify-otp">
                    Verify Now
                  </Link>
                </Badge>
              </div>
              {userInfo.bio && <p className="text-sm text-gray-600">{userInfo.bio}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Crime Reports Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">Crime Reports</h3>

          {/* Responsive Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.crime_reports.length > 0 ? (
              user.crime_reports.map((report, index) => (
                <Link key={index} href={"/crime/21231"}>
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Crime Report #{index + 1}</CardTitle>
                      <CardDescription>
                        Reported on:{" "}
                        {new Date(report.date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{report.description}</p>
                      {report.status && (
                        <Badge
                          className="mt-2"
                          variant={
                            report.status === "Resolved" ? "success" : "warning"
                          }
                        >
                          {report.status}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No crime reports available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
