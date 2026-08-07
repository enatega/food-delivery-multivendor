import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      backgroundColor: props?.colors?.canvas ?? props?.themeBackground ?? '#fff'
    },
    scrollViewContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: props != null ? props?.themeBackground : '#fff'
    },
    subContainer: {
      width: '100%',
      backgroundColor: props?.colors?.canvas ?? props?.themeBackground ?? '#fff',
      paddingHorizontal: props?.spacing?.md ?? scale(12)
    },
    scrollViewStyle: {
      backgroundColor: props?.colors?.canvas ?? props?.themeBackground ?? '#fff'
    },
    scrollContent: {
      paddingBottom: scale(116)
    },
    productIntro: {
      paddingHorizontal: props?.spacing?.md ?? scale(12),
      paddingTop: props?.spacing?.sm ?? scale(8),
      paddingBottom: props?.spacing?.sm ?? scale(8)
    },
    productImage: {
      width: '100%',
      height: scale(226),
      margin: 0,
      borderRadius: props?.radii?.lg ?? scale(14),
      overflow: 'hidden',
      backgroundColor: props?.colors?.surfaceSubtle ?? '#202024'
    },
    imageFallback: {
      width: '100%',
      height: scale(190),
      borderRadius: props?.radii?.lg ?? scale(14),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props?.colors?.surfaceSubtle ?? '#202024'
    },
    headerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: props != null ? props?.themeBackground : '#fff',
      zIndex: 3
    },
    titleContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: props != null ? props?.themeBackground : '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: scale(32)
    },
    line: {
      width: '100%',
      height: StyleSheet.hairlineWidth,
      marginVertical: props?.spacing?.lg ?? scale(16),
      backgroundColor: props?.colors?.borderSubtle ?? 'rgba(24, 24, 27, 0.10)'
    },
    optionSection: {
      paddingVertical: props?.spacing?.sm ?? scale(8),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: props?.colors?.borderSubtle ?? 'rgba(161, 161, 170, 0.22)'
    },
    input: {
      backgroundColor: props?.colors?.surfaceSubtle ?? props?.themeBackground ?? '#202024',
      borderRadius: props?.radii?.lg ?? scale(14),
      minHeight: scale(88),
      paddingHorizontal: scale(12),
      paddingVertical: scale(11),
      color: props?.colors?.textPrimary ?? '#FAFAFA',
      ...props?.typeScale?.body,
      textAlignVertical: 'top',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle ?? '#B8B8B8',
      textAlign: props?.isRTL ? 'right' : 'left'
    },
    inputContainer: {
      width: '100%',
      paddingTop: props?.spacing?.sm ?? scale(8),
      paddingBottom: props?.spacing?.md ?? scale(12),
      zIndex: 1
    },
    backBtnContainer: {
      borderRadius: scale(50),
      width: scale(55),
      alignItems: 'center'
    },
    descriptionText: {
      color: props?.colors?.textSecondary ?? props?.darkBgFont ?? '#52525B',
      ...props?.typeScale?.body,
      paddingHorizontal: scale(2),
      paddingBottom: props?.spacing?.sm ?? scale(8)
    },
    cartFooter: {
      zIndex: 10,
      backgroundColor: props?.colors?.surface ?? props?.themeBackground ?? '#18181B',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: props?.colors?.borderSubtle ?? 'rgba(161, 161, 170, 0.22)'
    }
  })
export default styles
