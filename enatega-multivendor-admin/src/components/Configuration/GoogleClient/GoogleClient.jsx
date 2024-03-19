// GoogleClientIDConfiguration.jsx
import React, { useRef, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../../constraints/constraints'
import { saveGoogleClientIDConfiguration } from '../../../apollo' // Update with the correct import path
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
import { Box, Typography, Input, Button } from '@mui/material'

const SAVE_GOOGLE_CLIENT_ID_CONFIGURATION = gql`
  ${saveGoogleClientIDConfiguration}
`

function GoogleClientIDConfiguration(props) {
  const formRef = useRef()
  const [webClientID] = useState(props.webClientID || '')
  const [androidClientID] = useState(props.androidClientID || '')
  const [iOSClientID] = useState(props.iOSClientID || '')
  const [expoClientID] = useState(props.expoClientID || '')

  const [webClientIDError, setWebClientIDError] = useState(null)
  const [androidClientIDError, setAndroidClientIDError] = useState(null)
  const [iOSClientIDError, setIOSClientIDError] = useState(null)
  const [expoClientIDError, setExpoClientIDError] = useState(null)

  const [mutate, { loading }] = useMutation(SAVE_GOOGLE_CLIENT_ID_CONFIGURATION)

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }

  const validateInput = () => {
    let webClientIDResult = true
    let androidClientIDResult = true
    let iOSClientIDResult = true
    let expoClientIDResult = true

    webClientIDResult = !validateFunc(
      { webClientID: formRef.current['input-webClientID'].value },
      'webClientID'
    )
    androidClientIDResult = !validateFunc(
      { androidClientID: formRef.current['input-androidClientID'].value },
      'androidClientID'
    )
    iOSClientIDResult = !validateFunc(
      { iOSClientID: formRef.current['input-iOSClientID'].value },
      'iOSClientID'
    )
    expoClientIDResult = !validateFunc(
      { expoClientID: formRef.current['input-expoClientID'].value },
      'expoClientID'
    )

    setWebClientIDError(webClientIDResult)
    setAndroidClientIDError(androidClientIDResult)
    setIOSClientIDError(iOSClientIDResult)
    setExpoClientIDError(expoClientIDResult)

    return (
      webClientIDResult &&
      androidClientIDResult &&
      iOSClientIDResult &&
      expoClientIDResult
    )
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            Google Client IDs
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box>
            <Typography className={classes.labelText}>Web Client ID</Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-webClientID"
              name="input-webClientID"
              placeholder="Web Client ID"
              defaultValue={webClientID}
              type="password"
              onBlur={event =>
                onBlur(setWebClientIDError, 'webClientID', event.target.value)
              }
              disableUnderline
              className={[
                globalClasses.input,
                webClientIDError === false
                  ? globalClasses.inputError
                  : webClientIDError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}
            />
          </Box>
          <Box className={globalClasses.flexRow}>
            <Box>
              <Typography className={classes.labelText}>
                Android Client ID
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-androidClientID"
                name="input-androidClientID"
                placeholder="Android Client ID"
                defaultValue={androidClientID}
                type="password"
                onBlur={event =>
                  onBlur(
                    setAndroidClientIDError,
                    'androidClientID',
                    event.target.value
                  )
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  androidClientIDError === false
                    ? globalClasses.inputError
                    : androidClientIDError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
            </Box>
            <Box>
              <Typography className={classes.labelText}>
                iOS Client ID
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-iOSClientID"
                name="input-iOSClientID"
                placeholder="iOS Client ID"
                defaultValue={iOSClientID}
                type="password"
                onBlur={event =>
                  onBlur(setIOSClientIDError, 'iOSClientID', event.target.value)
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  iOSClientIDError === false
                    ? globalClasses.inputError
                    : iOSClientIDError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
            </Box>
          </Box>
          <Box>
            <Typography className={classes.labelText}>
              Expo Client ID
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-expoClientID"
              name="input-expoClientID"
              placeholder="Expo Client ID"
              defaultValue={expoClientID}
              type="password"
              onBlur={event =>
                onBlur(setExpoClientIDError, 'expoClientID', event.target.value)
              }
              disableUnderline
              className={[
                globalClasses.input,
                expoClientIDError === false
                  ? globalClasses.inputError
                  : expoClientIDError === true
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
                        webClientID: formRef.current['input-webClientID'].value,
                        androidClientID:
                          formRef.current['input-androidClientID'].value,
                        iOSClientID: formRef.current['input-iOSClientID'].value,
                        expoClientID:
                          formRef.current['input-expoClientID'].value
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

export default withTranslation()(GoogleClientIDConfiguration)
