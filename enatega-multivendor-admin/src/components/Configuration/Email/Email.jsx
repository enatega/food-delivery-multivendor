import React, { useRef, useState, useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../../constraints/constraints'
import { saveEmailConfiguration } from '../../../apollo'
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
import {
  Box,
  Switch,
  Typography,
  Input,
  Button,
  Grid,
  Alert,
  Checkbox
} from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
const SAVE_EMAIL_CONFIGURATION = gql`
  ${saveEmailConfiguration}
`

function Email(props) {
  const { t } = props
  const formRef = useRef()
  const email = props.email || ''
  const password = props.password || ''
  const emailName = props.emailName || ''
  const [emailError, emailErrorSetter] = useState(null)
  const [passwordError, passwordErrorSetter] = useState(null)
  const [emailNameError, emailNameErrorSetter] = useState(null)
  const [enableEmail, setEnabaleEmail] = useState(!!props.enabled)
  const [showPassword, setShowPassword] = useState(false)
  //const [isEndAdornmentEnabled, setIsEndAdornmentEnabled] = useState(false);
  const [mutate, { loading }] = useMutation(SAVE_EMAIL_CONFIGURATION)

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }
  const validateInput = () => {
    let emailResult = true
    let passwordResult = true
    let emailNameResult = true
    emailResult = !validateFunc(
      { email: formRef.current['input-email'].value },
      'email'
    )
    emailNameResult = !validateFunc(
      { email: formRef.current['input-emailName'].value },
      'emailName'
    )
    passwordResult = !validateFunc(
      { password: formRef.current['input-password'].value },
      'password'
    )
    emailErrorSetter(emailResult)
    passwordErrorSetter(passwordResult)
    emailNameErrorSetter(emailNameResult)
    return emailResult && passwordResult && emailNameResult
  }
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const [successMessage, setSuccessMessage] = useState('')
  const handleSuccess = message => {
    setSuccessMessage(message)
  }
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSuccessMessage('')
    }, 3000)

    return () => clearTimeout(timeoutId)
  }, [successMessage, setSuccessMessage])
  const [errorMessage, setErrorMessage] = useState('')
  const handleError = error => {
    setErrorMessage('An error occurred while saving configuration.')
    console.error('Mutation error:', error)
  }
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setErrorMessage('')
    }, 3000)

    return () => clearTimeout(timeoutId)
  }, [errorMessage, setErrorMessage])

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            NodeMailer Email
          </Typography>
        </Box>
        <Box ml={20} mt={1}>
          <label>{enableEmail ? t('Disable') : t('Enable')}</label>
          <Switch
            defaultChecked={enableEmail}
            value={enableEmail}
            onChange={e => setEnabaleEmail(e.target.checked)}
            id="input-available"
            name="input-available"
            style={{ color: 'black' }}
          />
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Grid container spacing={2}>
            {/* First Row */}
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography className={classes.labelText}>
                  {t('Email')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  id="input-email"
                  name="input-email"
                  placeholder={t('PHMail')}
                  type="text"
                  defaultValue={email}
                  onBlur={event =>
                    onBlur(emailErrorSetter, 'email', event.target.value)
                  }
                  disableUnderline
                  className={[
                    globalClasses.input,
                    emailError === false
                      ? globalClasses.inputError
                      : emailError === true
                      ? globalClasses.inputSuccess
                      : ''
                  ]}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography className={classes.labelText}>
                  {t('EmailName')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  id="input-emailName"
                  name="input-emailName"
                  placeholder={t('PHEnatega')}
                  type="text"
                  defaultValue={emailName}
                  onBlur={event =>
                    onBlur(
                      emailNameErrorSetter,
                      'emailName',
                      event.target.value
                    )
                  }
                  disableUnderline
                  className={[
                    globalClasses.input,
                    emailNameError === false
                      ? globalClasses.inputError
                      : emailNameError === true
                      ? globalClasses.inputSuccess
                      : ''
                  ]}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography className={classes.labelText}>
                  {t('Password')}
                </Typography>
                <Input
                  style={{ marginTop: -1 }}
                  id="input-password"
                  name="input-password"
                  placeholder={t('PHFood')}
                  type={showPassword ? 'text' : 'password'}
                  defaultValue={password}
                  onBlur={event =>
                    onBlur(passwordErrorSetter, 'password', event.target.value)
                  }
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
                      {false && (
                        <Checkbox
                          checked={showPassword}
                          onChange={() => setShowPassword(!showPassword)}
                          color="primary"
                          icon={<VisibilityOffIcon />}
                          checkedIcon={<VisibilityIcon />}
                        />
                      )}
                    </InputAdornment>
                  }
                />
              </Box>
            </Grid>
          </Grid>
          <Box>
            <Button
              className={globalClasses.button}
              disabled={loading}
              onClick={e => {
                e.preventDefault()
                if (validateInput() && !loading) {
                  mutate({
                    variables: {
                      configurationInput: {
                        email: formRef.current['input-email'].value,
                        emailName: formRef.current['input-emailName'].value,
                        password: formRef.current['input-password'].value,
                        enableEmail: enableEmail
                      }
                    },
                    onCompleted: data => {
                      handleSuccess('Configuration saved successfully!')
                    },
                    onError: error => {
                      handleError(error)
                    }
                  })
                }
              }}>
              {t('Save')}
            </Button>
          </Box>
          <Box mt={2}>
            {successMessage && (
              <Alert
                className={globalClasses.alertSuccess}
                variant="filled"
                severity="success">
                {successMessage}
              </Alert>
            )}
            {errorMessage && (
              <Alert
                className={globalClasses.alertError}
                variant="filled"
                severity="error">
                {errorMessage}
              </Alert>
            )}
          </Box>
        </form>
      </Box>
    </Box>
  )
}
export default withTranslation()(Email)
