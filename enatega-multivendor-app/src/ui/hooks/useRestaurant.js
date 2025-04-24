import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { restaurant } from '../../apollo/queries'

const RESTAURANT = gql`
  ${restaurant}
`

export default function useRestaurant(id) {
  const skip = !id // don't run query if id is not provided

  const { data, refetch, networkStatus, loading, error } = useQuery(RESTAURANT, {
    variables: { id },
    fetchPolicy: 'network-only',
    skip
  })

  return { data, refetch, networkStatus, loading, error }
}
