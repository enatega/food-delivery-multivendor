// FirebaseConfiguration.jsx

import React, { useRef, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../../constraints/constraints'
import { saveFirebaseConfiguration } from '../../../apollo' // Assuming you have a corresponding Apollo mutation
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
import { Box, Typography, Input, Button } from '@mui/material'

const SAVE_FIREBASE_CONFIGURATION = gql`
  ${saveFirebaseConfiguration}
`

function FirebaseConfiguration(props) {
  const formRef = useRef()
  const [firebaseKey] = useState(props.firebaseKey || '')
  const [authDomain] = useState(props.authDomain || '')
  const [projectId] = useState(props.projectId || '')
  const [storageBucket] = useState(props.storageBucket || '')
  const [msgSenderId] = useState(props.msgSenderId || '')
  const [appId] = useState(props.appId || '')
  const [measurementId] = useState(props.measurementId || '')
  const [vapidKey] = useState(props.vapidKey || '')

  const [firebaseKeyError, setFirebaseKeyError] = useState(null)
  const [authDomainError, setAuthDomainError] = useState(null)
  const [projectIdError, setProjectIdError] = useState(null)
  const [storageBucketError, setStorageBucketError] = useState(null)
  const [msgSenderIdError, setMsgSenderIdError] = useState(null)
  const [appIdError, setAppIdError] = useState(null)
  const [measurementIdError, setMeasurementIdError] = useState(null)
  const [vapidKeyError, setVapidKeyError] = useState(null)

  const [mutate, { loading }] = useMutation(SAVE_FIREBASE_CONFIGURATION)

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }

  const validateInput = () => {
    let firebaseKeyResult = true
    let authDomainResult = true
    let projectIdResult = true
    let storageBucketResult = true
    let msgSenderIdResult = true
    let appIdResult = true
    let measurementIdResult = true

    firebaseKeyResult = !validateFunc(
      { firebaseKey: formRef.current['input-firebaseKey'].value },
      'firebaseKey'
    )
    authDomainResult = !validateFunc(
      { authDomain: formRef.current['input-authDomain'].value },
      'authDomain'
    )
    projectIdResult = !validateFunc(
      { projectId: formRef.current['input-projectId'].value },
      'projectId'
    )
    storageBucketResult = !validateFunc(
      { storageBucket: formRef.current['input-storageBucket'].value },
      'storageBucket'
    )
    msgSenderIdResult = !validateFunc(
      { msgSenderId: formRef.current['input-msgSenderId'].value },
      'msgSenderId'
    )
    appIdResult = !validateFunc(
      { appId: formRef.current['input-appId'].value },
      'appId'
    )
    measurementIdResult = !validateFunc(
      { measurementId: formRef.current['input-measurementId'].value },
      'measurementId'
    )

    setFirebaseKeyError(firebaseKeyResult)
    setAuthDomainError(authDomainResult)
    setProjectIdError(projectIdResult)
    setStorageBucketError(storageBucketResult)
    setMsgSenderIdError(msgSenderIdResult)
    setAppIdError(appIdResult)
    setMeasurementIdError(measurementIdResult)

    return (
      firebaseKeyResult &&
      authDomainResult &&
      projectIdResult &&
      storageBucketResult &&
      msgSenderIdResult &&
      appIdResult &&
      measurementIdResult
    )
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            FireBase Admin
          </Typography>
        </Box>
      </Box>
      <Box className={classes.form}>
        <form ref={formRef}>
          <Box className={globalClasses.flexRow}>
            <Box>
              <Typography className={classes.labelText}>
                Firebase Key
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-firebaseKey"
                name="input-firebaseKey"
                placeholder="Firebase Key"
                defaultValue={firebaseKey}
                onBlur={event =>
                  onBlur(setFirebaseKeyError, 'firebaseKey', event.target.value)
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  firebaseKeyError === false
                    ? globalClasses.inputError
                    : firebaseKeyError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
            </Box>
            <Box>
              <Typography className={classes.labelText}>Auth Domain</Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-authDomain"
                name="input-authDomain"
                placeholder="Auth Domain"
                defaultValue={authDomain}
                onBlur={event =>
                  onBlur(setAuthDomainError, 'authDomain', event.target.value)
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  authDomainError === false
                    ? globalClasses.inputError
                    : authDomainError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
            </Box>
          </Box>

          <Box className={globalClasses.flexRow}>
            <Box>
              <Typography className={classes.labelText}>Project ID</Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-projectId"
                name="input-projectId"
                placeholder="Project ID"
                defaultValue={projectId}
                onBlur={event =>
                  onBlur(setProjectIdError, 'projectId', event.target.value)
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  projectIdError === false
                    ? globalClasses.inputError
                    : projectIdError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
            </Box>
            <Box>
              <Typography className={classes.labelText}>
                Storage Bucket
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-storageBucket"
                name="input-storageBucket"
                placeholder="Storage Bucket"
                defaultValue={storageBucket}
                onBlur={event =>
                  onBlur(
                    setStorageBucketError,
                    'storageBucket',
                    event.target.value
                  )
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  storageBucketError === false
                    ? globalClasses.inputError
                    : storageBucketError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
            </Box>
          </Box>
          <Box className={globalClasses.flexRow}>
            <Box>
              <Typography className={classes.labelText}>
                Message Sender ID
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-msgSenderId"
                name="input-msgSenderId"
                placeholder="Message Sender ID"
                defaultValue={msgSenderId}
                onBlur={event =>
                  onBlur(setMsgSenderIdError, 'msgSenderId', event.target.value)
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  msgSenderIdError === false
                    ? globalClasses.inputError
                    : msgSenderIdError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
            </Box>
            <Box>
              <Typography className={classes.labelText}>App ID</Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-appId"
                name="input-appId"
                placeholder="App ID"
                defaultValue={appId}
                onBlur={event =>
                  onBlur(setAppIdError, 'appId', event.target.value)
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  appIdError === false
                    ? globalClasses.inputError
                    : appIdError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
            </Box>
          </Box>
          <Box>
            <Typography className={classes.labelText}>
              Measurement ID
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-measurementId"
              name="input-measurementId"
              placeholder="Measurement ID"
              defaultValue={measurementId}
              onBlur={event =>
                onBlur(
                  setMeasurementIdError,
                  'measurementId',
                  event.target.value
                )
              }
              disableUnderline
              className={[
                globalClasses.input,
                measurementIdError === false
                  ? globalClasses.inputError
                  : measurementIdError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}
            />
          </Box>

          <Box>
            <Typography className={classes.labelText}>Vapid Key</Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-vapidKey"
              name="input-vapidKey"
              placeholder="Vapid Key"
              defaultValue={vapidKey}
              onBlur={event =>
                onBlur(setVapidKeyError, 'vapidKey', event.target.value)
              }
              disableUnderline
              className={[
                globalClasses.input,
                vapidKeyError === false
                  ? globalClasses.inputError
                  : vapidKeyError === true
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
                        firebaseKey: formRef.current['input-firebaseKey'].value,
                        authDomain: formRef.current['input-authDomain'].value,
                        projectId: formRef.current['input-projectId'].value,
                        storageBucket:
                          formRef.current['input-storageBucket'].value,
                        msgSenderId: formRef.current['input-msgSenderId'].value,
                        appId: formRef.current['input-appId'].value,
                        measurementId:
                          formRef.current['input-measurementId'].value,
                        vapidKey: formRef.current['input-vapidKey'].value ?? ''
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

export default withTranslation()(FirebaseConfiguration)
