import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { theme } from '../../utils/themeColors'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: props !== null ? props?.themeBackground : '#FFF',
      paddingTop: scale(10),
    },
    tagView: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      rowGap: scale(10),
      columnGap: scale(10),
      ...alignment.MTmedium,
      ...alignment.PLmedium,
      ...alignment.PRmedium
    },
    tagItem: {
      backgroundColor: props !== null ? props?.main : '#90E36D',
      minHeight: scale(40),
      maxWidth: scale(220),
      justifyContent: 'center',
      paddingVertical: scale(10),
      paddingHorizontal: scale(16),
      borderRadius: scale(20)
    },
    emptyViewContainer:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    emptyViewBox: {
      backgroundColor: props != null ? props?.newBackground : '#f0f0f0',
      borderRadius: scale(10),
      width: '85%',
      height: verticalScale(130),
      justifyContent: 'center',
      alignItems: 'center',
      padding: scale(15),
      marginTop: scale(30),
      borderColor: props !== null ? props?.gray200 : '#E5E7EB',
      borderWidth:scale(1),
      borderRadius:scale(10)
    },
    searchList: {
      marginBottom: 70,
      ...alignment.MTsmall,
      ...alignment.Pmedium
    },
    flexRow: {
      display: 'flex',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      ...alignment.Msmall
    },
    recentSearchContainer: {
      ...alignment.Psmall
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: props !== null ? props?.color6 : '#9B9A9A',
      paddingTop: scale(1)
    },
    recentListBtn: {
      display: 'flex',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      ...alignment.Psmall,
      gap: scale(10)
    },
    searchbar: {
      ...alignment.Pmedium
    }
  })
export default styles
