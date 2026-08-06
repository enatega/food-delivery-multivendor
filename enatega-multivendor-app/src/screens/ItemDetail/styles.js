import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
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
      paddingHorizontal: props?.spacing?.lg ?? scale(16)
    },
    scrollViewStyle: {
      backgroundColor: props?.colors?.canvas ?? props?.themeBackground ?? '#fff'
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
    input: {
      backgroundColor: props !== null ? props?.themeBackground : 'black',
      borderRadius: props?.radii?.md ?? scale(10),
      height: scale(50),
      paddingLeft: scale(10),
      textAlignVertical: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle ?? '#B8B8B8',
      textAlign: props?.isRTL ? 'right' : 'left'
    },
    inputContainer: {
      alignSelf: 'center',
      zIndex: scale(1)
    },
    backBtnContainer: {
      borderRadius: scale(50),
      width: scale(55),
      alignItems: 'center'
    },
    descriptionText: {
      color: props?.colors?.textSecondary ?? props?.darkBgFont ?? '#52525B',
      ...props?.typeScale?.body,
      paddingTop: props?.spacing?.md ?? scale(12),
      paddingHorizontal: props?.spacing?.lg ?? scale(16),
      maxWidth: '100%',
      ...alignment.MRxSmall
    }
  })
export default styles
