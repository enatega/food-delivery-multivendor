const MAX_TIME = 120
const MIN_WITHDRAW_AMOUNT = 10

const APP_NAME = 'enatega'

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

const WEBSITE_URL = 'http://enatega.com'
const NINJASCODE_URL = 'https://ninjascode.com'
const PRODUCT_PAGE =
  "'https://market.nativebase.io/view/enatega-multivendor-food-backend-app'"
const DOCS = 'https://enatega-multi.gitbook.io/enatega-multivendor/'
const BLOG =
  'https://blog.geekyants.com/enatega-multivendor-foodpanda-clone-v1-0-0-e4b4f21ba1c1'

export {
  MAX_TIME,
  MIN_WITHDRAW_AMOUNT,
  APP_NAME,
  BACKEND_URL,
  WEBSITE_URL,
  NINJASCODE_URL,
  PRODUCT_PAGE,
  DOCS,
  BLOG
}
