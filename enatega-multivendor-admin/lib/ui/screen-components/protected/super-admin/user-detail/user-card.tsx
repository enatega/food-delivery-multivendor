"use client";
import React from "react";
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { IUserResponse } from '@/lib/utils/interfaces/users.interface';

interface UserCardProps {
  user: IUserResponse;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const header = (
    <div className="flex items-center p-4">
      <Avatar
        image={"https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} // Use placeholder.com image if no avatar
        size="xlarge"
        shape="circle"
        className="border shadow-md"
      />
      <div className="ml-4">
        <h1 className="text-xl font-bold">{user.name}</h1>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-600">{user.phone}</p>
      </div>
    </div>
  );

  return (
    <Card header={header} className="shadow-sm border  rounded-xl"></Card>
  );
};

export default UserCard;
