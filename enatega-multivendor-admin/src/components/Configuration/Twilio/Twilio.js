// TwilioConfiguration.jsx

import React, { useRef, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../../constraints/constraints'
import { saveTwilioConfiguration } from '../../../apollo'
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
import { Box, Switch, Typography, Input, Button } from '@mui/material'

const SAVE_TWILIO_CONFIGURATION = gql`
  ${saveTwilioConfiguration}
`

function TwilioConfiguration(props) {
  const formRef = useRef()
  const [twilioEnabled, setTwilioEnabled] = useState(!!props.twilioEnabled)
  const [twilioAccountSid] = useState(props.twilioAccountSid || '')
  const [twilioAuthToken] = useState(props.twilioAuthToken || '')
  const [twilioPhoneNumber] = useState(props.twilioPhoneNumber || '')

  const [accountSidError, setAccountSidError] = useState(null)
  const [authTokenError, setAuthTokenError] = useState(null)
  const [phoneNumberError, setPhoneNumberError] = useState(null)

  const [mutate, { loading }] = useMutation(SAVE_TWILIO_CONFIGURATION)

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }

  const validateInput = () => {
    let accountSidResult = true
    let authTokenResult = true
    let phoneNumberResult = true

    accountSidResult = !validateFunc(
      { twilioAccountSid: formRef.current['input-accountSid'].value },
      'twilioAccountSid'
    )
    authTokenResult = !validateFunc(
      { twilioAuthToken: formRef.current['input-authToken'].value },
      'twilioAuthToken'
    )
    phoneNumberResult = !validateFunc(
      { twilioPhoneNumber: formRef.current['input-phoneNumber'].value },
      'twilioPhoneNumber'
    )

    setAccountSidError(accountSidResult)
    setAuthTokenError(authTokenResult)
    setPhoneNumberError(phoneNumberResult)

    return accountSidResult && authTokenResult && phoneNumberResult
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            Twilio
          </Typography>
        </Box>
        <Box ml={20} mt={1}>
          <label>{twilioEnabled ? 'Disable' : 'Enable'}</label>
          <Switch
            defaultChecked={twilioEnabled}
            value={twilioEnabled}
            onChange={e => setTwilioEnabled(e.target.checked)}
            id="input-twilioEnabled"
            name="input-twilioEnabled"
            style={{ color: 'black' }}
          />
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box className={globalClasses.flexRow}>
            <Box>
              <Typography className={classes.labelText}>
                Twilio Account SID
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-accountSid"
                name="input-accountSid"
                placeholder="Twilio Account SID"
                defaultValue={twilioAccountSid}
                type="password"
                onBlur={event =>
                  onBlur(
                    setAccountSidError,
                    'twilioAccountSid',
                    event.target.value
                  )
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  accountSidError === false
                    ? globalClasses.inputError
                    : accountSidError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
            </Box>
            <Box>
              <Typography className={classes.labelText}>
                Twilio Auth Token
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-authToken"
                name="input-authToken"
                placeholder="Twilio Auth Token"
                defaultValue={twilioAuthToken}
                type="password"
                onBlur={event =>
                  onBlur(
                    setAuthTokenError,
                    'twilioAuthToken',
                    event.target.value
                  )
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  authTokenError === false
                    ? globalClasses.inputError
                    : authTokenError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
            </Box>
          </Box>
          <Box>
            <Typography className={classes.labelText}>
              Twilio Phone Number
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-phoneNumber"
              name="input-phoneNumber"
              placeholder="Twilio Phone Number"
              defaultValue={twilioPhoneNumber}
              type="password"
              onBlur={event =>
                onBlur(
                  setPhoneNumberError,
                  'twilioPhoneNumber',
                  event.target.value
                )
              }
              disableUnderline
              className={[
                globalClasses.input,
                phoneNumberError === false
                  ? globalClasses.inputError
                  : phoneNumberError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}
            />
          </Box>
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
                        twilioAccountSid:
                          formRef.current['input-accountSid'].value,
                        twilioAuthToken:
                          formRef.current['input-authToken'].value,
                        twilioPhoneNumber:
                          formRef.current['input-phoneNumber'].value,
                        twilioEnabled: twilioEnabled
                      }
                    }
                  })
                }
              }}>
              SAVE
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default withTranslation()(TwilioConfiguration)
