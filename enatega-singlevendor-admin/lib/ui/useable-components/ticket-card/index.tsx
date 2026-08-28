import { memo } from 'react';
import { useTranslations } from 'next-intl';

// Interfaces
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
  lastMessageAt?: string; // Added for tracking last message time
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

interface ITicketCardProps {
  ticket: ITicket;
  onClick: () => void;
}

function TicketCard({
  ticket,
  onClick
}: ITicketCardProps) {

  const t = useTranslations();

  // Get status class
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'inprogress':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get display text for ticket
  const getTicketDisplayText = () => {
    if (ticket.category === 'order related' && ticket.orderId) {
      return `${t('order_issue')} - ${ticket.orderId}`;
    }

    return ticket.title;
  };

  // Format time ago
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

      // Format date for older messages
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return "unknown time";
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(parseInt(dateString));
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "unknown date";
    }
  };

  // Use last message time or updated time
  const displayTime = ticket.lastMessageAt || ticket.updatedAt;

  return (
    <div
      onClick={onClick}
      className="flex flex-col border-b border-gray-200 dark:border-dark-600 p-4 cursor-pointer bg-white dark:bg-dark-950 dark:text-white hover:bg-gray-50 dark:hover:bg-dark-900"
    >
      <div className="flex justify-between items-center">
        {/* Ticket title */}
        <h3 className="font-medium text-lg text-gray-900 dark:text-white">
          {getTicketDisplayText()}
        </h3>

        {/* Last message time */}
        <span className="text-sm text-gray-500 dark:text-white">
          {formatTimeAgo(displayTime)}
        </span>
      </div>

      {/* Description preview */}
      <p className="text-sm text-gray-500 dark:text-white mt-1 truncate">
        {ticket.description}
      </p>

      <div className="flex justify-between items-center mt-2">
        {/* Status badge */}
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getStatusClass(ticket.status)}`}>
          {ticket.status === 'inProgress' ? 'In Progress' :
            ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
        </span>

        {/* Format date */}
        <span className="text-xs text-gray-500 dark:text-white">
          {formatDate(displayTime)}
        </span>
      </div>
    </div>
  );
}

// Use React.memo to prevent unnecessary re-renders
export default memo(TicketCard);
