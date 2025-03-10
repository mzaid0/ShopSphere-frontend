"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns, User } from "./columns";

const UsersTable = () => {
  // Fetch users using TanStack Query
  const { data, isLoading, error } = useQuery<User[]>({
    queryKey: ["users"], // Unique key for caching
    queryFn: async () => {
      const response = await fetch("http://localhost:8000/api/users/all", {
        credentials: "include", // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const result = await response.json();
      // Transform backend data to match frontend User type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return result.users.map((user: any) => ({
        id: user.id,
        profilePicture: user.avatar, // Backend uses 'avatar'
        name: `${user.firstName} ${user.lastName}`, // Combine firstName and lastName
        email: user.email,
        phone: user.phone,
      }));
    },
  });

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  // Render the table with fetched data
  return (
    <div className="bg-white p-4">
      <h1 className=" text-3xl font-semibold"> All Users</h1>
      <DataTable columns={columns} data={data!} />
    </div>
  );
};

export default UsersTable;
