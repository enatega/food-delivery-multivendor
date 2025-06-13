import { gql } from "@apollo/client";

export const GET_COUNTRIES = gql`
  query getCountries {
   getCountries{
      _id
      name
      flag
    }
  }
`;

export const GET_CITIES=gql`
query getCitiesByCountry($id: ID){
  getCitiesByCountry(id:$id){
  id,
  name,
  cities{
  id,
  name,
  latitude,
  longitude,
  }
  }
  
}
`
