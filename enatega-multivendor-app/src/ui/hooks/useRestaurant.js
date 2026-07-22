import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { restaurant } from '../../apollo/queries'

export const RESTAURANT = gql`
  ${restaurant}
`

export default function useRestaurant(id) {
  const { data, refetch, networkStatus, loading, error } = useQuery(
    RESTAURANT,
    {
      variables: { id },
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first'
    }
  )
  return { data, refetch, networkStatus, loading, error }
}
