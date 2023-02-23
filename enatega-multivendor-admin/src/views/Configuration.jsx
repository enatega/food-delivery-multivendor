import React from 'react'
import { withTranslation } from 'react-i18next'
import { useQuery, gql } from '@apollo/client'
import Header from '../components/Headers/Header'
import { getConfiguration } from '../apollo'
import EmailConfiguration from '../components/Configuration/Email/Email'
import DeliveryRateConfiguration from '../components/Configuration/DeliveryRate/DeliveryRate'
import PaypalConfiguration from '../components/Configuration/Paypal/Paypal'
import StripeConfiguration from '../components/Configuration/Stripe/Stripe'
import CurrencyConfiguration from '../components/Configuration/Currency/Currency'
import { Grid } from '@mui/material'
import { ReactComponent as ConfigIcon } from '../assets/svg/svg/Configuration.svg'

const GET_CONFIGURATION = gql`
  ${getConfiguration}
`
const Configuration = props => {
  const { data, error: errorQuery, loading: loadingQuery } = useQuery(
    GET_CONFIGURATION
  )
  return (
    <>
      <Header />
      {errorQuery && 'Error'}
      {loadingQuery ? (
        'Loading'
      ) : (
        <Grid container ml={2} spacing={2}>
          <Grid item sx={12} md={7} lg={7}>
            <EmailConfiguration
              emailName={data && data.configuration.emailName}
              email={data && data.configuration.email}
              password={data && data.configuration.password}
              enabled={data && data.configuration.enableEmail}
            />
          </Grid>
          <Grid
            item
            lg={5}
            sx={{ display: { xs: 'none', lg: 'block' } }}
            ml={-2}>
            <ConfigIcon />
          </Grid>
          <Grid item sx={12} md={12} lg={5}>
            <StripeConfiguration
              publishableKey={data && data.configuration.publishableKey}
              secretKey={data && data.configuration.secretKey}
            />
          </Grid>
          <Grid item sx={12} md={12} lg={5}>
            <PaypalConfiguration
              clientId={data && data.configuration.clientId}
              clientSecret={data && data.configuration.clientSecret}
              sandbox={data && data.configuration.sandbox}
            />
          </Grid>
          <Grid item sx={12} md={12} lg={5}>
            <CurrencyConfiguration
              currencyCode={data && data.configuration.currency}
              currencySymbol={data && data.configuration.currencySymbol}
            />
          </Grid>
          <Grid item sx={12} md={12} lg={5}>
            <DeliveryRateConfiguration
              deliveryRate={data && data.configuration.deliveryRate}
            />
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default withTranslation()(Configuration)
