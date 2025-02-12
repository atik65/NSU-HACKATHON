"use client";

import { useState, useEffect } from "react";
import { BadgeCheck, Ban, CircleOff, Users } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { useAdminUsers } from "@/hooks/tanstackQuery/useAdmin";
import { User } from "lucide-react";

export default function UserList() {
  const { data, isLoading, isError } = useAdminUsers({ limit: 10, offset: 0 });

  // Ensure `users` is an array, fallback to an empty array if undefined
  const users = data?.users ?? [];

  // Debugging: Check what data is being received
  console.log("API Data:", data);

  // Function to toggle user ban status
  const [userList, setUserList] = useState(users);

  const toggleBan = (id) => {
    setUserList(
      userList.map((user) =>
        user.id === id ? { ...user, banned: !user.banned } : user
      )
    );
  };

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Error loading users.</p>;

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">User Management</CardTitle>
          <Users className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user,index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={user.profile_image || "/placeholder.svg"}
                          alt={user.email}
                        />
                        <AvatarFallback>
                          <User className="w-12 h-12 text-gray-500" />{" "}
                          {/* User Icon */}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      {user.verified ? (
                        <BadgeCheck className="h-5 w-5 text-green-500" />
                      ) : (
                        <CircleOff className="h-5 w-5 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.banned ? "destructive" : "success"}>
                        {user.banned ? "Banned" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => toggleBan(user.id)}
                        variant={user.banned ? "outline" : "destructive"}
                        size="sm"
                      >
                        {user.banned ? "Unban" : "Ban"}
                        <Ban className="ml-2 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
