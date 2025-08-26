import Image from 'next/image';
import { memo } from 'react';

// Interfaces
export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface ITicket {
  _id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  orderId?: string;
  otherDetails?: string;
  createdAt: string;
  updatedAt: string;
  user: IUser;
  lastMessageAt?: string;
}

interface IUserTicketCardProps {
  user: IUser;
  latestTicket: ITicket | null;
  isSelected: boolean;
  onClick: () => void;
  formatDate: (dateString: string) => string;
}

// Using memo to prevent unnecessary re-renders
function UserTicketCard({ 
  user, 
  latestTicket, 
  isSelected, 
  onClick,
  formatDate
}: IUserTicketCardProps) {
  // Format time ago from timestamp
  const formatTimeAgo = (timestamp: string) => {
    try {
      const date = new Date(parseInt(timestamp));
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      
      // Less than a minute
      if (diffMs < 60000) {
        return 'just now';
      }
      
      // Less than an hour
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 60) {
        return `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`;
      }
      
      // Less than a day
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) {
        return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
      }
      
      // Less than a week
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) {
        return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
      }
      
      // Use date format for older messages
      return formatDate(timestamp);
    } catch (error) {
      return "unknown time";
    }
  };

  return (
    <div 
      onClick={onClick} 
      className={`flex items-center border-b border-gray-200 p-3 cursor-pointer ${
        isSelected ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      {/* User avatar */}
      <div className="relative">
        <Image
          width={40}
          height={40}
          src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
          alt="User avatar"
          className="h-10 w-10 rounded-full mr-3"
        />
      </div>
      
      {/* User name and ticket info */}
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h3 className={`font-medium text-base ${isSelected ? 'text-white' : 'text-black'}`}>
            {user.name}
          </h3>
          {latestTicket && (
            <span className={`text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
              {formatTimeAgo(latestTicket.lastMessageAt || latestTicket.updatedAt)}
            </span>
          )}
        </div>
        
        {/* Preview of latest ticket/message */}
        {latestTicket && (
          <p className={`text-sm truncate ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
            {latestTicket.title}
          </p>
        )}
        
        {/* Status badge for latest ticket */}
        {latestTicket && (
          <div className="mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isSelected
                ? 'bg-gray-700 text-white'
                : latestTicket.status === 'open'
                  ? 'bg-blue-100 text-blue-800'
                  : latestTicket.status === 'inProgress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
            }`}>
              {latestTicket.status === 'inProgress' ? 'In Progress' : 
               latestTicket.status.charAt(0).toUpperCase() + latestTicket.status.slice(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Use React.memo to prevent unnecessary re-renders
export default memo(UserTicketCard);