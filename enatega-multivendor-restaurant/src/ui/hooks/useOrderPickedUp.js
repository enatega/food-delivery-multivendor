import { useMutation, gql } from '@apollo/client'
import { orderPickedUp } from '../../apollo'

export default function useOrderPickedUp() {
  const [mutatePickedUp, { loading, error }] = useMutation(
    gql`
      ${orderPickedUp}
    `
  )
  const pickedUpOrderFunc = _id => {
    mutatePickedUp({ variables: { _id } })
  }

  return { loading, error, pickedUp: pickedUpOrderFunc }
}
