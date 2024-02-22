// SentryConfiguration.jsx

import React, { useRef, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../../constraints/constraints'
import { saveSentryConfiguration } from '../../../apollo'
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
import { Box, Typography, Input, Button } from '@mui/material'

const SAVE_SENTRY_CONFIGURATION = gql`
  ${saveSentryConfiguration}
`

function SentryConfiguration(props) {
  const formRef = useRef()

  const [dashboardSentryUrl] = useState(props.dashboardSentryUrl || '')
  const [webSentryUrl] = useState(props.webSentryUrl || '')
  const [apiSentryUrl] = useState(props.apiSentryUrl || '')
  const [customerAppSentryUrl] = useState(props.customerAppSentryUrl || '')
  const [restaurantAppSentryUrl] = useState(props.restaurantAppSentryUrl || '')
  const [riderAppSentryUrl] = useState(props.riderAppSentryUrl || '')

  const [dashboardSentryUrlError, setDashboardSentryUrlError] = useState(null)
  const [webSentryUrlError, setWebSentryUrlError] = useState(null)
  const [apiSentryUrlError, setApiSentryUrlError] = useState(null)
  const [customerAppSentryUrlError, setCustomerAppSentryUrlError] = useState(
    null
  )
  const [
    restaurantAppSentryUrlError,
    setRestaurantAppSentryUrlError
  ] = useState(null)
  const [riderAppSentryUrlError, setRiderAppSentryUrlError] = useState(null)

  const [mutate, { loading }] = useMutation(SAVE_SENTRY_CONFIGURATION)

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }

  const validateInput = () => {
    let dashboardSentryUrlResult = true
    let webSentryUrlResult = true
    let apiSentryUrlResult = true
    let customerAppSentryUrlResult = true
    let restaurantAppSentryUrlResult = true
    let riderAppSentryUrlResult = true

    dashboardSentryUrlResult = !validateFunc(
      { dashboardSentryUrl: formRef.current['input-dashboardSentryUrl'].value },
      'dashboardSentryUrl'
    )
    webSentryUrlResult = !validateFunc(
      { webSentryUrl: formRef.current['input-webSentryUrl'].value },
      'webSentryUrl'
    )
    apiSentryUrlResult = !validateFunc(
      { apiSentryUrl: formRef.current['input-apiSentryUrl'].value },
      'apiSentryUrl'
    )
    customerAppSentryUrlResult = !validateFunc(
      {
        customerAppSentryUrl:
          formRef.current['input-customerAppSentryUrl'].value
      },
      'customerAppSentryUrl'
    )
    restaurantAppSentryUrlResult = !validateFunc(
      {
        restaurantAppSentryUrl:
          formRef.current['input-restaurantAppSentryUrl'].value
      },
      'restaurantAppSentryUrl'
    )
    riderAppSentryUrlResult = !validateFunc(
      { riderAppSentryUrl: formRef.current['input-riderAppSentryUrl'].value },
      'riderAppSentryUrl'
    )

    setDashboardSentryUrlError(dashboardSentryUrlResult)
    setWebSentryUrlError(webSentryUrlResult)
    setApiSentryUrlError(apiSentryUrlResult)
    setCustomerAppSentryUrlError(customerAppSentryUrlResult)
    setRestaurantAppSentryUrlError(restaurantAppSentryUrlResult)
    setRiderAppSentryUrlError(riderAppSentryUrlResult)

    return (
      dashboardSentryUrlResult &&
      webSentryUrlResult &&
      apiSentryUrlResult &&
      customerAppSentryUrlResult &&
      restaurantAppSentryUrlResult &&
      riderAppSentryUrlResult
    )
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            Sentry Configuration
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box>
            <Typography className={classes.labelText}>
              Dashboard Sentry URL
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-dashboardSentryUrl"
              name="input-dashboardSentryUrl"
              placeholder="Dashboard Sentry URL"
              defaultValue={dashboardSentryUrl}
              type="password"
              onBlur={event =>
                onBlur(
                  setDashboardSentryUrlError,
                  'dashboardSentryUrl',
                  event.target.value
                )
              }
              disableUnderline
              className={[
                globalClasses.input,
                dashboardSentryUrlError === false
                  ? globalClasses.inputError
                  : dashboardSentryUrlError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}
            />
          </Box>
          <Box className={globalClasses.flexRow}>
            <Box>
              <Typography className={classes.labelText}>
                Web Sentry URL
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-webSentryUrl"
                name="input-webSentryUrl"
                placeholder="Web Sentry URL"
                defaultValue={webSentryUrl}
                type="password"
                onBlur={event =>
                  onBlur(
                    setWebSentryUrlError,
                    'webSentryUrl',
                    event.target.value
                  )
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  webSentryUrlError === false
                    ? globalClasses.inputError
                    : webSentryUrlError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
            </Box>
            <Box>
              <Typography className={classes.labelText}>
                API Sentry URL
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-apiSentryUrl"
                name="input-apiSentryUrl"
                placeholder="API Sentry URL"
                defaultValue={apiSentryUrl}
                type="password"
                onBlur={event =>
                  onBlur(
                    setApiSentryUrlError,
                    'apiSentryUrl',
                    event.target.value
                  )
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  apiSentryUrlError === false
                    ? globalClasses.inputError
                    : apiSentryUrlError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
            </Box>
          </Box>
          <Box className={globalClasses.flexRow}>
            <Box>
              <Typography className={classes.labelText}>
                Customer App Sentry URL
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-customerAppSentryUrl"
                name="input-customerAppSentryUrl"
                placeholder="Customer App Sentry URL"
                type="password"
                defaultValue={customerAppSentryUrl}
                onBlur={event =>
                  onBlur(
                    setCustomerAppSentryUrlError,
                    'customerAppSentryUrl',
                    event.target.value
                  )
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  customerAppSentryUrlError === false
                    ? globalClasses.inputError
                    : customerAppSentryUrlError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
            </Box>
            <Box>
              <Typography className={classes.labelText}>
                Restaurant App Sentry URL
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-restaurantAppSentryUrl"
                name="input-restaurantAppSentryUrl"
                placeholder="Restaurant App Sentry URL"
                defaultValue={restaurantAppSentryUrl}
                type="password"
                onBlur={event =>
                  onBlur(
                    setRestaurantAppSentryUrlError,
                    'restaurantAppSentryUrl',
                    event.target.value
                  )
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  restaurantAppSentryUrlError === false
                    ? globalClasses.inputError
                    : restaurantAppSentryUrlError === true
                    ? globalClasses.inputSuccess
                    : ''
                ]}
              />
            </Box>
          </Box>
          <Box>
            <Typography className={classes.labelText}>
              Rider App Sentry URL
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-riderAppSentryUrl"
              name="input-riderAppSentryUrl"
              placeholder="Rider App Sentry URL"
              defaultValue={riderAppSentryUrl}
              type="password"
              onBlur={event =>
                onBlur(
                  setRiderAppSentryUrlError,
                  'riderAppSentryUrl',
                  event.target.value
                )
              }
              disableUnderline
              className={[
                globalClasses.input,
                riderAppSentryUrlError === false
                  ? globalClasses.inputError
                  : riderAppSentryUrlError === true
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
                        dashboardSentryUrl:
                          formRef.current['input-dashboardSentryUrl'].value,
                        webSentryUrl:
                          formRef.current['input-webSentryUrl'].value,
                        apiSentryUrl:
                          formRef.current['input-apiSentryUrl'].value,
                        customerAppSentryUrl:
                          formRef.current['input-customerAppSentryUrl'].value,
                        restaurantAppSentryUrl:
                          formRef.current['input-restaurantAppSentryUrl'].value,
                        riderAppSentryUrl:
                          formRef.current['input-riderAppSentryUrl'].value
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

export default withTranslation()(SentryConfiguration)
