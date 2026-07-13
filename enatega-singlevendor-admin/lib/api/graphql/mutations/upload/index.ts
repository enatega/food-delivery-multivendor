import { gql } from '@apollo/client';

export const UPLOAD_IMAGE_TO_S3 = gql`
  mutation UploadImageToS3($image: String!) {
    uploadImageToS3(image: $image) {
      imageUrl
    }
  }
`;