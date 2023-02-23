import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../../constraints/constraints'
import { stripeCurrencies } from '../../../config/currencies'
import { saveCurrencyConfiguration } from '../../../apollo'
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
import { Box, Typography, Button, Select, MenuItem } from '@mui/material'

const SAVE_CURRENCY_CONFIGURATION = gql`
  ${saveCurrencyConfiguration}
`

function Currency(props) {
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

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            Currency
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        <form>
          <Box className={globalClasses.flexRow}>
            <Select
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
          <Box className={globalClasses.flexRow}>
            <Select
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

export default withTranslation()(Currency)
