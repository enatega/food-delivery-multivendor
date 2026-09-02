// import 'expo-dev-client'

import 'react-native-gesture-handler'
import { registerRootComponent } from 'expo'
import { registerLiveActivityBackgroundHandler } from './src/utils/liveActivityMessaging'

import App from './App'

registerLiveActivityBackgroundHandler()

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
