import { useMutation, gql } from '@apollo/client'
import { muteRingOrder, orders } from '../../apollo'

const MUTE_RING_ORDER = gql`
  ${muteRingOrder}
`
const ORDERS = gql`
  ${orders}
`
export default function useOrderRing() {
  const [mutate, { loading }] = useMutation(MUTE_RING_ORDER, {
    refetchQueries: [ORDERS]
  })
  const muteRing = id => {
    mutate({ variables: { orderId: id } })
  }
  return { loading, muteRing }
}
