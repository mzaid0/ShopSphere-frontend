"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"

// Define the User type
export type User = {
  id: string
  profilePicture: string // URL for the profile picture
  name: string
  email: string
  phone: string
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "profilePicture", // Reference the profile picture field
    header: "Profile Picture",
    cell: ({ getValue }) => {
      // Assert that the value is a string (the image URL)
      const profilePictureUrl = getValue() as string;
      
      // Ensure the value is a valid URL before rendering the Image component
      return profilePictureUrl ? (
        <Image
          src={profilePictureUrl} // Get the profile picture URL
          alt="Profile"
          width={40} // Set the width of the image
          height={40} // Set the height of the image
          className="rounded-full object-cover" // Tailwind styling for circular image
        />
      ) : (
        <span>No Image</span> // Handle missing image (optional)
      )
    },
  },
  {
    accessorKey: "name", // Display user's name
    header: "Name",
  },
  {
    accessorKey: "email", // Display user's email
    header: "Email",
  },
  {
    accessorKey: "phone", // Display user's phone number
    header: "Phone",
  },
]
