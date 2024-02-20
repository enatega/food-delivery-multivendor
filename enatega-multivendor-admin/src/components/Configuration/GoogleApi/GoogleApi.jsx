// GoogleApiKeyConfiguration.jsx

import React, { useRef, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../../constraints/constraints'
import { saveGoogleApiKeyConfiguration } from '../../../apollo'
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
import { Box, Typography, Input, Button } from '@mui/material'

const SAVE_GOOGLE_API_KEY_CONFIGURATION = gql`
  ${saveGoogleApiKeyConfiguration}
`

function GoogleApiKeyConfiguration(props) {
  const formRef = useRef()

  const [googleApiKey] = useState(props.googleApiKey || '')

  const [googleApiKeyError, setGoogleApiKeyError] = useState(null)

  const [mutate, { loading }] = useMutation(SAVE_GOOGLE_API_KEY_CONFIGURATION)

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }

  const validateInput = () => {
    let googleApiKeyResult = true

    googleApiKeyResult = !validateFunc(
      { googleApiKey: formRef.current['input-googleApiKey'].value },
      'googleApiKey'
    )

    setGoogleApiKeyError(googleApiKeyResult)

    return googleApiKeyResult
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            Google API Key
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box>
            <Typography className={classes.labelText}>
              Google API Key
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-googleApiKey"
              name="input-googleApiKey"
              placeholder="Google API Key"
              defaultValue={googleApiKey}
              type="password"
              onBlur={event =>
                onBlur(setGoogleApiKeyError, 'googleApiKey', event.target.value)
              }
              disableUnderline
              className={[
                globalClasses.input,
                googleApiKeyError === false
                  ? globalClasses.inputError
                  : googleApiKeyError === true
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
                        googleApiKey:
                          formRef.current['input-googleApiKey'].value
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

export default withTranslation()(GoogleApiKeyConfiguration)
