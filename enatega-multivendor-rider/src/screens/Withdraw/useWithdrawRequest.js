import { Dimensions } from 'react-native'
import { useContext, useState, useEffect } from 'react'

import { gql, useMutation } from '@apollo/client'
import { createWithdrawRequest } from '../../apollo/mutations'
import UserContext from '../../context/user'

import { FlashMessage } from '../../components/FlashMessage/FlashMessage'
import { MIN_WITHDRAW_AMOUNT } from '../../utilities/constants'

const WITHDRAW_REQUEST = gql`
  ${createWithdrawRequest}
`

export const useWithdrawRequest = () => {
  const [error, setError] = useState(false)
  const [amount, setAmount] = useState(0)
  const [requestSent, setRequestSent] = useState(false)
  const { height } = Dimensions.get('window')
  const { dataProfile } = useContext(UserContext)

  const [mutate, { loading, error: withdrawRequestError }] = useMutation(
    WITHDRAW_REQUEST,
    {
      onCompleted,
      onError
    }
  )
  useEffect(() => {
    if (withdrawRequestError) {
      setError(withdrawRequestError.message)
    }
  }, withdrawRequestError)
  function validateForm() {
    let result = true
    setError('')

    if (!amount) {
      setError('Amount is required!')
      result = false
    } else if (amount < MIN_WITHDRAW_AMOUNT) {
      setError(`Amount must be grater than ${MIN_WITHDRAW_AMOUNT}!`)
      result = false
    } else if (amount > dataProfile.rider.currentWalletAmount) {
      setError('Withdraw amount must be less than or equal to wallet amount!')
      result = false
    }
    return result
  }

  function onCompleted(data) {
    setRequestSent(true)
  }

  function onError(error) {
    console.log('error onError', error)
    FlashMessage({
      message: error.message
    })
  }

  function onSubmit() {
    if (validateForm()) {
      mutate({
        variables: {
          amount: parseFloat(amount)
        }
      })
    }
  }
  return {
    dataProfile,
    error,
    amount,
    setAmount,
    requestSent,
    height,
    loading,
    onSubmit
  }
}
