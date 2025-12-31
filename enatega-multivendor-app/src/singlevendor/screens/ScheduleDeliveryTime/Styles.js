import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/scaling';

const styles = (props = null) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : '#fff'
    },
    scrollView: {
      flex: 1
    },
    contentContainer: {
      paddingBottom: scale(20)
    },
    infoContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      width: '100%',
      // paddingHorizontal: scale(16),
      // paddingVertical: scale(12),
      backgroundColor: props !== null ? props.gray50 : '#F9FAFB',
      borderRadius: scale(8)
    },
    bottomInfoContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      // paddingHorizontal: scale(16),
      paddingTop: scale(12),
      paddingBottom: scale(8),
      width: "100%",
      
      // borderTopWidth: 1,
      // borderTopColor: props !== null ? props.gray200 : '#E5E7EB'
    },
    infoIcon: {
      // marginRight: scale(8)
      fontWeight: "bold"
    },
    infoText: {
      textAlign: "center",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      // width: "100%",
      // flex: 1

    },
    bottomContainer: {
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      paddingHorizontal: scale(16),
      paddingTop: scale(8),
      paddingBottom: scale(30),
      // borderTopWidth: 1,
      // borderTopColor: props !== null ? props.gray200 : '#E5E7EB',
      // shadowColor: '#000',
      // shadowOffset: {
      //   width: 0,
      //   height: -2
      // },
      // shadowOpacity: 0.1,
      // shadowRadius: 2,
      // elevation: 5
    },
    confirmButton: {
      backgroundColor: props !== null ? props.primaryBlue : '#0EA5E9',
      paddingVertical: scale(14),
      borderRadius: scale(8),
      alignItems: 'center',
      justifyContent: 'center'
    },
    confirmButtonDisabled: {
      backgroundColor: props !== null ? props.gray200 : '#E5E7EB'
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: scale(32)
    },
    retryButton: {
      backgroundColor: props !== null ? props.primaryBlue : '#0EA5E9',
      paddingVertical: scale(12),
      paddingHorizontal: scale(32),
      borderRadius: scale(8),
      minWidth: scale(120),
      alignItems: 'center',
      justifyContent: 'center'
    },
    noSlotsContainer: {
      paddingHorizontal: scale(16),
      paddingVertical: scale(32),
      alignItems: 'center'
    }
  });

export default styles;
