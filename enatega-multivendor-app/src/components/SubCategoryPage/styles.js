import { StyleSheet, Dimensions } from 'react-native'
import { scale } from '../../utils/scaling'
import { alignment } from '../../utils/alignment'
import { verticalScale } from '../../utils/scaling'
import { textStyles } from '../../utils/textStyles'

const { width } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: props?.themeBackground
    },
    container2: {
      flex: 1,
      flexDirection: 'column',
      flexDirection: 'row',
      // gap: 15,
      paddingHorizontal: 18,
      paddingVertical: 10,
      // backgroundColor: '#eee',
      backgroundColor: props?.subCategoryTopSection,
      // backgroundColor: props?.themeBackground,
      // borderBottomWidth: 1,
      // borderBottomColor: props?.borderColor,
      paddingBottom: 2
    },
    backgroundColor: props?.themeBackground,
    topSectionColor: props?.subCategoryTopSection,
    animatedContainer: {
      flex: 1,
      width: width
    },
    scrollContent: {
      paddingBottom: scale(20)
    },
    listContainer: {
      paddingHorizontal: scale(15)
    },
    categoryItem: {
      width: 180,
      paddingHorizontal: scale(16),
      paddingVertical: scale(8),
      // borderRadius: scale(20),
      // backgroundColor: props?.gray100,
      // marginRight: scale(2),
      textAlign: 'center',
      alignItems: 'center',

      borderBottomWidth: 1,
      borderBottomColor: props !== null ? '#DAD6D6' : props?.primary
    },
    selectedCategoryItem: {
      borderWidth: 0,
      borderBottomWidth: 2,
      borderBottomColor: props?.primary
    },
    categoryText: {
      fontSize: scale(12)
    },
    selectedCategoryText: {
      color: props?.primary
    },
    // Sub Category
    subcategoryItem: {
      width: 120,
      paddingHorizontal: scale(16),
      paddingVertical: scale(6),
      borderRadius: scale(20),
      marginRight: scale(8),
      textAlign: 'center',
      alignItems: 'center'
    },
    // Sub Category LTR with better spacing
    subcategoryItemltr: {
      width: 140,
      paddingHorizontal: scale(18),
      paddingVertical: scale(8),
      borderRadius: scale(20),
      marginRight: scale(12),
      textAlign: 'center',
      alignItems: 'center'
    },
    selectedSubcategoryItem: {
      backgroundColor: props?.primary
    },
    subcategoryText: {
      fontSize: scale(12)
    },
    selectedSubcategoryText: {
      color: props?.buttonText
    },
    sectionHeader: {
      paddingVertical: scale(12),
      paddingHorizontal: scale(15),
      backgroundColor: props?.themeBackground,
      marginTop: 0,
      marginBottom: 0
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: scale(10)
    },
    emptyContainer: {
      flex: 1,
      paddingTop: scale(100),
      alignItems: 'center'
    },
    buttonContainer: {
      width: '100%',
      height: '10%',
      backgroundColor: props !== null ? props.themeBackground : 'black',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 12,
      shadowColor: props !== null ? props.shadowColor : 'black',
      shadowOffset: {
        width: 0,
        height: -verticalScale(3)
      },
      shadowOpacity: 0.5,
      shadowRadius: verticalScale(2)
    },
    button: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: scale(40),
      backgroundColor: props !== null ? props.main : 'black',
      height: '75%',
      width: '95%',
      ...alignment.PLsmall,
      ...alignment.PRsmall
    },
    buttonText: {
      width: '30%',
      color: 'black'
    },
    buttonTextRight: {
      width: '35%'
    },
    buttontLeft: {
      width: '35%',
      height: '50%',
      justifyContent: 'center'
    },
    buttonLeftCircle: {
      backgroundColor: props != null ? props.black : 'black',
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonTextLeft: {
      ...textStyles.Bolder,
      ...textStyles.Center,
      ...textStyles.Smaller,
      backgroundColor: 'transparent',
      color: props != null ? props.white : 'white'
    }
  })

export default styles
