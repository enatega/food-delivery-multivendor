import { useState, useRef, useContext } from 'react'
import { useMutation, gql, useQuery } from '@apollo/client'
import { FlashMessage } from '../../components'
import { login as loginQuery, defaultRestaurantCreds } from '../../apollo'
import { validateLogin } from '../validate'
import { AuthContext } from '../context'

export default function useLogin() {
  const [errors, setErrors] = useState()
  const { login } = useContext(AuthContext)
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const usernameRef = useRef()
  const passwordRef = useRef()
  const [mutate, { loading, error }] = useMutation(
    gql`
      ${loginQuery}
    `,
    { onCompleted, onError }
  )
  useQuery(gql`${defaultRestaurantCreds}`, { onCompleted, onError })
  function onCompleted({ restaurantLogin, lastOrderCreds }) {
    if (lastOrderCreds) {
      if (lastOrderCreds.restaurantUsername && lastOrderCreds.restaurantPassword) {
        setUserName(lastOrderCreds.restaurantUsername)
        setPassword(lastOrderCreds.restaurantPassword)
      }
    } else {
      login(restaurantLogin.token, restaurantLogin.restaurantId)
    }
  }

  function onError(error) {
    FlashMessage({ message: error ? error.message : null })
  }

  const isValid = async () => {
    // const username = await usernameRef.current
    // const password = await passwordRef.current
    const errors = validateLogin({ username, password })
    console.log(username + password)
    setErrors(errors)
    if (errors) return false
    return true
  }

  const onLogin = async () => {
    if (isValid()) {
      // const username = await usernameRef.current.value
      // const password = await passwordRef.current.value
      mutate({ variables: { username, password } })
    }
  }
  return {
    onLogin,
    isValid,
    loading,
    errors,
    error,
    usernameRef,
    passwordRef,
    setPassword,
    setUserName,
    username,
    password
  }
}
