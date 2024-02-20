// CloudinaryConfiguration.jsx

import React, { useRef, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../../constraints/constraints'
import { saveCloudinaryConfiguration } from '../../../apollo'
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
import { Box, Typography, Input, Button } from '@mui/material'

const SAVE_CLOUDINARY_CONFIGURATION = gql`
  ${saveCloudinaryConfiguration}
`

function CloudinaryConfiguration(props) {
  const formRef = useRef()

  const [cloudinaryUploadUrl] = useState(props.cloudinaryUploadUrl || '')
  const [cloudinaryApiKey] = useState(props.cloudinaryApiKey || '')

  const [cloudinaryUploadUrlError, setCloudinaryUploadUrlError] = useState(null)
  const [cloudinaryApiKeyError, setCloudinaryApiKeyError] = useState(null)

  const [mutate, { loading }] = useMutation(SAVE_CLOUDINARY_CONFIGURATION)

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }

  const validateInput = () => {
    let cloudinaryUploadUrlResult = true
    let cloudinaryApiKeyResult = true

    cloudinaryUploadUrlResult = !validateFunc(
      {
        cloudinaryUploadUrl: formRef.current['input-cloudinaryUploadUrl'].value
      },
      'cloudinaryUploadUrl'
    )
    cloudinaryApiKeyResult = !validateFunc(
      { cloudinaryApiKey: formRef.current['input-cloudinaryApiKey'].value },
      'cloudinaryApiKey'
    )

    setCloudinaryUploadUrlError(cloudinaryUploadUrlResult)
    setCloudinaryApiKeyError(cloudinaryApiKeyResult)

    return cloudinaryUploadUrlResult && cloudinaryApiKeyResult
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            Cloudinary
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box>
            <Typography className={classes.labelText}>
              Cloudinary Upload URL
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-cloudinaryUploadUrl"
              name="input-cloudinaryUploadUrl"
              placeholder="Cloudinary Upload URL"
              type="password"
              defaultValue={cloudinaryUploadUrl}
              onBlur={event =>
                onBlur(
                  setCloudinaryUploadUrlError,
                  'cloudinaryUploadUrl',
                  event.target.value
                )
              }
              disableUnderline
              className={[
                globalClasses.input,
                cloudinaryUploadUrlError === false
                  ? globalClasses.inputError
                  : cloudinaryUploadUrlError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}
            />
          </Box>
          <Box>
            <Typography className={classes.labelText}>
              Cloudinary Key
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-cloudinaryApiKey"
              name="input-cloudinaryApiKey"
              placeholder="Cloudinary API Key"
              type="password"
              defaultValue={cloudinaryApiKey}
              onBlur={event =>
                onBlur(
                  setCloudinaryApiKeyError,
                  'cloudinaryApiKey',
                  event.target.value
                )
              }
              disableUnderline
              className={[
                globalClasses.input,
                cloudinaryApiKeyError === false
                  ? globalClasses.inputError
                  : cloudinaryApiKeyError === true
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
                        cloudinaryUploadUrl:
                          formRef.current['input-cloudinaryUploadUrl'].value,
                        cloudinaryApiKey:
                          formRef.current['input-cloudinaryApiKey'].value
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

export default withTranslation()(CloudinaryConfiguration)
