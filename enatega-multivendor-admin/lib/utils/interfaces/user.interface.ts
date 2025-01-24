export interface IUserReponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Array<{
    location: {
      coordinates: [string, string];
      __typename: 'Point';
    };
    deliveryAddress: string;
    __typename: 'Address';
  }>;
  __typename: 'User';
}

export interface IUsersResponseGraphQL {
  users: IUserReponse[];
}
