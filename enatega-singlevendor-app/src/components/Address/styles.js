import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      flexDirection: 'row',
      alignSelf: 'flex-start',
    },
    textBtn: {
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'flex-end',
      ...alignment.PBsmall
    },
  
    modalContainer: {
      flex: 1,
      backgroundColor: props !== null ? props?.cardBackground : '#FAFAFA',
      borderColor: props !== null ? props?.customBorder : 'transparent',
      ...alignment.PTmedium,
      ...alignment.PRlarge,
      ...alignment.PLlarge
    },
    modalTextBtn: {
      // alignSelf: 'flex-end',
      height: scale(30),
      width: scale(30),
      ...alignment.MTsmall
    },
    dismissOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    searchInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      height: scale(44),
      borderWidth: 1,
      borderColor: props !== null ? props?.customBorder : '#D1D5DB',
      borderRadius: scale(8),
      backgroundColor: props !== null ? props?.themeBackground : '#FFFFFF',
      paddingHorizontal: scale(12),
      gap: scale(8)
    },
    searchInput: {
      flex: 1,
      height: '100%',
      paddingVertical: 0,
      textAlignVertical: 'center',
      fontSize: scale(15),
      color: props !== null ? props?.newFontcolor : '#111827'
    },
    predictionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(10),
      paddingVertical: scale(12),
      paddingHorizontal: scale(12)
    },
    predictionDivider: {
      height: 1,
      backgroundColor: props !== null ? props?.customBorder : '#E5E7EB'
    },
    locationIcon:{
      backgroundColor: props != null ? props?.themeBackground : '#E5E7EB',
      width: 28,
      height: 28,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
export default styles
