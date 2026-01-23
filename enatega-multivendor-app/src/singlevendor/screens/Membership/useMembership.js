import { Alert } from 'react-native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ALL_SUBSCRIPTION_PLANS } from '../../apollo/queries'
import { useStripe } from '@stripe/stripe-react-native'
import { CREATE_SUBSCRIPTION, CANCEL_SUBSCRIPTION, UPDATE_SUBSCRIPTION } from '../../apollo/mutations'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import UserContext from '../../../context/User'

const useMembership = () => {
  const { refetchProfile, loadingProfile, profile } = useContext(UserContext)
  const { loading, data, error } = useQuery(GET_ALL_SUBSCRIPTION_PLANS)
  console.log("my data of membership", data)
  const [mutateSubscription, { loading: createSubscriptionLoading, error: mutateSubscriptionError }] = useMutation(CREATE_SUBSCRIPTION, {
    onCompleted: async (data) => {
      await refetchProfile()
      FlashMessage({ message: t(data?.createSubscription?.message) })
    },
    onError
  })

  const [mutateCancelSubscription, { loading: cancelSubscriptionLoading, error: mutateCancelSubscriptionError }] = useMutation(CANCEL_SUBSCRIPTION, {
    onCompleted: async (data) => {
      await refetchProfile()
      FlashMessage({ message: t(data?.cancelSubscription?.message) })
    },
    onError
  })

  const [mutateUpdateSubscription, { loading: updateSubscriptionLoading, error: mutateUpdateSubscriptionError }] = useMutation(UPDATE_SUBSCRIPTION, {
    onCompleted: async (data) => {
      await refetchProfile()
      FlashMessage({ message: t(data?.updateSubscription?.message) })
    },
    onError
  })

  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showCardModal, setShowCardModal] = useState(false)

  const activePlanId = profile?.stripe_plan_id

  const { createPaymentMethod } = useStripe()

  async function onError(error) {
    // Todo: can use flashmessage in future
    // FlashMessage({ message: t(error?.localizedMessage) ?? t('Something went wrong, please try again!') })
    Alert.alert(`${error?.code}`, `${error?.localizedMessage}`, [
      {
        text: 'Ok',
        onPress: () => { } // dismiss only
      }
    ])
  }
  const handleSubscribe = () => {
    if (selectedPlan) {
      setShowCardModal(true)
    }
  }

  const handleCancelSubscription = () => {
    Alert.alert('Subscription', 'Are you sure you want to cancel your active subscription', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => { } // dismiss only
      },
      {
        text: 'Yes',
        onPress: () =>
          mutateCancelSubscription({
            variables: {
              input: {
                newStripePriceId: null
              }
            }
          })
      }
    ])
  }

  const handleUpdateSubscription = () => {
    Alert.alert('Subscription', 'Are you sure you want to update your active subscription', [
      {
        text: 'Cancel',
        onPress: () => { } // dismiss only
      },
      {
        text: 'Yes',
        onPress: () =>
          mutateUpdateSubscription({
            variables: {
              input: {
                newStripePriceId: selectedPlan
              }
            }
          })
      }
    ])
  }

  const handleOnPay = async (update = false) => {
    setShowCardModal(false)
    if (update) {
      mutateUpdateSubscription({
        variables: {
          input: {
            newStripePriceId: selectedPlan
          }
        }
      })
      return
    }
    console.log('i am being called bro')
    const { paymentMethod, error } = await createPaymentMethod({
      paymentMethodType: 'Card'
    })
    if (error) {
      // Todo: can use flashmessage in future
      // FlashMessage({ message: t('Something went wrong, please try again!') })

      Alert.alert(`${error?.code}`, `${error?.localizedMessage}`, [
        {
          text: 'Ok',
          onPress: () => { } // dismiss only
        }
      ])
      return
    }

    if (paymentMethod && selectedPlan) {
      mutateSubscription({
        variables: {
          input: {
            stripePriceId: selectedPlan,
            paymentMethodId: paymentMethod?.id
          }
        }
      })
    }
  }

  return {
    data: data?.getAllSubscriptionPlans?.plans,
    error,
    loading: loading || createSubscriptionLoading || cancelSubscriptionLoading || loadingProfile || updateSubscriptionLoading,
    showCardModal,
    setShowCardModal,
    selectedPlan,
    setSelectedPlan,
    handleSubscribe,
    handleOnPay,
    handleCancelSubscription,
    activePlanId,
    handleUpdateSubscription,
    subscriptionError: mutateSubscriptionError || mutateUpdateSubscriptionError || mutateCancelSubscriptionError
  }
}

export default useMembership
