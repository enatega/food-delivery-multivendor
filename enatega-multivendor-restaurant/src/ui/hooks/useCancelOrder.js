import { useMutation, gql } from '@apollo/client'
import { cancelOrder } from '../../apollo'

export default function useCancelOrder() {
  const [mutateCancel, { loading, error }] = useMutation(
    gql`
      ${cancelOrder}
    `
  )
  const cancelOrderFunc = (_id, reason) => {
    mutateCancel({ variables: { _id, reason } })
  }
  return { loading, error, cancelOrder: cancelOrderFunc }
}
