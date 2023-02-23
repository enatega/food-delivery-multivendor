import { useContext, useState, useEffect, useRef } from 'react'
import { TabsContext } from '../../context/tabs'
import { useNavigation } from '@react-navigation/native'
import { gql, useMutation, useSubscription } from '@apollo/client'
import { assignOrder } from '../../apollo/mutations'
import { FlashMessage } from '../FlashMessage/FlashMessage'
import { subscriptionOrder } from '../../apollo/subscriptions'
import { getRemainingAcceptingTime } from '../../utilities/utils'
import UserContext from '../../context/user'
const ASSIGN_ORDER = gql`
  ${assignOrder}
`

const useOrder = order => {
  const { active } = useContext(TabsContext)
  const { refetchAssigned } = useContext(UserContext)
  const navigation = useNavigation()
  const secondsRef = useRef(0)
  const minutesRef = useRef(2)
  const timerRef = useRef(null)
  const [time, setTime] = useState('00:00')

  useEffect(() => {
    const remainingSeconds = getRemainingAcceptingTime(order?.acceptedAt)
    if (remainingSeconds > 0) {
      minutesRef.current = Math.floor(remainingSeconds / 60)
      secondsRef.current = remainingSeconds % 60
      timerRef.current = setInterval(() => {
        if (secondsRef.current > 0) {
          secondsRef.current = secondsRef.current - 1
        }
        if (secondsRef.current < 1) {
          if (minutesRef.current > 0) {
            minutesRef.current = minutesRef.current - 1
            secondsRef.current = 59
          } else {
            timerRef.current && clearInterval(timerRef.current)
            timerRef.current = null
            refetchAssigned()
          }
        }
        if (secondsRef.current > 0 && secondsRef.current < 10) {
          setTime(`0${minutesRef.current}:0${secondsRef.current}`)
        } else {
          setTime(`0${minutesRef.current}:${secondsRef.current}`)
        }
      }, 1000)
    }
    return () => timerRef.current && clearInterval(timerRef.current)
  }, [])

  useSubscription(
    gql`
      ${subscriptionOrder}
    `,
    { variables: { id: order?._id }, skip: !order }
  )
  const [mutateAssignOrder, { loading: loadingAssignOrder }] = useMutation(
    ASSIGN_ORDER,
    {
      onCompleted,
      onError
    }
  )

  async function onCompleted(result) {
    if (result.assignOrder) {
      console.log(result.assignOrder)
    }
  }

  function onError({ graphQLErrors, networkError }) {
    let message = 'Unknown error occured'
    if (networkError) message = 'Internal Server Error'
    if (graphQLErrors) message = graphQLErrors.map(o => o.message).join(', ')

    FlashMessage({ message: message })
  }

  return {
    active,
    navigation,
    time,
    mutateAssignOrder,
    loadingAssignOrder
  }
}

export default useOrder
