import React, { useRef, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../../constraints/constraints'
import { saveWebConfiguration } from '../../../apollo' // Update with the correct import path
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
import { Box, Typography, Input, Button } from '@mui/material'

const SAVE_WEB_CONFIGURATION = gql`
  ${saveWebConfiguration}
`

function WebConfiguration(props) {
  const formRef = useRef()

  const [googleMapLibraries] = useState(props.googleMapLibraries || '')
  const [googleColor] = useState(props.googleColor || '')

  const [googleMapLibrariesError, setGoogleMapLibrariesError] = useState(null)
  const [googleColorError, setGoogleColorError] = useState(null)

  const [mutate, { loading }] = useMutation(SAVE_WEB_CONFIGURATION)

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }

  const validateInput = () => {
    let googleMapLibrariesResult = true
    let googleColorResult = true

    googleMapLibrariesResult = !validateFunc(
      { googleMapLibraries: formRef.current['input-googleMapLibraries'].value },
      'googleMapLibraries'
    )
    googleColorResult = !validateFunc(
      { googleColor: formRef.current['input-googleColor'].value },
      'googleColor'
    )

    setGoogleMapLibrariesError(googleMapLibrariesResult)
    setGoogleColorError(googleColorResult)

    return googleMapLibrariesResult && googleColorResult
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            Web Configuration
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box>
            <Typography className={classes.labelText}>
              Google Map Libraries
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-googleMapLibraries"
              name="input-googleMapLibraries"
              placeholder="Google Map Libraries"
              defaultValue={googleMapLibraries}
              onBlur={event =>
                onBlur(
                  setGoogleMapLibrariesError,
                  'googleMapLibraries',
                  event.target.value
                )
              }
              disableUnderline
              className={[
                globalClasses.input,
                googleMapLibrariesError === false
                  ? globalClasses.inputError
                  : googleMapLibrariesError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}
            />
          </Box>

          <Box>
            <Typography className={classes.labelText}>Google Color</Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-googleColor"
              name="input-googleColor"
              placeholder="Google Color"
              defaultValue={googleColor}
              onBlur={event =>
                onBlur(setGoogleColorError, 'googleColor', event.target.value)
              }
              disableUnderline
              className={[
                globalClasses.input,
                googleColorError === false
                  ? globalClasses.inputError
                  : googleColorError === true
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
                        serverUrlWeb: formRef.current['input-serverUrl'].value,
                        wsServerUrlWeb:
                          formRef.current['input-wsServerUrl'].value,
                        googleMapLibraries:
                          formRef.current['input-googleMapLibraries'].value,
                        googleColor: formRef.current['input-googleColor'].value
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

export default withTranslation()(WebConfiguration)
