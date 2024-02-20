// SendGridConfiguration.jsx

import React, { useRef, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../../constraints/constraints'
import { saveSendGridApiKey } from '../../../apollo'
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
import { Box, Switch, Typography, Input, Button, Grid } from '@mui/material'

const SAVE_SENDGRID_API_KEY = gql`
  ${saveSendGridApiKey}
`

function SendGridConfiguration(props) {
  const formRef = useRef()
  const [sendGridEnabled, setSendGridEnabled] = useState(
    !!props.sendGridEnabled
  )
  const [sendGridApiKey] = useState(props.sendGridApiKey || '')
  const [apiKeyError, setApiKeyError] = useState(null)
  const [sendGridEmail] = useState(props.sendGridEmail || '')
  const [sendGridEmailError, setSendGridEmailError] = useState(null)
  const [sendGridEmailName] = useState(props.sendGridEmailName || '')
  const [sendGridEmailNameError, setSendGridEmailNameError] = useState(null)
  const [sendGridPassword] = useState(props.sendGridPassword || '')
  const [sendGridPasswordError, setSendGridPasswordError] = useState(null)

  const [mutate, { loading }] = useMutation(SAVE_SENDGRID_API_KEY)

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }

  const onBlurEmail = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }

  const onBlurEmailName = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }

  const onBlurPassword = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }

  const validateInput = () => {
    let apiKeyResult = true
    let emailResult = true
    let emailNameResult = true
    let passwordResult = true

    apiKeyResult = !validateFunc(
      { sendGridApiKey: formRef.current['input-apiKey'].value },
      'sendGridApiKey'
    )
    emailResult = !validateFunc(
      { sendGridEmail: formRef.current['input-sendGridEmail'].value },
      'sendGridEmail'
    )
    emailNameResult = !validateFunc(
      { sendGridEmailName: formRef.current['input-sendGridEmailName'].value },
      'sendGridEmailName'
    )
    passwordResult = !validateFunc(
      { sendGridPassword: formRef.current['input-sendGridPassword'].value },
      'sendGridPassword'
    )

    setApiKeyError(apiKeyResult)
    setSendGridEmailError(emailResult)
    setSendGridEmailNameError(emailNameResult)
    setSendGridPasswordError(passwordResult)

    return apiKeyResult && emailResult && emailNameResult && passwordResult
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            SendGrid
          </Typography>
        </Box>
        <Box ml={20} mt={1}>
          <label>{sendGridEnabled ? 'Disable' : 'Enable'}</label>
          <Switch
            defaultChecked={sendGridEnabled}
            value={sendGridEnabled}
            onChange={e => setSendGridEnabled(e.target.checked)}
            id="input-sendGridEnabled"
            name="input-sendGridEnabled"
            style={{ color: 'black' }}
          />
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box>
            <Typography className={classes.labelText}>
              SendGrid API Key
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-apiKey"
              name="input-apiKey"
              placeholder="SendGrid API Key"
              defaultValue={sendGridApiKey}
              type="password"
              onBlur={event =>
                onBlur(setApiKeyError, 'sendGridApiKey', event.target.value)
              }
              disableUnderline
              className={[
                globalClasses.input,
                apiKeyError === false
                  ? globalClasses.inputError
                  : apiKeyError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}
            />
          </Box>

          <Box className={globalClasses.flexRow}>
            <Box>
              <Typography className={classes.labelText}>
                SendGrid Email
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-sendGridEmail"
                name="input-sendGridEmail"
                placeholder="e.g something@email.com"
                type="text"
                defaultValue={sendGridEmail}
                onBlur={event =>
                  onBlurEmail(
                    setSendGridEmailError,
                    'sendGridEmail',
                    event.target.value
                  )
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  sendGridEmailError === false
                    ? globalClasses.inputError
                    : sendGridEmailError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
            </Box>
            <Box>
              <Typography className={classes.labelText}>
                SendGrid Email Name
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-sendGridEmailName"
                name="input-sendGridEmailName"
                placeholder="e.g Enatega"
                type="text"
                defaultValue={sendGridEmailName}
                onBlur={event =>
                  onBlurEmailName(
                    setSendGridEmailNameError,
                    'sendGridEmailName',
                    event.target.value
                  )
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  sendGridEmailNameError === false
                    ? globalClasses.inputError
                    : sendGridEmailNameError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
            </Box>
          </Box>

          <Grid item xs={12}>
            <Box>
              <Typography className={classes.labelText}>
                SendGrid Password
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-sendGridPassword"
                name="input-sendGridPassword"
                placeholder="e.g FOOD-"
                type="password"
                defaultValue={sendGridPassword}
                onBlur={event =>
                  onBlurPassword(
                    setSendGridPasswordError,
                    'sendGridPassword',
                    event.target.value
                  )
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  sendGridPasswordError === false
                    ? globalClasses.inputError
                    : sendGridPasswordError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
            </Box>
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
                        sendGridApiKey: formRef.current['input-apiKey'].value,
                        sendGridEnabled: sendGridEnabled,
                        sendGridEmail:
                          formRef.current['input-sendGridEmail'].value,
                        sendGridEmailName:
                          formRef.current['input-sendGridEmailName'].value,
                        sendGridPassword:
                          formRef.current['input-sendGridPassword'].value
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

export default withTranslation()(SendGridConfiguration)
