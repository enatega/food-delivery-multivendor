import { gql } from '@apollo/client';

export const UPLOAD_TOKEN = gql`
  mutation UploadToken($id: String!, $pushToken: String!) {
    uploadToken(id: $id, pushToken: $pushToken) {
      _id
      pushToken
    }
  }
`;
