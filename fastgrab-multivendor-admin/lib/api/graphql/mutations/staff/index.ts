import { gql } from '@apollo/client';

export const CREATE_STAFF = gql`
  mutation CreateStaff($staffInput: StaffInput!) {
    createStaff(staffInput: $staffInput) {
      _id
      name
      email
      password
      phone
      isActive
      permissions
      userType
    }
  }
`;

export const EDIT_STAFF = gql`
  mutation EditStaff($staffInput: StaffInput!) {
    editStaff(staffInput: $staffInput) {
      _id
      name
      email
      password
      phone
      isActive
      permissions
      userType
    }
  }
`;

export const DELETE_STAFF = gql`
  mutation DeleteStaff($id: String!) {
    deleteStaff(id: $id) {
      _id
    }
  }
`;
