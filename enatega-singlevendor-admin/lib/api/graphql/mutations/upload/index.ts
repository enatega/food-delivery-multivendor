import { gql } from '@apollo/client';

export const UPLOAD_IMAGE_TO_S3 = gql`
  mutation UploadImageToS3($image: String!, $publicMedia: Boolean) {
    uploadImageToS3(image: $image, publicMedia: $publicMedia) {
      imageUrl
    }
  }
`;
