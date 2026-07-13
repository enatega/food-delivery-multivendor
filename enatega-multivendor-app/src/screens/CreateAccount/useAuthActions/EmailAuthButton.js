import React from 'react'
import FdEmailBtn from '../../../ui/FdSocialBtn/FdEmailBtn/FdEmailBtn'

const EmailAuthButton = ({ loading, loginButton, loginButtonSetter, navigateToLogin }) => {
  return (
    <FdEmailBtn
      loadingIcon={loading && loginButton === 'Email'}
      onPress={() => {
        loginButtonSetter('Email')
        navigateToLogin()
      }}
    />
  )
}

export default EmailAuthButton
