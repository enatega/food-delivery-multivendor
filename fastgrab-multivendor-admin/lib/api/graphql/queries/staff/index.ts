import { gql } from '@apollo/client';

export const GET_STAFFS = gql`
  query staffs {
    staffs {
      _id
      name
      email
      plainPassword
      password
      phone
      # vehicleType
      isActive
      permissions
    }
  }
`;
