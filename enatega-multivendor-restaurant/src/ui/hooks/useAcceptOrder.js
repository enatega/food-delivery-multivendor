import { useMutation, gql } from '@apollo/client'

import { acceptOrder } from '../../apollo'

export default function useAcceptOrder() {
  const [mutateAccept, { loading, error }] = useMutation(
    gql`
      ${acceptOrder}
    `
  )
  const acceptOrderFunc = (_id, time) => {
    mutateAccept({ variables: { _id, time } })
  }

  return { loading, error, acceptOrder: acceptOrderFunc }
}
