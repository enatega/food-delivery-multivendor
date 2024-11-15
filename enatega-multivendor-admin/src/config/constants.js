import { useContext } from 'react'
import ConfigurationContext from '../context/Configuration'

const ConfigurableValues = () => {
  const configuration = useContext(ConfigurationContext)

  const SERVER_URL = 'https://enatega-multivendor.up.railway.app'
  const WS_SERVER_URL = 'wss://enatega-multivendor.up.railway.app'
  // const SERVER_URL = 'http://localhost:8001'
  // const WS_SERVER_URL = 'ws://localhost:8001'
  const GOOGLE_MAPS_KEY = configuration.googleApiKey
  const FIREBASE_KEY = configuration.firebaseKey
  const APP_ID = configuration.appId
  const AUTH_DOMAIN = configuration.authDomain
  const STORAGE_BUCKET = configuration.storageBucket
  const MSG_SENDER_ID = configuration.msgSenderId
  const MEASUREMENT_ID = configuration.measurementId
  const PROJECT_ID = configuration.projectId
  const SENTRY_DSN = configuration.dashboardSentryUrl
  const CLOUDINARY_UPLOAD_URL = configuration.cloudinaryUploadUrl
  const CLOUDINARY_FOOD = configuration.cloudinaryApiKey
  const VAPID_KEY = configuration.vapidKey
  const PAID_VERSION = configuration.isPaidVersion

  return {
    GOOGLE_MAPS_KEY,
    FIREBASE_KEY,
    APP_ID,
    AUTH_DOMAIN,
    STORAGE_BUCKET,
    MSG_SENDER_ID,
    MEASUREMENT_ID,
    PROJECT_ID,
    SERVER_URL,
    WS_SERVER_URL,
    SENTRY_DSN,
    CLOUDINARY_UPLOAD_URL,
    CLOUDINARY_FOOD,
    VAPID_KEY,
    PAID_VERSION
  }
}

export default ConfigurableValues
