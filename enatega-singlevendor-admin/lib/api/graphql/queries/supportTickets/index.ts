// Path: /lib/api/graphql/queries/supportTickets/index.ts

import { gql } from '@apollo/client';

// Get users who have support tickets WITH their latest ticket info
export const GET_TICKET_USERS_WITH_LATEST = gql`
  query GetTicketUsersWithLatest($input: FiltersInput) {
    getTicketUsersWithLatest(input: $input) {
      users {
        _id
        name
        email
        phone
        isActive
        userType
        latestTicket {
          _id
          title
          description
          status
          category
          orderId
          otherDetails
          createdAt
          updatedAt
        }
      }
      docsCount
      totalPages
      currentPage
    }
  }
`;

// Original queries unchanged
export const GET_TICKET_USERS = gql`
  query GetTicketUsers($input: FiltersInput) {
    getTicketUsers(input: $input) {
      users {
        _id
        name
        email
        phone
        isActive
        userType
      }
      docsCount
      totalPages
      currentPage
    }
  }
`;

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