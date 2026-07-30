import { APP_MODES } from './constants'

export const getModeHomeRoute = mode => (
  mode === APP_MODES.SINGLE
    ? { name: 'SVRoot', params: { screen: 'SVDiscovery' } }
    : { name: 'Main', params: { screen: 'Discovery' } }
)

export const getModeProfileRoute = (mode, params) => (
  mode === APP_MODES.SINGLE
    ? { name: 'SVAccountProfile', params }
    : { name: 'Profile', params }
)

export const getModeProfileTabRoute = mode => (
  mode === APP_MODES.SINGLE
    ? { name: 'SVRoot', params: { screen: 'SVProfile' } }
    : { name: 'Main', params: { screen: 'Profile' } }
)
