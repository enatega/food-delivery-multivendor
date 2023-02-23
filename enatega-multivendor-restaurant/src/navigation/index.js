import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import MainStack from './mainStack'
import AuthStack from './authStack'
import { AuthContext } from '../ui/context'

export default function index() {
  const { isLoggedIn } = useContext(AuthContext)
  return (
    <NavigationContainer>
      {isLoggedIn ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  )
}
