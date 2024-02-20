import React, { useRef, useState, useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../../constraints/constraints'
import { savePaypalConfiguration } from '../../../apollo'
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
import { Box, Switch, Typography, Input, Button, Alert } from '@mui/material'

const SAVE_PAYPAL_CONFIGURATION = gql`
  ${savePaypalConfiguration}
`

function Paypal(props) {
  const { t } = props
  const formRef = useRef()
  const clientId = props.clientId || ''
  const clientSecret = props.clientSecret || ''
  const [clientIdError, clientIdErrorSetter] = useState(null)
  const [sandbox, setSandbox] = useState(!!props.sandbox)
  const [clientSecretError, clientSecretErrorSetter] = useState(null)
  const [mutate, { loading }] = useMutation(SAVE_PAYPAL_CONFIGURATION)

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }
  const validateInput = () => {
    let clientIdResult = true
    let clientSecretResult = true
    clientIdResult = !!formRef.current['input-clientid'].value
    clientSecretResult = !!formRef.current['input-clientsecret'].value
    clientIdErrorSetter(clientIdResult)
    clientIdErrorSetter(clientSecretResult)
    return clientIdResult && clientSecretResult
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
            {t('Paypal')}
          </Typography>
        </Box>
        <Box ml={5} mt={1}>
          <label>{t('Sandbox')}</label>
          <Switch
            defaultChecked={sandbox}
            value={sandbox}
            onChange={e => setSandbox(e.target.checked)}
            id="input-sandbox"
            name="input-sandbox"
            style={{ color: 'black' }}
          />
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box>
            <Typography className={classes.labelText}>
              {t('Client ID')}
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-clientid"
              name="input-clientid"
              placeholder="ClientId e.g AeGIgSX--JEVwoQgLjGOb8gh1DUJG0MFVgLc2mBIe6_V5NefV0LM3L78m01fLLI6U2FFB-qJr4ErrtL1"
              type="password"
              defaultValue={clientId}
              onBlur={event =>
                onBlur(clientIdErrorSetter, 'clientId', event.target.value)
              }
              disableUnderline
              className={[
                globalClasses.input,
                clientIdError === false
                  ? globalClasses.inputError
                  : clientIdError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}
            />
          </Box>
          <Box>
            <Typography className={classes.labelText}>
              {t('ClientSecretKey')}
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-clientsecret"
              name="input-clientsecret"
              placeholder="e.g EHAP6CSZt3kwzcpdxrpw16PqHEspw5wtJCVVux_95e2Qcwbeh6mQp9GncEbxnVFkEbJu4z1i-GuDDthf"
              type="password"
              defaultValue={clientSecret}
              onBlur={event => {
                onBlur(
                  clientSecretErrorSetter,
                  'clientSecret',
                  event.target.value
                )
              }}
              disableUnderline
              className={[
                globalClasses.input,
                clientSecretError === false
                  ? globalClasses.inputError
                  : clientSecretError === true
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
                        clientId: formRef.current['input-clientid'].value,
                        clientSecret:
                          formRef.current['input-clientsecret'].value,
                        //sandbox: formRef.current['input-sandbox'].checked
                        sandbox: sandbox
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

export default withTranslation()(Paypal)
