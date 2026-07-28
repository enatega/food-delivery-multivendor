import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_TICKET_USERS_WITH_LATEST,
  GET_USER_SUPPORT_TICKETS,
} from '@/lib/api/graphql/queries/supportTickets';
import {
  CREATE_TICKET_MESSAGE,
  UPDATE_TICKET_STATUS,
} from '@/lib/api/graphql/mutations/supportTickets';
import UserTicketCard from '@/lib/ui/useable-components/user-ticket-card';
import TicketCard from '@/lib/ui/useable-components/ticket-card';
import TicketChatModal from '@/lib/ui/useable-components/ticket-chat-modal';
import NoData from '@/lib/ui/useable-components/no-data';
import HeaderText from '@/lib/ui/useable-components/header-text';
import UserTicketSkeleton from '@/lib/ui/useable-components/custom-skeletons/user-ticket.skeleton';
import TicketCardSkeleton from '@/lib/ui/useable-components/custom-skeletons/ticket-card.skeleton';
import { Chip } from 'primereact/chip';

// Interface
export interface ICustomerSupportMainProps {
  activeTab?: 'tickets' | 'chats';
}

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

// Type for user with their latest ticket
interface UserWithLatestTicket {
  user: IUser;
  latestTicket: ITicket | null;
}

export default function CustomerSupportMain({
  activeTab = 'tickets',
}: ICustomerSupportMainProps) {
  // Hooks
  const t = useTranslations();

  // States
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isChatModalVisible, setIsChatModalVisible] = useState<boolean>(false);
  const [showTicketSkeleton, setShowTicketSkeleton] = useState<boolean>(false);
  const [sortedTickets, setSortedTickets] = useState<ITicket[]>([]);

  // Fetch users and their latest tickets in one request. Polling refreshes the
  // Apollo cache without replacing already-rendered data with a loading state.
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery(GET_TICKET_USERS_WITH_LATEST, {
    variables: {
      input: {
        page: 1,
        limit: 20,
      },
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000,
    notifyOnNetworkStatusChange: false,
  });

  // Fetch tickets for the selected user
  const {
    data: ticketsData,
    loading: ticketsLoading,
    error: ticketsError,
    refetch: refetchTickets,
  } = useQuery(GET_USER_SUPPORT_TICKETS, {
    variables: {
      input: {
        userId: selectedUserId,
        filters: {
          page: 1,
          limit: 50,
        },
      },
    },
    skip: !selectedUserId,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      setShowTicketSkeleton(false);
    },
    onError: () => {
      setShowTicketSkeleton(false);
    },
  });

  // Send message mutation
  const [createMessage, { loading: isSendingMessage }] = useMutation(
    CREATE_TICKET_MESSAGE,
    {
      onCompleted: () => {
        if (selectedTicketId) {
          // After sending a message, refresh tickets
          refetchTickets();
          refetchUsers();
        }
      },
    }
  );

  // Update ticket status mutation
  const [updateTicketStatus, { loading: isUpdatingStatus }] = useMutation(
    UPDATE_TICKET_STATUS,
    {
      onCompleted: () => {
        refetchTickets();
        refetchUsers();
      },
    }
  );

  const usersWithTickets: UserWithLatestTicket[] = (
    usersData?.getTicketUsersWithLatest?.users || []
  )
    .map((user: IUser & { latestTicket?: ITicket | null }) => ({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      latestTicket: user.latestTicket || null,
    }))
    .sort((a: UserWithLatestTicket, b: UserWithLatestTicket) => {
      const aTimestamp =
        a.latestTicket?.lastMessageAt || a.latestTicket?.updatedAt || '0';
      const bTimestamp =
        b.latestTicket?.lastMessageAt || b.latestTicket?.updatedAt || '0';
      return Number(bTimestamp) - Number(aTimestamp);
    });
  const users = usersWithTickets.map(({ user }) => user);

  // Update ticket sorting when ticket data changes
  useEffect(() => {
    if (ticketsData && !ticketsLoading) {
      // Extract tickets from the query result
      const userTickets: ITicket[] =
        ticketsData?.getSingleUserSupportTickets?.tickets || [];

      // Sort the tickets by latest activity time (newest first)
      const sorted = [...userTickets].sort((a, b) => {
        const getTimestamp = (ticket: ITicket): number => {
          const timestamp = ticket.lastMessageAt || ticket.updatedAt;
          try {
            return parseInt(timestamp);
          } catch (error) {
            return 0;
          }
        };

        return getTimestamp(b) - getTimestamp(a);
      });

      setSortedTickets(sorted);
    }
  }, [ticketsData, ticketsLoading]);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(parseInt(dateString));
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'unknown date';
    }
  };

  const firstUserId = usersWithTickets[0]?.user._id;

  // Select the most recently active user once the combined query completes.
  useEffect(() => {
    if (!selectedUserId && firstUserId) {
      setSelectedUserId(firstUserId);
    }
  }, [firstUserId, selectedUserId]);

  // Handle user selection - show skeleton when changing user
  const handleUserSelect = (userId: string) => {
    if (userId !== selectedUserId) {
      setShowTicketSkeleton(true);
      setSelectedUserId(userId);
      setSelectedTicketId(null);
    }
  };

  // Handle ticket selection
  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setIsChatModalVisible(true);
  };

  // Handle chat modal close
  const handleChatModalClose = () => {
    setIsChatModalVisible(false);

    // Refresh tickets and user data without showing loading state
    setTimeout(() => {
      refetchTickets();
      refetchUsers();
    }, 300);
  };

  // Handle send message
  const handleSendMessage = (message: string) => {
    if (!selectedTicketId || isSendingMessage) return;

    createMessage({
      variables: {
        messageInput: {
          content: message,
          ticket: selectedTicketId,
        },
      },
    });
  };

  // Handle status change
  const handleStatusChange = (ticketId: string, newStatus: string) => {
    if (isUpdatingStatus) return;

    updateTicketStatus({
      variables: {
        input: {
          ticketId,
          status: newStatus,
        },
      },
    });
  };

  // Cached data stays visible during polling; the skeleton is only for a true
  // first load, and the empty state is only reachable after that load resolves.
  const isLoading = usersLoading && usersWithTickets.length === 0;

  return (
    <div className="flex flex-grow flex-col overflow-hidden sm:flex-row">
      {/* Left panel - Users list */}
      <div
        className={`w-full overflow-y-auto border-gray-200 border dark:border-dark-600 bg-white dark:bg-dark-950 sm:w-1/3 ${
          activeTab === 'tickets' ? '' : 'hidden sm:block'
        }`}
      >
        {/* Mobile-only header for Users section */}
        <div className="mt-3 border-b dark:border-dark-600 p-3 sm:hidden">
          <div className="mb-4 flex items-center justify-between">
            <HeaderText text={t('Support Users')} />
          </div>
        </div>

        {/* Users list */}
        <div className="pb-16">
          {isLoading ? (
            <UserTicketSkeleton count={5} />
          ) : usersError ? (
            <div className="p-4 text-center text-red-500">
              Error loading users
            </div>
          ) : usersWithTickets.length > 0 ? (
            usersWithTickets.map(
              ({ user, latestTicket }: UserWithLatestTicket) => (
                <UserTicketCard
                  key={user._id}
                  user={user}
                  latestTicket={latestTicket}
                  isSelected={selectedUserId === user._id}
                  onClick={() => handleUserSelect(user._id)}
                  formatDate={formatDate}
                />
              )
            )
          ) : (
            <NoData message={t('no_user_found')} />
          )}
        </div>
      </div>

      {/* Right panel - Tickets list */}
      <div
        className={`flex-1 overflow-y-auto border-l border-gray-200 dark:border-dark-600 px-2 ${
          activeTab === 'chats' ? '' : 'hidden sm:block'
        }`}
      >
        {/* Header for Tickets section */}
        <div className="border-b dark:border-dark-600  pb-2 pt-3">
          <div className="mb-4 flex items-center justify-between">
            <div className="hidden sm:block">
              <HeaderText text={t('ticket_chats')} />
            </div>
            <div className="flex flex-col sm:hidden">
              <HeaderText text={t('ticket_chats')} />
              {selectedUserId && (
                <Chip
                  label={
                    users.find((u: IUser) => u._id === selectedUserId)?.name ||
                    'User'
                  }
                  className="w-full"
                />
              )}
            </div>
          </div>
        </div>

        {/* Tickets list */}
        <div className="pb-16">
          {isLoading ? (
            <TicketCardSkeleton count={3} />
          ) : !selectedUserId ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-gray-500 dark:text-white">
                {t('select_a_user_to_view_tickets')}
              </p>
            </div>
          ) : showTicketSkeleton ||
            (ticketsLoading && !sortedTickets.length) ? (
            <TicketCardSkeleton count={3} />
          ) : ticketsError ? (
            <div className="p-4 text-center text-red-500">
              Error loading tickets
            </div>
          ) : sortedTickets.length > 0 ? (
            sortedTickets.map((ticket: ITicket) => (
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                onClick={() => handleTicketSelect(ticket._id)}
              />
            ))
          ) : (
            <div className="flex items-center justify-center p-8">
              <p className="text-gray-500">
                {t('No tickets found for this user')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat modal */}
      {selectedTicketId && (
        <TicketChatModal
          visible={isChatModalVisible}
          onHide={handleChatModalClose}
          ticketId={selectedTicketId}
          onSendMessage={handleSendMessage}
          onStatusChange={handleStatusChange}
          isAdmin={true}
        />
      )}
    </div>
  );
}
