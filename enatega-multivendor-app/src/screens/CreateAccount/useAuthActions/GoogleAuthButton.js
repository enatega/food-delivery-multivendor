import React from 'react'
import FdGoogleBtn from '../../../ui/FdSocialBtn/FdGoogleBtn/FdGoogleBtn'

const GoogleAuthButton = ({ loading, loginButton, loginButtonSetter, signIn }) => {
  return (
    <FdGoogleBtn
      loadingIcon={loading && loginButton === 'Google'}
      disabled={loading && loginButton === 'Google'}
      onPressIn={() => loginButtonSetter('Google')}
      onPress={signIn}
    />
  )
}

export default GoogleAuthButton
