"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import { MdEdit, MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TruckLoader from "@/components/Loader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deleteSmallBanner, getSmallBanners } from "@/api/small-banner";

// Define the Banner interface (adjust fields as needed)
export interface Banner {
  id: string;
  title: string;
  description?: string;
  image: string;
  alignInfo: string; // e.g., 'left' or 'right'
  category: {
    id: string;
    name: string;
  };
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const HomeSmallSliderBanners = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // State to manage deletion confirmation dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);

  // Fetch small banners using React Query
  const { data, isLoading, isError, error } = useQuery<{
    success: boolean;
    smallBanners: Banner[];
  }>({
    queryKey: ["smallBanners"],
    queryFn: getSmallBanners,
  });

  console.log(data);

  // Mutation for deleting a small banner
  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteSmallBanner,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["smallBanners"] });
      toast({
        title: "Small Banner Deleted",
        description: data.message,
      });
      setShowDeleteConfirm(false);
    },
    onError: (error: ApiError) => {
      toast({
        title: "Banner Delete Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
      setShowDeleteConfirm(false);
    },
  });

  // Handler when delete icon is clicked – set the banner ID and open the dialog.
  const handleDeleteClick = (id: string) => {
    setBannerToDelete(id);
    setShowDeleteConfirm(true);
  };

  // Handler for confirming deletion
  const handleConfirmDelete = () => {
    if (bannerToDelete) {
      mutate(bannerToDelete);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <TruckLoader />
      </div>
    );
  }

  if (isError) {
    const apiError = error as unknown as ApiError;
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-semibold text-4xl capitalize">
          {apiError?.response?.data?.message || "Unknown error occurred"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between p-6 bg-white mb-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Home Small Banners
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your home small banners here.
          </p>
        </div>
        <Link href="/dashboard/small-banners/add">
          <Button>+ Add Small Banner</Button>
        </Link>
      </div>

      {/* Table Container with vertical scroll */}
      <div className="border border-gray-200 rounded-xl shadow-xs bg-white max-h-[500px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="text-center">
              <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px]">
                Banner Image
              </th>
              <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
                Title
              </th>
              <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[250px]">
                Description
              </th>
              <th className="px-6 py-5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">
                Align Info
              </th>
              <th className="px-6 py-5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
                Category
              </th>
              <th className="px-6 py-5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.smallBanners?.map((banner: Banner) => (
              <tr
                key={banner.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {/* Banner Image */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative w-32 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      className="object-cover hover:scale-105 duration-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/default-banner.png";
                      }}
                    />
                  </div>
                </td>
                {/* Title */}
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {banner.title || "Unnamed Banner"}
                  </div>
                  <div className="text-sm text-gray-500">ID: {banner.id}</div>
                </td>
                {/* Description */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700">
                    {banner.description || "No description provided."}
                  </div>
                </td>
                {/* Align Info */}
                <td className="px-6 py-4 text-center">
                  <div className="text-sm text-gray-700">
                    {banner.alignInfo || "N/A"}
                  </div>
                </td>
                {/* Category */}
                <td className="px-6 py-4 text-center">
                  <div className="text-sm text-gray-700">
                    {banner.category?.name || "N/A"}
                  </div>
                </td>
                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-4">
                    <Tooltip title="Edit Banner" arrow>
                      <Link href={`/dashboard/small-banners/edit/${banner.id}`}>
                        <button className="p-2 rounded-lg hover:bg-blue-50 text-primary hover:text-blue-700 transition-colors duration-200">
                          <MdEdit size={22} />
                        </button>
                      </Link>
                    </Tooltip>
                    <Tooltip title="Delete Banner" arrow>
                      <button
                        onClick={() => handleDeleteClick(banner.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors duration-200"
                      >
                        <MdDelete size={22} />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HomeSmallSliderBanners;
