import React, { useState, useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../../constraints/constraints'
import { stripeCurrencies } from '../../../config/currencies'
import { saveCurrencyConfiguration } from '../../../apollo'
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
import { Box, Typography, Button, Select, MenuItem, Alert } from '@mui/material'

const SAVE_CURRENCY_CONFIGURATION = gql`
  ${saveCurrencyConfiguration}
`

function Currency(props) {
  const { t } = props
  const [currencyCode, currencyCodeSetter] = useState(props.currencyCode || '')
  const [currencySymbol, currencySymbolSetter] = useState(
    props.currencySymbol || ''
  )
  const onCompleted = data => {
    console.log(data)
  }
  const onError = error => {
    console.log(error)
  }
  const [currencyCodeError, currencyCodeErrorSetter] = useState(null)
  const [currencySymbolError, currencySymbolErrorSetter] = useState(null)
  const [mutate, { loading }] = useMutation(SAVE_CURRENCY_CONFIGURATION, {
    onError,
    onCompleted
  })

  const validateInput = () => {
    const currencyCodeError = !validateFunc(
      { currencyCode: currencyCode },
      'currencyCode'
    )
    const currencySymbolError = !validateFunc(
      { currencySymbol: currencySymbol },
      'currencySymbol'
    )
    currencyCodeErrorSetter(currencyCodeError)
    currencySymbolErrorSetter(currencySymbolError)
    return currencyCodeError && currencySymbolError
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
            {t('Currency')}
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        <form>
          <Box>
            <Typography className={classes.labelText}>
              {t('ChooseCurrency')}
            </Typography>
            <Select
              style={{ marginTop: -1 }}
              id="input-currency"
              name="input-currency"
              defaultValue={[currencyCode || '']}
              value={currencyCode}
              onChange={e => currencyCodeSetter(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              className={[
                globalClasses.input,
                currencyCodeError === false
                  ? globalClasses.inputError
                  : currencyCodeError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}>
              {stripeCurrencies.map(val => (
                <MenuItem
                  style={{ color: 'black' }}
                  value={val.currency}
                  key={val.currency}>
                  {val.currency}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box>
            <Typography className={classes.labelText}>
              {t('ChooseSymbol')}
            </Typography>
            <Select
              style={{ marginTop: -1 }}
              id="input-symbol"
              name="input-symbol"
              defaultValue={[currencySymbol || '']}
              value={currencySymbol}
              onChange={e => currencySymbolSetter(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              className={[
                globalClasses.input,
                currencySymbolError === false
                  ? globalClasses.inputError
                  : currencySymbolError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}>
              {stripeCurrencies.map(val => (
                <MenuItem
                  style={{ color: 'black' }}
                  value={val.currencySymbol}
                  key={val.currencySymbol}>
                  {val.currencySymbol}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box>
            <Button
              className={globalClasses.button}
              disabled={loading}
              onClick={e => {
                e.preventDefault()
                if (validateInput()) {
                  mutate({
                    variables: {
                      configurationInput: {
                        currency: currencyCode,
                        currencySymbol: currencySymbol
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

export default withTranslation()(Currency)
