import { gql } from '@apollo/client';

export const CREATE_SUPPORT_TICKET = gql`
  mutation CreateSupportTicket($ticketInput: SupportTicketInput!) {
    createSupportTicket(ticketInput: $ticketInput) {
      _id
      title
      description
      status
      category
      orderId
      otherDetails
      createdAt
      updatedAt
      user {
        _id
        name
        email
      }
    }
  }
`;

export const CREATE_TICKET_MESSAGE = gql`
  mutation CreateMessage($messageInput: MessageInput!) {
    createMessage(messageInput: $messageInput) {
      _id
      content
      senderType
      isRead
      ticket
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TICKET_STATUS = gql`
  mutation UpdateSupportTicketStatus($input: UpdateSupportTicketInput!) {
    updateSupportTicketStatus(input: $input) {
      _id
      status
      updatedAt
    }
  }
`;