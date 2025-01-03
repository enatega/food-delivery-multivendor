import { StyleSheet, Platform, NativeModules } from 'react-native'
const { StatusBarManager } = NativeModules

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 20,
    left: 20,
    backgroundColor: 'black',
    width: 30,
    height: 30,
    zIndex: 9999,
    elevation: 9999,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
export default styles
