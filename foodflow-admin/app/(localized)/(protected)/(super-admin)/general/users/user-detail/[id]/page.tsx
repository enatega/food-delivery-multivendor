"use client";
import UserDetailScreen from "@/lib/ui/screens/super-admin/user-detail";
import React from "react";

const UserDetailPage = ({ params }: { params: { id: string } }) => {
  return <UserDetailScreen userId={params.id} />;
};

export default UserDetailPage;