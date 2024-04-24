import { StyleSheet } from 'react-native'
import { verticalScale, scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      padding: scale(10),
      marginBottom: scale(10)
    },
    filterButton: {
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: scale(20),
      backgroundColor: props !== null ? props.filtersBg : '#f0f0f0',
      marginRight: scale(10)
    },
    selectedFilterButton: {
      backgroundColor: props !== null ? props.main : '#90E36D'
    },
    filterText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: props !== null ? props.newFontcolor : '#90E36D',
      marginRight: scale(10)
    },
    filterButtonText: {
      fontSize: 14,
      marginRight: scale(10)
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: scale(2),
      rowGap: scale(10)
    },
    modalContainer: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      paddingTop: scale(20),
      paddingHorizontal: scale(20)
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: scale(40),
      paddingHorizontal: scale(18),
      backgroundColor: props !== null ? props.themeBackground : '#fff',

    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: scale(10),
      marginTop: scale(10)
    },
    modalItem: {
      paddingVertical: scale(10),
      borderBottomWidth: 0.5,
      borderBottomColor: props !== null ? props.white : '#fff'
    },
    modalItemText: {
      fontSize: 16,
      
    },
    saveBtnContainer: {
      width: '100%',
      height: verticalScale(60),
      borderRadius: scale(30),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props !== null ? props.main : '#90E36D',
      alignSelf: 'center',
      marginTop: scale(20),
      marginBottom: scale(40)
    },
    selectedModalItem: {
      backgroundColor: props !== null ? props.borderColor : '#efefef'
    }
  })
export default styles
