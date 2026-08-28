// components/SmallHeader/styles.js
import { StyleSheet, Platform, StatusBar } from 'react-native'
import { scale } from '../../../utils/scaling'

const styles = (props = null) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    backgroundColor: props?.colors?.canvas ?? props?.themeBackground,
    paddingHorizontal: scale(15),
    paddingTop: Platform.OS === 'ios' ? scale(44) : StatusBar.currentHeight,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: props?.colors?.borderSubtle ?? 'rgba(161, 161, 170, 0.22)'
  },
  iconButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(999),
    backgroundColor: props?.colors?.surfaceSubtle ?? 'transparent',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: props?.colors?.borderSubtle ?? 'transparent'
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: scale(10)
  },
  title: {
    fontSize: scale(16),
    textAlign: 'center'
  }
})

export default styles
