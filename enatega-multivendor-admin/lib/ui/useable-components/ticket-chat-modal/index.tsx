import { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_TICKET_MESSAGES,
  GET_SINGLE_SUPPORT_TICKET,
} from '@/lib/api/graphql/queries/supportTickets';
import {
  CREATE_TICKET_MESSAGE,
  UPDATE_TICKET_STATUS,
} from '@/lib/api/graphql/mutations/supportTickets';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import useToast from '@/lib/hooks/useToast';
import ChatSkeleton from '../custom-skeletons/chat-skeleton';

interface ITicketChatModalProps {
  visible: boolean;
  onHide: () => void;
  ticketId: string;
  onSendMessage?: (message: string) => void;
  onStatusChange?: (ticketId: string, status: string) => void;
  isAdmin?: boolean;
}

export default function TicketChatModal({
  visible,
  onHide,
  ticketId,
  onSendMessage,
  onStatusChange,
  isAdmin = false,
}: ITicketChatModalProps) {
  const { showToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [initialMessageSent, setInitialMessageSent] = useState<boolean>(false);

  // Create a polling interval reference
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch single ticket details
  const { data: ticketData, loading: ticketLoading } = useQuery(
    GET_SINGLE_SUPPORT_TICKET,
    {
      variables: { ticketId },
      skip: !visible || !ticketId,
      fetchPolicy: 'network-only',
    }
  );

  // Fetch ticket messages with polling
  const { data, loading, error, refetch, startPolling, stopPolling } = useQuery(
    GET_TICKET_MESSAGES,
    {
      variables: {
        input: {
          ticket: ticketId,
          page: 1,
          limit: 50,
        },
      },
      skip: !visible || !ticketId,
      fetchPolicy: 'network-only',
      pollInterval: 0, // We'll manually control polling
      onError: (error) => {
        showToast({
          type: 'error',
          title: 'Error',
          message: error.message || 'Failed to load messages',
        });
      },
    }
  );

  // Send message mutation (only used when custom onSendMessage not provided)
  const [sendMessage] = useMutation(CREATE_TICKET_MESSAGE, {
    onCompleted: () => {
      setMessage('');
      setIsSending(false);
      refetch(); // Immediately refetch messages after sending
    },
    onError: (error) => {
      setIsSending(false);
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to send message',
      });
    },
  });

  // Update ticket status mutation
  const [updateTicketStatus] = useMutation(UPDATE_TICKET_STATUS, {
    onCompleted: () => {
      refetch();
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Ticket status updated successfully',
      });
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update ticket status',
      });
    },
  });

  // Start polling when modal is visible
  useEffect(() => {
    if (visible && ticketId) {
      // Start polling for messages every 3 seconds
      startPolling(3000);

      // Custom manual polling implementation as backup
      pollingIntervalRef.current = setInterval(() => {
        refetch();
      }, 5000); // Every 5 seconds as backup
    } else {
      // Stop polling when modal is closed
      stopPolling();

      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      stopPolling();
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [visible, ticketId, startPolling, stopPolling, refetch]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && visible) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data, visible]);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(parseInt(timestamp));
      return (
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
        ' ' +
        date.toLocaleDateString()
      );
    } catch (error) {
      return 'unknown time';
    }
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);

    if (onSendMessage) {
      // Use the custom handler if provided
      onSendMessage(message.trim());
      setMessage('');
      setIsSending(false);

      // Force refetch after a small delay to get the updated messages
      setTimeout(() => {
        refetch();
      }, 500);
    } else {
      // Use the default mutation
      sendMessage({
        variables: {
          messageInput: {
            content: message.trim(),
            ticket: ticketId,
          },
        },
      });
    }
  };

  // Handle enter key for sending message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle status change
  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(ticketId, newStatus);
    } else {
      updateTicketStatus({
        variables: {
          input: {
            ticketId,
            status: newStatus,
          },
        },
      });
    }
  };

  const messages = data?.getTicketMessages?.messages || [];
  const ticket =
    data?.getTicketMessages?.ticket || ticketData?.getSingleSupportTicket;
  const ticketDescription =
    ticketData?.getSingleSupportTicket?.description || '';
  const isClosed = ticket?.status === 'closed';

  // Status options for dropdown
  const statusOptions = [
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'inProgress' },
    { label: 'Closed', value: 'closed' },
  ];

  // Get ticket title
  const getTicketTitle = () => {
    if (!ticket) return 'Support Chat';

    if (ticket.category === 'order related' && ticket.orderId) {
      return `Order Issue - ${ticket.orderId}`;
    }

    return ticket.title;
  };

  return (
    <Dialog
      visible={visible}
      onHide={() => {
        // Stop polling before closing
        stopPolling();
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        onHide();
      }}
      style={{ width: '500px' }}
      className="p-0 m-0"
      contentClassName="p-0"
      showHeader={false}
      modal
      resizable={false}
      draggable={false}
      closable={false}
      closeOnEscape
    >
      <div className="flex flex-col md:h-[600px] h-[500px]">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#1a1a1a] text-white p-4">
          <div className="flex-1">
            <h3 className="font-medium">{getTicketTitle()}</h3>
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <Dropdown
                  value={ticket?.status}
                  options={statusOptions}
                  onChange={(e) => handleStatusChange(e.value)}
                  className="p-dropdown-sm mt-1"
                  style={{ fontSize: '0.8rem' }}
                />
              ) : (
                <span
                  className={`text-xs ${
                    ticket?.status === 'open'
                      ? 'text-blue-300'
                      : ticket?.status === 'inProgress'
                        ? 'text-yellow-300'
                        : 'text-gray-300'
                  }`}
                >
                  {ticket?.status === 'inProgress'
                    ? 'In Progress'
                    : ticket?.status?.charAt(0).toUpperCase() +
                      ticket?.status?.slice(1)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              // Stop polling before closing
              stopPolling();
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
              }
              onHide();
            }}
            className="text-white hover:text-gray-300"
          >
            <span className="sr-only">Close</span>✕
          </button>
        </div>

        {/* Fixed Ticket Description Section (non-scrollable) */}
        {ticketDescription && (
          <div className="border-b border-gray-200 p-3 bg-gray-50">
            <div className="text-xs font-medium text-gray-500 mb-1">
              Ticket Description:
            </div>
            <p className="text-sm text-gray-700">{ticketDescription}</p>
            <div className="text-xs text-right mt-1 text-gray-500">
              {formatTimestamp(ticket?.createdAt || Date.now().toString())}
            </div>
          </div>
        )}

        {/* Messages Area (scrollable) */}
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          {loading || ticketLoading ? (
            <ChatSkeleton />
          ) : error ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-red-500">Failed to load messages</p>
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-4">
              {/* Messages in chronological order (oldest first) */}
              {[...messages].reverse().map((msg) => {
                // Skip messages that contain the ticket description
                if (msg.content.trim() === ticketDescription.trim()) {
                  return null;
                }
                
                // Normal message styling based on senderType
                const isAdminMessage = msg.senderType === 'admin';
                return (
                  <div
                    key={msg._id}
                    className={`rounded-lg p-3 max-w-[80%] ${
                      isAdminMessage
                        ? 'bg-green-500 text-white ml-auto'
                        : 'bg-gray-100 text-gray-800 mr-auto'
                    }`}
                  >
                    <p className="break-words">{msg.content}</p>
                    <div className="text-xs mt-1 text-right">
                      {formatTimestamp(msg.createdAt)}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">No messages yet</p>
            </div>
          )}
        </div>

        {/* Input Area - Only shown if the ticket is not closed */}
        {isClosed ? (
          <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
            <p className="text-gray-500">
              This ticket is closed. You cannot send new messages.
            </p>
          </div>
        ) : (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#5AC12F] resize-none"
                rows={2}
                disabled={isSending}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isSending}
                className={`bg-green-500 rounded-r-md p-2 text-white flex items-center justify-center ${
                  !message.trim() || isSending
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-green-600'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}