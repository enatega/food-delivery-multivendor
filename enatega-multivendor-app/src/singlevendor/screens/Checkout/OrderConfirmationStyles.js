import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/scaling';
import { alignment } from '../../../utils/alignment';

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
    stickyBottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      paddingTop: scale(12),
      paddingHorizontal: scale(16),
      paddingBottom: scale(30),
      borderTopWidth: 1,
      borderTopColor: props !== null ? props.gray200 : '#E5E7EB',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5
    },
    backButton: {
      width: scale(36),
      height: scale(36),
      borderRadius: scale(18),
      backgroundColor: props !== null ? props.colorBgTertiary : '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    helpButton: {
      ...alignment.PRsmall,
      padding: scale(8)
    },
    orderAgainButton: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      height: scale(50),
      backgroundColor: props !== null ? props.singlevendorcolor : '#0EA5E9',
      borderRadius: scale(8),
      marginTop: scale(12)
    }
  });

export default styles;
