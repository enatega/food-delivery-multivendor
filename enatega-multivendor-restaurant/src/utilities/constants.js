const APP_NAME = 'enatega'
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const TIMES = [10, 20, 30, 40, 50, 60, 70, 80, 90]
const MAX_TIME = 120

const BACKEND_URL = {
  LOCAL: {
    GRAPHQL_URL: 'http://10.97.31.30:8001/graphql',
    WS_GRAPHQL_URL: 'ws://10.97.31.30:8001/graphql'
  },
  LIVE: {
    GRAPHQL_URL: 'https://enatega-multivendor.up.railway.app/graphql',
    WS_GRAPHQL_URL: 'wss://enatega-multivendor.up.railway.app/graphql'
  }
}

const WEBSITE_URL = 'https://enatega.com'
const PRODUCT_URL =
  'https://enatega.com/enatega-multi-vendor/'
const PRIVACY_URL =
  'https://enatega.com/privacy-policy/'
const ABOUT_URL = 'https://ninjascode.com/about-us/'


export { APP_NAME,DAYS, TIMES, MAX_TIME, BACKEND_URL, WEBSITE_URL,PRODUCT_URL, PRIVACY_URL, ABOUT_URL  }
