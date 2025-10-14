"use client";
import React from 'react';
import { IUserResponse } from '@/lib/utils/interfaces/users.interface';

interface PersonalInfoProps {
    user: IUserResponse;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ user }) => {
    return (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 text-black">
                <div>
                    <h4 className="text-base font-semibold">First Name</h4>
                    <p>{user.name ? user.name.split(' ')[0] : ''}</p>
                </div>
                <div>
                    <h4 className="text-base font-semibold">Last Name</h4>
                    <p>{user.name ? user.name.split(' ').slice(1).join(' ') : ''}</p>
                </div>
                <div>
                    <h4 className="text-base font-semibold">Email</h4>
                    <p>{user.email || "N/A"}</p>
                </div>
                <div>
                    <h4 className="text-base font-semibold">Email Verified</h4>
                    <p>{user.emailIsVerified ? 'Yes' : 'No'}</p>
                </div>
                <div>
                    <h4 className="text-base font-semibold">Phone</h4>
                    <p>{user.phone || "N/A"}</p>
                </div>
                <div>
                    <h4 className="text-base font-semibold">Phone Verified</h4>
                    <p>{user.phoneIsVerified ? 'Yes' : 'No'}</p>
                </div>
                <div>
                    <h4 className="text-base font-semibold">Active</h4>
                    <p>{user.isActive ? 'Yes' : 'No'}</p>
                </div>
                <div>
                    <h4 className="text-base font-semibold">Status</h4>
                    <p>{user.status}</p>
                </div>
                <div>
                    <h4 className="text-base font-semibold">Last Login</h4>
                    <p>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                    <h4 className="text-base font-semibold">Order Notifications</h4>
                    <p>{user.isOrderNotification ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div>
                    <h4 className="text-base font-semibold">Offer Notifications</h4>
                    <p>{user.isOfferNotification ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div>
                    <h4 className="text-base font-semibold">Member Since</h4>
                    <p>{user.createdAt ? new Date(Number(user.createdAt)).toLocaleDateString() : ''}</p>
                </div>
                <div>
                    <h4 className="text-base font-semibold">Last Updated</h4>
                    <p>{user.updatedAt ? new Date(Number(user.updatedAt)).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                    <h4 className="text-base font-semibold">Registration Method</h4>
                    <p>{user.userType || 'N/A'}</p>
                </div>
                <div>
                    <h4 className="text-base font-semibold">Favourite Items</h4>
                    <p>{user.favourite && user.favourite.length > 0 ? `${user.favourite.length} items` : 'None'}</p>
                </div>
                <div>
                    <h4 className="text-base font-semibold">Notification Token</h4>
                    <p>{user.notificationToken || 'N/A'}</p>
                </div>
                <div>
                    <h4 className="text-base font-semibold">Internal Notes</h4>
                    <p>{user.notes || 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfo;