import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { GET_TICKET_USERS, GET_USER_SUPPORT_TICKETS, GET_TICKET_MESSAGES } from '@/lib/api/graphql/queries/supportTickets';
import { CREATE_TICKET_MESSAGE, UPDATE_TICKET_STATUS } from '@/lib/api/graphql/mutations/supportTickets';
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
  lastUpdated: number; // Timestamp to track the most recent update
}

export default function CustomerSupportMain({ activeTab = 'tickets' }: ICustomerSupportMainProps) {
  // Hooks
  const t = useTranslations();
  const client = useApolloClient();

  // States
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isChatModalVisible, setIsChatModalVisible] = useState<boolean>(false);
  const [page] = useState<number>(1);
  const [limit] = useState<number>(20);
  const [usersWithTickets, setUsersWithTickets] = useState<UserWithLatestTicket[]>([]);
  const [showTicketSkeleton, setShowTicketSkeleton] = useState<boolean>(false);
  const [sortedTickets, setSortedTickets] = useState<ITicket[]>([]);

  // Refs
  const initialDataLoaded = useRef<boolean>(false);
  const pollingIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPolledAt = useRef<number>(Date.now());

  // Fetch list of users who have created tickets
  const { data: usersData, loading: usersLoading, error: usersError, refetch: refetchUsers } = useQuery(
    GET_TICKET_USERS,
    {
      variables: {
        input: {
          page,
          limit
        }
      },
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    }
  );

  // Fetch tickets for the selected user
  const { data: ticketsData, loading: ticketsLoading, error: ticketsError, refetch: refetchTickets } = useQuery(
    GET_USER_SUPPORT_TICKETS,
    {
      variables: {
        input: {
          userId: selectedUserId,
          filters: {
            page: 1,
            limit: 50
          }
        }
      },
      skip: !selectedUserId,
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
      onCompleted: () => {
        setShowTicketSkeleton(false);
      }
    }
  );

  // Send message mutation
  const [createMessage, { loading: isSendingMessage }] = useMutation(CREATE_TICKET_MESSAGE, {
    onCompleted: () => {
      if (selectedTicketId) {
        // After sending a message, refresh tickets
        refetchTickets();
        // Update the latest ticket information without showing loading states
        if (selectedUserId) {
          fetchLatestUserTickets([selectedUserId]);
        }
      }
    }
  });

  // Update ticket status mutation
  const [updateTicketStatus, { loading: isUpdatingStatus }] = useMutation(UPDATE_TICKET_STATUS, {
    onCompleted: () => {
      refetchTickets();
      // Update the latest ticket information without showing loading states
      if (selectedUserId) {
        fetchLatestUserTickets([selectedUserId]);
      }
    }
  });

  // Extract data from queries
  const users: IUser[] = usersData?.getTicketUsers?.users || [];

  // Consistent sorting function for users with tickets
  const sortUsersByLatestActivity = (users: UserWithLatestTicket[]): UserWithLatestTicket[] => {
    return [...users].sort((a, b) => {
      // Get the timestamp for the latest activity (message or update)
      const getLatestTimestamp = (user: UserWithLatestTicket): number => {
        if (!user.latestTicket) return 0;

        // Use lastMessageAt if available, otherwise fall back to updatedAt
        const timestamp = user.latestTicket.lastMessageAt || user.latestTicket.updatedAt;
        try {
          return parseInt(timestamp);
        } catch (error) {
          return 0;
        }
      };

      // Sort by timestamp (most recent first)
      return getLatestTimestamp(b) - getLatestTimestamp(a);
    });
  };

  // Update search when value changes
  useEffect(() => {
    if (initialDataLoaded.current) {
      refetchUsers();
    }
  }, [refetchUsers]);

  // Update ticket sorting when ticket data changes
  useEffect(() => {
    if (ticketsData && !ticketsLoading) {
      // Extract tickets from the query result
      const userTickets: ITicket[] = ticketsData?.getSingleUserSupportTickets?.tickets || [];

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
        day: 'numeric'
      });
    } catch (error) {
      return "unknown date";
    }
  };

  // Fetch latest ticket for a specific user
  const fetchUserLatestTicket = async (userId: string): Promise<UserWithLatestTicket | null> => {
    try {
      // Fetch this user's tickets
      const { data } = await client.query({
        query: GET_USER_SUPPORT_TICKETS,
        variables: {
          input: {
            userId,
            filters: {
              page: 1,
              limit: 10
            }
          }
        },
        fetchPolicy: "network-only"
      });

      // Find the user object
      const user = users.find(u => u._id === userId);
      if (!user) return null;

      // Get all tickets sorted by updatedAt time (newest first)
      const userTickets = data?.getSingleUserSupportTickets?.tickets || [];
      let latestTicket: ITicket | null = null;

      if (userTickets.length > 0) {
        // Sort by lastMessageAt or updatedAt timestamp (newest first)
        const sortedTickets = [...userTickets].sort((a, b) => {
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

        if (sortedTickets.length > 0) {
          latestTicket = sortedTickets[0];

          // For the latest ticket, also check for its last message time
          if (latestTicket) {
            try {
              const { data: messageData } = await client.query({
                query: GET_TICKET_MESSAGES,
                variables: {
                  input: {
                    ticket: latestTicket._id,
                    page: 1,
                    limit: 1, // Just get the most recent message
                  }
                },
                fetchPolicy: "network-only"
              });

              // If messages exist, update the lastMessageAt time
              const messages = messageData?.getTicketMessages?.messages || [];
              if (messages.length > 0) {
                // Messages are already sorted newest first
                latestTicket = {
                  ...latestTicket,
                  lastMessageAt: messages[0].createdAt
                };
              }
            } catch (error) {
              console.log("Error fetching messages for ticket:", error);
            }
          }
        }
      }

      return {
        user,
        latestTicket,
        lastUpdated: Date.now()
      };
    } catch (error) {
      console.error("Error fetching user ticket:", error);
      return null;
    }
  };

  // Fetch latest tickets for specific users
  const fetchLatestUserTickets = async (userIds: string[] = []) => {
    if (userIds.length === 0) return;

    try {
      const promises = userIds.map(userId => fetchUserLatestTicket(userId));
      const results = await Promise.all(promises);

      // Filter out null results
      const validResults = results.filter(Boolean) as UserWithLatestTicket[];

      // Update the users with tickets array, replacing only the updated users
      setUsersWithTickets(prevUsers => {
        const updatedUsers = [...prevUsers];

        validResults.forEach(newUserData => {
          const existingIndex = updatedUsers.findIndex(u => u.user._id === newUserData.user._id);

          if (existingIndex >= 0) {
            // Replace existing user data
            updatedUsers[existingIndex] = newUserData;
          } else {
            // Add new user data
            updatedUsers.push(newUserData);
          }
        });

        // Apply consistent sorting
        return sortUsersByLatestActivity(updatedUsers);
      });
    } catch (error) {
      console.error("Error fetching latest user tickets:", error);
    }
  };

  // Initial fetch for all users' latest tickets
  const fetchAllUsersLatestTickets = useCallback(async (firstLoad: boolean = false) => {
    if (usersLoading || !users.length) return;

    try {
      // For each user, fetch their tickets to find the most recent one
      const userTicketsPromises = users.map(async (user: IUser) => {
        return fetchUserLatestTicket(user._id);
      });

      // Wait for all requests to complete
      const results = await Promise.all(userTicketsPromises);

      // Filter out null results
      const validResults = results.filter(Boolean) as UserWithLatestTicket[];

      // Apply consistent sorting
      const sortedResults = sortUsersByLatestActivity(validResults);

      setUsersWithTickets(sortedResults);

      // Auto-select the first user if none is selected
      if (!selectedUserId && sortedResults.length > 0) {
        setSelectedUserId(sortedResults[0].user._id);
      }

      // On first load, mark as loaded
      if (firstLoad && !initialDataLoaded.current) {
        initialDataLoaded.current = true;
      }
    } catch (error) {
      console.error("Error fetching all user tickets:", error);
    }
  }, [users, usersLoading, selectedUserId, client]);

  // Load initial data
  useEffect(() => {
    if (!usersLoading && users.length > 0 && !initialDataLoaded.current) {
      fetchAllUsersLatestTickets(true);
    }
  }, [usersLoading, users, fetchAllUsersLatestTickets]);

  // Setup polling for updates
  useEffect(() => {
    // Define the polling function
    const pollForUpdates = async () => {
      // Only poll if we have initial data and the component is mounted
      if (initialDataLoaded.current && users.length > 0) {
        const now = Date.now();

        // Only poll if it's been at least 15 seconds since the last poll
        if (now - lastPolledAt.current >= 15000) {
          lastPolledAt.current = now;

          // Poll for fresh users
          await refetchUsers();

          // Fetch latest tickets for all users but don't show loading state
          fetchAllUsersLatestTickets();

          // If a user is selected, also refresh their tickets
          if (selectedUserId) {
            refetchTickets();
          }
        }
      }
    };

    // Set up the polling interval (every 30 seconds)
    pollingIntervalRef.current = setInterval(pollForUpdates, 30000);

    // Cleanup the interval when the component unmounts
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [refetchUsers, users, selectedUserId, refetchTickets, fetchAllUsersLatestTickets]);

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
      if (selectedUserId) {
        fetchLatestUserTickets([selectedUserId]);
      }
    }, 300);
  };

  // Handle send message
  const handleSendMessage = (message: string) => {
    if (!selectedTicketId || isSendingMessage) return;

    createMessage({
      variables: {
        messageInput: {
          content: message,
          ticket: selectedTicketId
        }
      }
    });
  };

  // Handle status change
  const handleStatusChange = (ticketId: string, newStatus: string) => {
    if (isUpdatingStatus) return;

    updateTicketStatus({
      variables: {
        input: {
          ticketId,
          status: newStatus
        }
      }
    });
  };

  // Determine if we're loading - only show loading state on first load
  const isLoading = usersLoading && !initialDataLoaded.current;

  return (
    <div className="flex flex-grow flex-col overflow-hidden sm:flex-row">
      {/* Left panel - Users list */}
      <div
        className={`w-full overflow-y-auto border-gray-200 border dark:border-dark-600 bg-white dark:bg-dark-950 sm:w-1/3 ${activeTab === 'tickets' ? '' : 'hidden sm:block'
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
            <div className="p-4 text-center text-red-500">Error loading users</div>
          ) : usersWithTickets.length > 0 ? (
            usersWithTickets.map(({ user, latestTicket }: UserWithLatestTicket) => (
              <UserTicketCard
                key={user._id}
                user={user}
                latestTicket={latestTicket}
                isSelected={selectedUserId === user._id}
                onClick={() => handleUserSelect(user._id)}
                formatDate={formatDate}
              />
            ))
          ) : (
            <NoData message={t('no_user_found')} />
          )}
        </div>
      </div>

      {/* Right panel - Tickets list */}
      <div
        className={`flex-1 overflow-y-auto border-l border-gray-200 dark:border-dark-600 px-2 ${activeTab === 'chats' ? '' : 'hidden sm:block'
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
                  label={users.find((u: IUser) => u._id === selectedUserId)?.name || 'User'}
                  className="w-full"
                />
              )}
            </div>
          </div>
        </div>

        {/* Tickets list */}
        <div className="pb-16">
          {!selectedUserId ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-gray-500 dark:text-white">{t('select_a_user_to_view_tickets')}</p>
            </div>
          ) : showTicketSkeleton || (ticketsLoading && !sortedTickets.length) ? (
            <TicketCardSkeleton count={3} />
          ) : ticketsError ? (
            <div className="p-4 text-center text-red-500">Error loading tickets</div>
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
              <p className="text-gray-500">{t('No tickets found for this user')}</p>
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