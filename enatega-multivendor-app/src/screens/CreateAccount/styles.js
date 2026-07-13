import { scale } from '../../utils/scaling'
import { Dimensions, StyleSheet, Platform } from 'react-native'
import { alignment } from '../../utils/alignment'
const { height, width } = Dimensions.get('window')

// Responsive scaling based on screen height
const getResponsiveSize = (baseSize) => {
  if (height < 680) return baseSize * 0.9
  if (height > 800) return baseSize * 1.1
  return baseSize
}

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      flex: 1
      // backgroundColor: props !== null ? props?.themeBackground : '#FFF'
    },

    // GIF Container
    gifContainer: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'space-between'
    },
    gifImage: {
      width: '90%',
      height: '90%'
    },

    // Welcome Section
    welcomeSection: {
      paddingHorizontal: scale(10),
      paddingVertical: getResponsiveSize(scale(10)),
      alignItems: 'center'
    },
    mainTitle: {
      marginBottom: getResponsiveSize(scale(8)),
      // fontSize: getResponsiveSize(scale(28)),
      // lineHeight: getResponsiveSize(scale(32)),
      textAlign: 'center'
    },
    subTitle: {
      lineHeight: getResponsiveSize(scale(20)),
      fontSize: getResponsiveSize(scale(14)),
      paddingHorizontal: scale(10),
      textAlign: 'center'
    },

    // Buttons Container
    buttonsContainer: {
      paddingHorizontal: scale(20),
      gap: getResponsiveSize(scale(10)),
      paddingBottom: getResponsiveSize(scale(10))
    },

    // Guest Button
    guestButton: {
      alignItems: 'center',
      paddingVertical: getResponsiveSize(scale(12))
    },

    // via Phone Button
    viaPhoneButton: {
      alignItems: 'center',
      paddingVertical: getResponsiveSize(scale(12)),
      backgroundColor: props !== null ? props?.primary : '#000',
      borderRadius: 6
    },

    // Loading State
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonBackground: {
      width: '100%',
      backgroundColor: props !== null ? props?.newFontcolor : '#000',
      borderRadius: scale(8),
      height: getResponsiveSize(height * 0.06)
    },
    appleBtn: {
      width: '100%',
      height: getResponsiveSize(height * 0.06)
    },

    safeAreaViewStyles: {
      flex: 1,
      backgroundColor: props !== null ? props?.themeBackground : '#FFF'
    }
  })

export default styles
