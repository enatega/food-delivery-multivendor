import React, { useState, useRef } from 'react'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../constraints/constraints'
import { withTranslation } from 'react-i18next'
import { vendorResetPassword } from '../../apollo'
import { Box, Typography, Input, Alert, Button } from '@mui/material'
import useStyles from '../Configuration/styles'
import useGlobalStyles from '../../utils/globalStyles'
const CHANGE_PASSWORD = gql`
  ${vendorResetPassword}
`

function ResetPassword(props) {
  const { t } = props
  const formRef = useRef()
  const [passError, passErrorSetter] = useState(null)
  const [confirmPassError, confirmPassErrorSetter] = useState(null)
  const [mainError, mainErrorSetter] = useState('')
  const [success, successSetter] = useState('')

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }

  const onSubmitValidaiton = () => {
    const oldPassword = !validateFunc(
      { password: formRef.current['input-oldPassword'].value },
      'password'
    )
    const newPassword = !validateFunc(
      { password: formRef.current['input-newPassword'].value },
      'password'
    )
    passErrorSetter(oldPassword)
    confirmPassErrorSetter(newPassword)

    return oldPassword && newPassword
  }
  const onCompleted = data => {
    const message = t('PasswordChangedSuccessfully')
    mainErrorSetter('')
    successSetter(message)
    setTimeout(hideAlert, 5000)
  }
  const onError = ({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      mainErrorSetter(graphQLErrors[0].message)
    }
    if (networkError) {
      mainErrorSetter(networkError.result.errors[0].message)
    }
    successSetter('')
    setTimeout(hideAlert, 5000)
  }
  const hideAlert = () => {
    mainErrorSetter('')
    successSetter('')
  }
  const [mutate] = useMutation(CHANGE_PASSWORD, {
    onError,
    onCompleted
  })

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            {t('ResetPassword')}
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box className={globalClasses.flexRow}>
            <Input
              id="input-oldPassword"
              name="input-oldPassword"
              placeholder={t('Password')}
              maxLength="30"
              type="password"
              defaultValue=""
              onBlur={event => {
                onBlur(passErrorSetter, 'password', event.target.value)
              }}
              disableUnderline
              className={[
                globalClasses.input,
                passError === false
                  ? globalClasses.inputError
                  : passError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}
            />
          </Box>
          <Box className={globalClasses.flexRow}>
            <Input
              id="input-newPassword"
              name="input-newPassword"
              placeholder={t('ConfirmPassword')}
              maxLength="30"
              type="password"
              defaultValue=""
              onBlur={event => {
                onBlur(confirmPassErrorSetter, 'password', event.target.value)
              }}
              disableUnderline
              className={[
                globalClasses.input,
                confirmPassError === false
                  ? globalClasses.inputError
                  : confirmPassError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}
            />
          </Box>
          <Box>
            <Button
              className={globalClasses.button}
              onClick={async e => {
                e.preventDefault()
                if (onSubmitValidaiton()) {
                  mutate({
                    variables: {
                      oldPassword: formRef.current['input-oldPassword'].value,
                      newPassword: formRef.current['input-newPassword'].value
                    }
                  })
                }
              }}>
              {t('Reset')}
            </Button>
          </Box>
        </form>
        <Box mt={2}>
          {success && (
            <Alert
              className={globalClasses.alertSuccess}
              variant="filled"
              severity="success">
              Success
            </Alert>
          )}
          {mainError && (
            <Alert
              className={globalClasses.alertError}
              variant="filled"
              severity="error">
              Error
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default withTranslation()(ResetPassword)
