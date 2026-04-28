import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_TICKET_MESSAGES,
  GET_SINGLE_SUPPORT_TICKET,
} from "@/lib/api/graphql/queries/SupportTickets";
import { CREATE_TICKET_MESSAGE } from "@/lib/api/graphql/mutations/SupportTickets";
import { Dialog } from "primereact/dialog";
import useToast from "@/lib/hooks/useToast";
import ChatSkeleton from "../custom-skeletons/chat-skeleton";

interface ITicketChatModalProps {
  visible: boolean;
  onHide: () => void;
  ticketId: string;
}

export default function TicketChatModal({
  visible,
  onHide,
  ticketId,
}: ITicketChatModalProps) {
  const { showToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  
  // Create a polling interval reference
const pollingIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch single ticket details
  const { data: ticketData, loading: ticketLoading } = useQuery(
    GET_SINGLE_SUPPORT_TICKET,
    {
      variables: { ticketId },
      skip: !visible || !ticketId,
      fetchPolicy: "network-only",
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
        }
      },
      skip: !visible || !ticketId,
      fetchPolicy: "network-only",
      pollInterval: 0,
      onError: (error) => {
        showToast({
          type: "error",
          title: "Error",
          message: error.message || "Failed to load messages",
        });
      }
    }
  );

  // Send message mutation
  const [sendMessage] = useMutation(CREATE_TICKET_MESSAGE, {
    onCompleted: () => {
      setMessage("");
      setIsSending(false);
      refetch(); // Immediately refetch messages after sending
    },
    onError: (error) => {
      setIsSending(false);
      showToast({
        type: "error",
        title: "Error",
        message: error.message || "Failed to send message",
      });
    }
  });

  // Start polling when modal is visible
  useEffect(() => {
    if (visible && ticketId) {
      // Immediate fetch to get fresh data
      refetch();
      
      // Start polling for messages every 3 seconds
      startPolling(3000);
      
      // Additional interval as backup for polling
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
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data, visible]);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(parseInt(timestamp));
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
        ' ' + date.toLocaleDateString();
    } catch (error) {
      return "unknown time";
    }
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!message.trim() || isSending) return;
    
    setIsSending(true);
    
    sendMessage({
      variables: {
        messageInput: {
          content: message.trim(),
          ticket: ticketId
        }
      }
    });
  };
  
  // Handle enter key for sending message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const messages = data?.getTicketMessages?.messages || [];
  const ticket = data?.getTicketMessages?.ticket || ticketData?.getSingleSupportTicket;
  const isClosed = ticket?.status === 'closed';

  // Get ticket title
  const getTicketTitle = () => {
    if (!ticket) return "Support Chat";
    
    if (ticket.category === "order related" && ticket.orderId) {
      return `Order Issue - ${ticket.orderId}`;
    }
    
    return ticket.title;
  };

   // get the RTL direction
   const direction = document.documentElement.getAttribute("dir") || "ltr";

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
      style={{ width: "500px" }}
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
              <span
                className={`text-xs ${
                  ticket?.status === "open"
                    ? "text-blue-300"
                    : ticket?.status === "inProgress"
                      ? "text-yellow-300"
                      : "text-gray-300"
                }`}
              >
                {ticket?.status === "inProgress"
                  ? "In Progress"
                  : ticket?.status?.charAt(0).toUpperCase() +
                    ticket?.status?.slice(1)}
              </span>
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
        {ticketData?.getSingleSupportTicket?.description && (
          <div className="border-b border-gray-200 dark:border-gray-600 p-3 bg-gray-50 dark:text-white dark:bg-gray-700">
            <div className="text-xs font-medium text-gray-500 mb-1 dark:text-white">
              Ticket Description:
            </div>
            <p className="text-sm text-gray-700 dark:text-white">{ticketData.getSingleSupportTicket.description}</p>
            <div className="text-xs text-right mt-1 text-gray-500 dark:text-white">
              {formatTimestamp(ticket?.createdAt || Date.now().toString())}
            </div>
          </div>
        )}

        {/* Messages Area (scrollable) */}
        <div className="flex-1 p-4 overflow-y-auto bg-white dark:bg-gray-800 dark:text-white">
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
                // Skip messages that match description
                if (msg.content.trim() === ticketData?.getSingleSupportTicket?.description?.trim()) {
                  return null;
                }
                
                // User's own messages are green and on right, admin messages are gray on left
                const isUserMessage = msg.senderType === "user";
                return (
                  <div
                    key={msg._id}
                    className={`rounded-lg p-3 max-w-[80%] ${
                      isUserMessage
                        ? "bg-primary-color text-white ml-auto" 
                        : "bg-gray-100 text-gray-800 mr-auto"
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

        {/* Input Area */}
        {isClosed ? (
          <div className="p-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-800 dark:text-white text-center">
            <p className="text-gray-500">
              This ticket is closed. You cannot send new messages.
            </p>
          </div>
        ) : (
          <div className="p-4 border-t border-gray-200 bg-white dark:bg-gray-800 dark:text-white">
            <div className="flex gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 p-3 border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-color resize-none"
                rows={2}
                disabled={isSending}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isSending}
                className={`bg-primary-color ${direction === "rtl" ? "rounded-l-md" : "rounded-r-md"} p-2 text-white flex items-center justify-center ${
                  !message.trim() || isSending
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary-dark"
                }`}
              >
                {direction === "rtl" ? (
                  isSending ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
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
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                  )
                ) : isSending ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
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
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}