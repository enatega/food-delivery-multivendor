import { StyleSheet } from 'react-native'
import { scale, verticalScale } from '../../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : '#F9FAFB'
    },
    keyboardView: {
      flex: 1
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(16),
      paddingBottom: verticalScale(16),
      flex:1,
      justifyContent:'flex-end',
    },
    messageContainer: {
      marginBottom: verticalScale(24),
      alignItems: 'flex-start'
    },
    messageBubble: {
      backgroundColor: props?.colorBgTertiary ,
      borderRadius: scale(16),
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12),
      maxWidth: '80%',
      marginBottom: verticalScale(4)
    },
    messageText: {
      fontSize: scale(15),
      lineHeight: scale(20)
    },
    timestamp: {
      color: props?.colorTextMuted ,
      fontSize: scale(12),
      marginLeft: scale(4),
      opacity: 0.6
    },
    quickActionsContainer: {
      marginBottom: verticalScale(16)
    },
    buttonsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: verticalScale(8)
    },
    quickActionButton: {
      borderWidth: 1,
      borderColor: props?.singlevendorcolor || '#0090CD',
      backgroundColor: props?.cardBackground || '#FFFFFF',
      borderRadius: scale(8),
      borderBottomRightRadius: scale(0),
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(10),
      flex: 1,
      marginLeft: scale(8)
    },
    quickActionButtonNoMargin: {
      borderWidth: 1,
      borderColor: props?.singlevendorcolor || '#0090CD',
      backgroundColor: props?.cardBackground || '#FFFFFF',
      borderRadius: scale(8),
      borderBottomRightRadius: scale(0),
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(10),
      flex: 0,
      width: 'auto',
      marginLeft: 0,
    },
    firstRowButton: {
      alignSelf: 'flex-end',
      marginBottom: verticalScale(8),
      marginLeft: 0,
      flex: 0,
      width: 'auto',
      minWidth: scale(140),
    },
    buttonsRowLeft: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: verticalScale(8),
      width: '100%'
    },
    quickActionText: {
      fontSize: scale(12),
      fontWeight: '500',
      textAlign: 'center',
    },
    inputContainer: {
      alignItems: 'center',
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12),
      backgroundColor: props?.headerMenuBackground || '#FFFFFF',
      borderTopColor: props?.horizontalLine || '#E5E5E5',
    },
    TextInputContainer: {
      width: '100%',
    },
    inputContainerInner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    attachButton: {
      marginRight: scale(12),
      padding: scale(4)
    },
    textInput: {
      fontSize: scale(15),
      color: props?.fontMainColor || '#000000',
      maxHeight: verticalScale(100),
      paddingVertical: verticalScale(8),
    },
    sendButton: {
      marginLeft: scale(12),
      padding: scale(4),
      backgroundColor: props?.colorBgTertiary,
      borderRadius: scale(16),
    }
  })

export default styles
