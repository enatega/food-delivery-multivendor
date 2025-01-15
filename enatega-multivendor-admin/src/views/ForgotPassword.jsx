import React, { useRef, useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import { resetPassword } from '../apollo'
import { validateFunc } from '../constraints/constraints'
import useStyles from '../components/Configuration/styles'
import useGlobalStyles from '../utils/globalStyles'
import { Box, Typography, Input, Alert, Button, Checkbox } from '@mui/material'
import { withTranslation } from 'react-i18next'
import InputAdornment from '@mui/material/InputAdornment'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const RESET_PASSWORD = gql`
  ${resetPassword}
`
const ResetPassword = props => {
  const { t } = props
  const formRef = useRef()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onBlur = (event, field) => {
    if (field === 'password') {
      setPasswordError(!validateFunc({ password: password }, 'password'))
    } else if (field === 'confirmPassword') {
      setConfirmPasswordError(
        !validateFunc(
          { confirmPassword: confirmPassword, password: password },
          'confirmPassword'
        )
      )
    }
  }
  const hideAlert = () => {
    passwordError('')
    confirmPasswordError('')
  }
  const validate = () => {
    const confirmPasswordErrorDisplay = !validateFunc(
      { password: password, confirmPassword: confirmPassword },
      'confirmPassword'
    )
    const passwordErrorDisplay = !validateFunc(
      { password: password },
      'password'
    )
    setConfirmPasswordError(confirmPasswordErrorDisplay)
    setPasswordError(passwordErrorDisplay)
    return confirmPasswordErrorDisplay && passwordErrorDisplay
  }
  const onCompleted = data => {
    setConfirmPasswordError(null)
    setPasswordError(null)
    setSuccess(t('PasswordUpdated'))
    setTimeout(hideAlert, 5000)
  }
  const onError = error => {
    setConfirmPasswordError(null)
    setPasswordError(null)
    setError(error.networkError.result.errors[0].message)
    setTimeout(hideAlert, 5000)
  }
  const [mutate] = useMutation(RESET_PASSWORD, { onError, onCompleted })

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pt: 20,
        pb: 20
      }}>
      <Box
        container
        sx={{ width: { xs: '80%', md: '50%' } }}
        className={classes.container}>
        <Box className={classes.flexRow}>
          <Box item className={classes.heading}>
            <Typography variant="h6" className={classes.text}>
              {t('ForgotPassword')}
            </Typography>
          </Box>
        </Box>

        <Box className={classes.form}>
          <form ref={formRef}>
            <Box className={globalClasses.flexRow}>
              <Input
                id="input-password"
                name="input-password"
                value={password}
                onChange={event => {
                  setPassword(event.target.value)
                }}
                onBlur={event => {
                  onBlur(event, 'password')
                }}
                placeholder={t('Password')}
                type={showPassword ? 'text' : 'password'}
                disableUnderline
                className={[
                  globalClasses.input,
                  passwordError === false
                    ? globalClasses.inputError
                    : passwordError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
                endAdornment={
                  <InputAdornment position="end">
                    <Checkbox
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                      color="primary"
                      icon={<VisibilityOffIcon />}
                      checkedIcon={<VisibilityIcon />}
                    />
                  </InputAdornment>
                }
              />
            </Box>
            <Box className={globalClasses.flexRow}>
              <Input
                id="input-confirm-password"
                name="input-confirm-password"
                value={confirmPassword}
                type={showConfirmPassword ? 'text' : 'password'}
                onChange={event => {
                  setConfirmPassword(event.target.value)
                }}
                onBlur={event => {
                  onBlur(event, 'confirmPassword')
                }}
                placeholder={t('ConfirmPassword')}
                disableUnderline
                className={[
                  globalClasses.input,
                  confirmPasswordError === false
                    ? globalClasses.inputError
                    : confirmPasswordError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
                endAdornment={
                  <InputAdornment position="end">
                    <Checkbox
                      checked={showConfirmPassword}
                      onChange={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      color="primary"
                      icon={<VisibilityOffIcon />}
                      checkedIcon={<VisibilityIcon />}
                    />
                  </InputAdornment>
                }
              />
            </Box>
            <Box>
              <Button
                className={globalClasses.button}
                onClick={() => {
                  setConfirmPasswordError(null)
                  setPasswordError(null)
                  setError(null)
                  setSuccess(null)
                  const params = new URLSearchParams(props.location.search)
                  if (validate() && params.get('reset')) {
                    mutate({
                      variables: {
                        password: password,
                        token: params.get('reset')
                      }
                    })
                      .then(response => {
                        console.log('Mutation successful:', response)
                      })
                      .catch(error => {
                        console.error('Mutation error:', error.message)
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
                {success}
              </Alert>
            )}
            {error && (
              <Alert
                className={globalClasses.alertError}
                variant="filled"
                severity="error">
                {error}
              </Alert>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default withTranslation()(ResetPassword)
