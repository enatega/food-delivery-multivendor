import React, { useRef, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../../constraints/constraints'
import { saveAmplitudeApiKeyConfiguration } from '../../../apollo'
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
import { Box, Typography, Input, Button } from '@mui/material'

const SAVE_AMPLITUDE_API_KEY_CONFIGURATION = gql`
  ${saveAmplitudeApiKeyConfiguration}
`

function AmplitudeApiKeyConfiguration(props) {
  const formRef = useRef()
  const [webAmplitudeApiKey] = useState(props.webAmplitudeApiKey || '')
  const [appAmplitudeApiKey] = useState(props.appAmplitudeApiKey || '')

  const [webAmplitudeApiKeyError, setWebAmplitudeApiKeyError] = useState(null)
  const [appAmplitudeApiKeyError, setAppAmplitudeApiKeyError] = useState(null)

  const [mutate, { loading }] = useMutation(
    SAVE_AMPLITUDE_API_KEY_CONFIGURATION
  )

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }

  const validateInput = () => {
    let webAmplitudeApiKeyResult = true
    let appAmplitudeApiKeyResult = true

    webAmplitudeApiKeyResult = !validateFunc(
      { webAmplitudeApiKey: formRef.current['input-webAmplitudeApiKey'].value },
      'webAmplitudeApiKey'
    )
    appAmplitudeApiKeyResult = !validateFunc(
      { appAmplitudeApiKey: formRef.current['input-appAmplitudeApiKey'].value },
      'appAmplitudeApiKey'
    )

    setWebAmplitudeApiKeyError(webAmplitudeApiKeyResult)
    setAppAmplitudeApiKeyError(appAmplitudeApiKeyResult)

    return webAmplitudeApiKeyResult && appAmplitudeApiKeyResult
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            Amplitude API Key
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box>
            <Typography className={classes.labelText}>
              Web Amplitude API Key
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-webAmplitudeApiKey"
              name="input-webAmplitudeApiKey"
              placeholder="Web Amplitude API Key"
              type="password"
              defaultValue={webAmplitudeApiKey}
              onBlur={event =>
                onBlur(
                  setWebAmplitudeApiKeyError,
                  'webAmplitudeApiKey',
                  event.target.value
                )
              }
              disableUnderline
              className={[
                globalClasses.input,
                webAmplitudeApiKeyError === false
                  ? globalClasses.inputError
                  : webAmplitudeApiKeyError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}
            />
          </Box>
          <Box>
            <Typography className={classes.labelText}>
              App Amplitude API Key
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-appAmplitudeApiKey"
              name="input-appAmplitudeApiKey"
              placeholder="App Amplitude API Key"
              type="password"
              defaultValue={appAmplitudeApiKey}
              onBlur={event =>
                onBlur(
                  setAppAmplitudeApiKeyError,
                  'appAmplitudeApiKey',
                  event.target.value
                )
              }
              disableUnderline
              className={[
                globalClasses.input,
                appAmplitudeApiKeyError === false
                  ? globalClasses.inputError
                  : appAmplitudeApiKeyError === true
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
                        webAmplitudeApiKey:
                          formRef.current['input-webAmplitudeApiKey'].value,
                        appAmplitudeApiKey:
                          formRef.current['input-appAmplitudeApiKey'].value
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

export default withTranslation()(AmplitudeApiKeyConfiguration)
