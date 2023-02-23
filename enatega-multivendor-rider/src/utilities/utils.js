import moment from 'moment'
import { MAX_TIME } from './constants'

export const getRemainingAcceptingTime = acceptedAt =>
  moment(acceptedAt).add(MAX_TIME, 'seconds').diff(new Date(), 'seconds')
