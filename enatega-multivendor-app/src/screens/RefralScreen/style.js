import { StyleSheet, Dimensions } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale, verticalScale } from '../../utils/scaling'

const { height } = Dimensions.get('window')

// Responsive scaling based on screen height
const getResponsiveSize = (baseSize) => {
  if (height < 680) return baseSize * 0.9
  if (height > 800) return baseSize * 1.1
  return baseSize
}

const styles = (currentTheme) =>
  StyleSheet.create({
    safeAreaViewStyles: {
      flex: 1,
      backgroundColor: currentTheme?.themeBackground || '#FFFFFF'
    },
    keyboardView: {
      flex: 1
    },
    scrollContent: {
      flexGrow: 1
    },
    container: {
      flex: 1,
      backgroundColor: currentTheme?.themeBackground || '#FFFFFF',
      paddingHorizontal: scale(20),
      ...alignment.PTlarge
    },
    // GIF Container - Responsive
    gifContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: verticalScale(24),
      paddingTop: verticalScale(10),
      minHeight: getResponsiveSize(height * 0.25),
      maxHeight: getResponsiveSize(height * 0.35)
    },
    gifImage: {
      width: '85%',
      height: getResponsiveSize(height * 0.2),
      maxWidth: scale(300),
      maxHeight: verticalScale(250)
    },
    fastImage: {
      width: getResponsiveSize(scale(120)),
      height: getResponsiveSize(verticalScale(40)),
      marginTop: alignment.MTsmall,
      maxWidth: scale(140),
      maxHeight: verticalScale(50)
    },
    headerSection: {
      marginBottom: verticalScale(32),
      alignItems: 'center'
    },
    title: {
      marginBottom: verticalScale(12),
      textAlign: 'center'
    },
    description: {
      textAlign: 'center',
      paddingHorizontal: scale(10),
      lineHeight: verticalScale(20)
    },
    inputSection: {
      width: '100%',
      marginBottom: verticalScale(24)
    },
    inputContainer: {
      width: '100%'
    },
    textInput: {
      borderColor: currentTheme?.borderColor || '#efefef',
      borderWidth: scale(1),
      borderRadius: scale(8),
      backgroundColor: currentTheme?.themeBackground || '#FFFFFF',
      padding: scale(16),
      color: currentTheme?.newFontcolor || '#000000',
      fontSize: scale(16),
      textAlign: currentTheme?.isRTL ? 'right' : 'left',
      minHeight: verticalScale(50)
    },
    buttonContainer: {
      flexDirection: 'column',
      paddingHorizontal: scale(20),
      paddingBottom: verticalScale(20),
      paddingTop: verticalScale(12),
      backgroundColor: currentTheme?.themeBackground || '#FFFFFF',
      gap: scale(12),
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: currentTheme?.borderColor || '#efefef'
    },
    continueButton: {
      width: '100%',
      backgroundColor: currentTheme?.singlevendorcolor  ,
      borderRadius: scale(8),
      paddingVertical: verticalScale(16),
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: verticalScale(50)
    },
    skipButton: {
      width: '100%',
      backgroundColor: currentTheme?.customBorder ,
      borderRadius: scale(8),
      paddingVertical: verticalScale(16),
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: verticalScale(50)
    },
    disabledButton: {
      opacity: 0.5
    }
  })

export default styles
