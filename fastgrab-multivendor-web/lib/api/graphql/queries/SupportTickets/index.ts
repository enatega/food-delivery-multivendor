import { gql } from '@apollo/client';

export const GET_USER_SUPPORT_TICKETS = gql`
  query GetSingleUserSupportTickets($input: SingleUserSupportTicketsInput!) {
    getSingleUserSupportTickets(input: $input) {
      tickets {
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
      docsCount
      totalPages
      currentPage
    }
  }
`;

export const GET_SINGLE_SUPPORT_TICKET = gql`
  query GetSingleSupportTicket($ticketId: ID!) {
    getSingleSupportTicket(ticketId: $ticketId) {
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
        phone
      }
    }
  }
`;

export const GET_TICKET_MESSAGES = gql`
  query GetTicketMessages($input: TicketMessagesInput!) {
    getTicketMessages(input: $input) {
      messages {
        _id
        content
        senderType
        isRead
        createdAt
        updatedAt
      }
      ticket {
        _id
        title
        status
        user {
          _id
          name
        }
      }
      page
      totalPages
      docsCount
    }
  }
`;