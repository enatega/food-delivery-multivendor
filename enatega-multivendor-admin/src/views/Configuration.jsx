import React from 'react'
import { withTranslation } from 'react-i18next'
import { useQuery, gql } from '@apollo/client'
import Header from '../components/Headers/Header'
import { getConfiguration } from '../apollo'
import EmailConfiguration from '../components/Configuration/Email/Email'
import Email from '../components/Configuration/FormEmail/FormEmail'
import DeliveryRateConfiguration from '../components/Configuration/DeliveryRate/DeliveryRate'
import PaypalConfiguration from '../components/Configuration/Paypal/Paypal'
import StripeConfiguration from '../components/Configuration/Stripe/Stripe'
import CurrencyConfiguration from '../components/Configuration/Currency/Currency'
import { Grid } from '@mui/material'
import { ReactComponent as ConfigIcon } from '../assets/svg/svg/Configuration.svg'
import TwilioConfiguration from '../components/Configuration/Twilio/Twilio'
import VerificationConfiguration from '../components/Configuration/Verification/Verification'
import SendGridConfiguration from '../components/Configuration/SendGrid/SendGrid'

import SentryConfiguration from '../components/Configuration/Sentry/Sentry'
import GoogleApiKeyConfiguration from '../components/Configuration/GoogleApi/GoogleApi'
import CloudinaryConfiguration from '../components/Configuration/ Cloudinary/ Cloudinary'
import AmplitudeApiKeyConfiguration from '../components/Configuration/Amplitude/Amplitude'
import GoogleClientIDConfiguration from '../components/Configuration/GoogleClient/GoogleClient'
import WebConfiguration from '../components/Configuration/Web/Web'
import AppConfigurations from '../components/Configuration/App/App'
import FirebaseConfiguration from '../components/Configuration/FireBase/FireBase'
import Configuration1 from './Configuration1'

const GET_CONFIGURATION = gql`
  ${getConfiguration}
`
const Configuration = props => {
  const { data, error: errorQuery, loading: loadingQuery } = useQuery(
    GET_CONFIGURATION
  )

  const { t } = props
  
  return (
    <>
      <Header />
      {errorQuery && t('Error')}
      {loadingQuery ? (
        t('LoadingDots')
      ) : (
        data.configuration.isPaidVersion?
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
                  deliveryRate={data && data?.configuration?.deliveryRate}
                  costType={data && data?.configuration?.costType}
              />
          </Grid>
          <Grid item sx={12} md={12} lg={5}>
            <TwilioConfiguration
              twilioAccountSid={data && data.configuration.twilioAccountSid}
              twilioAuthToken={data && data.configuration.twilioAuthToken}
              twilioPhoneNumber={data && data.configuration.twilioPhoneNumber}
              twilioEnabled={data && data.configuration.twilioEnabled}
            />
          </Grid>
          <Grid item sx={12} md={12} lg={5}>
            <Email formEmail={data && data.configuration.formEmail} />
          </Grid>
          <Grid item sx={12} md={12} lg={5}>
            <SendGridConfiguration
              sendGridApiKey={data && data.configuration.sendGridApiKey}
              sendGridEnabled={data && data.configuration.sendGridEnabled}
              sendGridEmail={data && data.configuration.sendGridEmail}
              sendGridEmailName={data && data.configuration.sendGridEmailName}
              sendGridPassword={data && data.configuration.sendGridPassword}
            />
          </Grid>

          <Grid item sx={12} md={12} lg={5}>
            <WebConfiguration
              googleMapLibraries={data && data.configuration.googleMapLibraries}
              googleColor={data && data.configuration.googleColor}
            />
          </Grid>
          <Grid item sx={12} md={12} lg={5}>
            <SentryConfiguration
              dashboardSentryUrl={data && data.configuration.dashboardSentryUrl}
              webSentryUrl={data && data.configuration.webSentryUrl}
              apiSentryUrl={data && data.configuration.apiSentryUrl}
              customerAppSentryUrl={
                data && data.configuration.customerAppSentryUrl
              }
              restaurantAppSentryUrl={
                data && data.configuration.restaurantAppSentryUrl
              }
              riderAppSentryUrl={data && data.configuration.riderAppSentryUrl}
            />
          </Grid>
          <Grid item sx={12} md={12} lg={5}>
            <GoogleApiKeyConfiguration
              googleApiKey={data && data.configuration.googleApiKey}
            />
          </Grid>
          <Grid item sx={12} md={12} lg={5}>
            <CloudinaryConfiguration
              cloudinaryUploadUrl={
                data && data.configuration.cloudinaryUploadUrl
              }
              cloudinaryApiKey={data && data.configuration.cloudinaryApiKey}
            />
          </Grid>
          <Grid item sx={12} md={12} lg={5}>
            <AmplitudeApiKeyConfiguration
              webAmplitudeApiKey={data && data.configuration.webAmplitudeApiKey}
              appAmplitudeApiKey={data && data.configuration.appAmplitudeApiKey}
            />
          </Grid>
          <Grid item sx={12} md={12} lg={5}>
            <GoogleClientIDConfiguration
              webClientID={data && data.configuration.webClientID}
              androidClientID={data && data.configuration.androidClientID}
              iOSClientID={data && data.configuration.iOSClientID}
              expoClientID={data && data.configuration.expoClientID}
            />
          </Grid>
          <Grid item sx={12} md={12} lg={5}>
            <FirebaseConfiguration
              firebaseKey={data && data.configuration.firebaseKey}
              authDomain={data && data.configuration.authDomain}
              projectId={data && data.configuration.projectId}
              storageBucket={data && data.configuration.storageBucket}
              msgSenderId={data && data.configuration.msgSenderId}
              appId={data && data.configuration.appId}
              measurementId={data && data.configuration.measurementId}
              vapidKey={data && data.configuration.vapidKey}
            />
          </Grid>
          <Grid item sx={12} md={12} lg={5}>
            <AppConfigurations
              termsAndConditions={data && data.configuration.termsAndConditions}
              privacyPolicy={data && data.configuration.privacyPolicy}
              testOtp={data && data.configuration.testOtp}
            />
          </Grid>
          <Grid item sx={12} md={12} lg={5}>
          <VerificationConfiguration
          skipEmailVerification={data.configuration.skipEmailVerification}
          skipMobileVerification={data.configuration.skipMobileVerification}
            />
          </Grid>
        </Grid>:
        <Configuration1 t={t}/>
      )}
    </>
  )
}

export default withTranslation()(Configuration)
