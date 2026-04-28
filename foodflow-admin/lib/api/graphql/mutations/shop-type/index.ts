import { gql } from '@apollo/client';

export const CREATE_SHOP_TYPE = gql`
  mutation CreateShopType($dto: CreateShopTypeInput) {
    createShopType(dto: $dto) {
      _id
      name
      image
      isActive
    }
  }
`;
export const UPDATE_SHOP_TYPE = gql`
  mutation UpdateShopType($dto: UpdateShopTypeInput) {
    updateShopType(dto: $dto) {
      _id
      name
      image
      isActive
    }
  }
`;
export const DELETE_SHOP_TYPE = gql`
  mutation DeleteShopType($id: String!, $type: DeleteTypeEnum) {
    deleteShopType(id: $id, type: $type) {
      _id
      name
      image
      isActive
    }
  }
`;
